
const NOTE_NAMES = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];

const instruments = {
  guitar6: {
    name: "6-String Guitar", strings: 6,
    presets: {
      "Standard": ["E2","A2","D3","G3","B3","E4"],
      "Drop D": ["D2","A2","D3","G3","B3","E4"],
      "Half-Step Down": ["Eb2","Ab2","Db3","Gb3","Bb3","Eb4"],
      "D Standard": ["D2","G2","C3","F3","A3","D4"],
      "Drop C": ["C2","G2","C3","F3","A3","D4"]
    }
  },
  guitar12: {
    name: "12-String Guitar", strings: 12,
    presets: {"Standard": ["E2","E3","A2","A3","D3","D4","G3","G4","B3","B3","E4","E4"]}
  },
  bass4: {
    name: "4-String Bass", strings: 4,
    presets: {"Standard": ["E1","A1","D2","G2"], "Drop D": ["D1","A1","D2","G2"]}
  },
  ukulele: {
    name: "Ukulele", strings: 4,
    presets: {"Standard (High G)": ["G4","C4","E4","A4"], "Low G": ["G3","C4","E4","A4"]}
  },
  violin: {
    name: "Violin", strings: 4,
    presets: {"Standard": ["G3","D4","A4","E5"]}
  },
  mandolin: {
    name: "Mandolin", strings: 8,
    presets: {"Standard": ["G3","G3","D4","D4","A4","A4","E5","E5"]}
  },
  banjo5: {
    name: "5-String Banjo", strings: 5,
    presets: {"Open G": ["G4","D3","G3","B3","D4"], "Double C": ["G4","C3","G3","C4","D4"]}
  }
};

const $ = id => document.getElementById(id);
const instrumentSelect = $("instrumentSelect");
const tuningSelect = $("tuningSelect");
const noteDisplay = $("note");
const frequencyDisplay = $("frequency");
const needle = $("needle");
const statusDisplay = $("status");
const substatus = $("substatus");
const stringChips = $("stringChips");
const startButton = $("startButton");
const autoView = $("autoView");
const stringView = $("stringView");
const autoModeBtn = $("autoModeBtn");
const stringModeBtn = $("stringModeBtn");
const headstockSvg = $("headstockSvg");
const pegLayer = $("pegLayer");
const stringLayer = $("stringLayer");
const selectedStringNote = $("selectedStringNote");
const selectedStringFreq = $("selectedStringFreq");
const stringModeStatus = $("stringModeStatus");
const miniNeedle = $("miniNeedle");

const settingsDialog = $("settingsDialog");
const customDialog = $("customDialog");
const manageDialog = $("manageDialog");
const inputWarningDialog = $("inputWarningDialog");

let state = {
  referenceHz: Number(localStorage.getItem("tt_referenceHz")) || 440,
  theme: localStorage.getItem("tt_theme") || "thunder",
  autostart: localStorage.getItem("tt_autostart") === "true",
  feedback: localStorage.getItem("tt_feedback") !== "false",
  instrument: localStorage.getItem("tt_lastInstrument") || "guitar6",
  tuning: localStorage.getItem("tt_lastTuning") || "preset:Standard",
  mode: localStorage.getItem("tt_lastMode") || "auto",
  recent: JSON.parse(localStorage.getItem("tt_recent") || "[]"),
  custom: JSON.parse(localStorage.getItem("tt_custom") || "{}"),
  selectedString: 0
};

let audioContext, analyser, microphone, buffer, mediaStream;
let running = false;
let lastValidReadingAt = 0;
let lastReading = null;
let lowInputSince = 0;
let warningShownThisSession = false;
let warningSuppressedThisSession = false;
let deferredInstallPrompt = null;
let lastSuccessKey = "";
let lastSuccessAt = 0;
let editingCustom = null;

const HOLD_MS = 3500;
const LOW_INPUT_WARNING_MS = 5500;

function noteToMidi(note) {
  const match = note.match(/^([A-G])([#b]?)(-?\d+)$/);
  if (!match) return null;
  const [, letter, accidental, octaveText] = match;
  const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter];
  let semitone = base + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  semitone = (semitone + 12) % 12;
  return (Number(octaveText) + 1) * 12 + semitone;
}

function noteFrequency(note) {
  const midi = noteToMidi(note);
  return state.referenceHz * Math.pow(2, (midi - 69) / 12);
}

function allSelectableNotes() {
  const out = [];
  for (let octave = 0; octave <= 6; octave++) {
    NOTE_NAMES.forEach(n => out.push(`${n}${octave}`));
  }
  return out;
}

function saveState() {
  localStorage.setItem("tt_referenceHz", state.referenceHz);
  localStorage.setItem("tt_theme", state.theme);
  localStorage.setItem("tt_autostart", state.autostart);
  localStorage.setItem("tt_feedback", state.feedback);
  localStorage.setItem("tt_lastInstrument", state.instrument);
  localStorage.setItem("tt_lastTuning", state.tuning);
  localStorage.setItem("tt_lastMode", state.mode);
  localStorage.setItem("tt_recent", JSON.stringify(state.recent));
  localStorage.setItem("tt_custom", JSON.stringify(state.custom));
}

function applyTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  document.querySelectorAll(".theme-choice").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.themeChoice === theme);
  });
  saveState();
}

function buildInstrumentOptions() {
  instrumentSelect.innerHTML = "";
  $("customInstrument").innerHTML = "";
  Object.entries(instruments).forEach(([key, inst]) => {
    [instrumentSelect, $("customInstrument")].forEach(select => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = inst.name;
      select.appendChild(option);
    });
  });
  instrumentSelect.value = instruments[state.instrument] ? state.instrument : "guitar6";
  state.instrument = instrumentSelect.value;
}

function customForInstrument(key) {
  return state.custom[key] || {};
}

function populateTunings(preferred = state.tuning) {
  const inst = instruments[state.instrument];
  tuningSelect.innerHTML = "";

  Object.keys(inst.presets).forEach(name => {
    const o = document.createElement("option");
    o.value = `preset:${name}`;
    o.textContent = name;
    tuningSelect.appendChild(o);
  });

  Object.keys(customForInstrument(state.instrument)).forEach(name => {
    const o = document.createElement("option");
    o.value = `custom:${name}`;
    o.textContent = `★ ${name}`;
    tuningSelect.appendChild(o);
  });

  const add = document.createElement("option");
  add.value = "__add_custom__";
  add.textContent = "+ Add Custom Tuning…";
  tuningSelect.appendChild(add);

  const valid = [...tuningSelect.options].some(o => o.value === preferred);
  tuningSelect.value = valid ? preferred : tuningSelect.options[0].value;
  state.tuning = tuningSelect.value;
  updateTuningUI();
}

function currentTuningNotes() {
  const inst = instruments[state.instrument];
  if (state.tuning.startsWith("preset:")) {
    const name = state.tuning.slice(7);
    return inst.presets[name].map(note => ({note, freq: noteFrequency(note)}));
  }
  if (state.tuning.startsWith("custom:")) {
    const name = state.tuning.slice(7);
    return (customForInstrument(state.instrument)[name] || []).map(x => ({note:x.note, freq:Number(x.freq)}));
  }
  const first = Object.keys(inst.presets)[0];
  return inst.presets[first].map(note => ({note, freq: noteFrequency(note)}));
}

function tuningName(value = state.tuning) {
  return value.includes(":") ? value.split(":").slice(1).join(":") : value;
}

function updateTuningUI() {
  renderStringChips();
  renderHeadstock();
  $("currentSummary").textContent = `${instruments[state.instrument].name} · ${tuningName()}`;
  $("referenceSummary").textContent = `A4 = ${state.referenceHz.toFixed(1)} Hz`;
  state.selectedString = Math.min(state.selectedString, currentTuningNotes().length - 1);
  updateSelectedStringCard();
  saveState();
}

function renderStringChips() {
  stringChips.innerHTML = "";
  currentTuningNotes().forEach((item, i) => {
    const b = document.createElement("button");
    b.className = "string-chip" + (state.mode === "string" && i === state.selectedString ? " active" : "");
    b.textContent = `${i+1}: ${item.note}`;
    b.addEventListener("click", () => {
      state.selectedString = i;
      setMode("string");
      renderHeadstock();
      updateSelectedStringCard();
    });
    stringChips.appendChild(b);
  });
}

function addRecent() {
  const entry = {instrument: state.instrument, tuning: state.tuning, label: `${instruments[state.instrument].name} · ${tuningName()}`};
  state.recent = [entry, ...state.recent.filter(x => !(x.instrument === entry.instrument && x.tuning === entry.tuning))].slice(0, 4);
  saveState();
  renderRecent();
}

function renderRecent() {
  const holder = $("recentTunings");
  holder.innerHTML = "";
  $("recentSection").classList.toggle("hidden", state.recent.length === 0);
  state.recent.forEach(item => {
    const b = document.createElement("button");
    b.className = "recent-chip";
    b.textContent = item.label;
    b.addEventListener("click", () => {
      if (!instruments[item.instrument]) return;
      state.instrument = item.instrument;
      instrumentSelect.value = item.instrument;
      populateTunings(item.tuning);
    });
    holder.appendChild(b);
  });
}

function setMode(mode) {
  state.mode = mode;
  autoModeBtn.classList.toggle("active", mode === "auto");
  stringModeBtn.classList.toggle("active", mode === "string");
  autoView.classList.toggle("hidden", mode !== "auto");
  stringView.classList.toggle("hidden", mode !== "string");
  renderStringChips();
  updateSelectedStringCard();
  saveState();
}

function renderHeadstock() {
  const tuning = currentTuningNotes();
  const n = tuning.length;
  pegLayer.innerHTML = "";
  stringLayer.innerHTML = "";

  const leftCount = Math.ceil(n / 2);
  const rightCount = n - leftCount;

  function pegPos(i) {
    if (n === 5 && state.instrument === "banjo5" && i === 0) return {x:74, y:250, side:"left"};
    const isLeft = i < leftCount;
    const index = isLeft ? i : i-leftCount;
    const count = isLeft ? leftCount : rightCount;
    const y = 160 + (count <= 1 ? 120 : index * (250 / Math.max(1, count-1)));
    return {x: isLeft ? 62 : 258, y, side:isLeft?"left":"right"};
  }

  tuning.forEach((item, i) => {
    const pos = pegPos(i);
    const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", "peg-hit");
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `Tune string ${i+1}, ${item.note}`);

    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y);
    circle.setAttribute("r", 28);
    circle.setAttribute("class", "peg-circle" + (i === state.selectedString ? " selected" : ""));

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y + 6);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "peg-text");
    text.textContent = item.note.replace(/[0-9]/g,"");

    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", pos.x + (pos.side === "left" ? 28 : -28));
    line.setAttribute("y1", pos.y);
    line.setAttribute("x2", 160);
    line.setAttribute("y2", 520);
    line.setAttribute("class", "string-line");
    stringLayer.appendChild(line);

    const select = () => {
      state.selectedString = i;
      renderHeadstock();
      updateSelectedStringCard();
      renderStringChips();
    };
    group.addEventListener("click", select);
    group.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") select(); });

    group.appendChild(circle);
    group.appendChild(text);
    pegLayer.appendChild(group);
  });
}

function updateSelectedStringCard() {
  const tuning = currentTuningNotes();
  if (!tuning.length) return;
  const t = tuning[state.selectedString] || tuning[0];
  selectedStringNote.textContent = t.note;
  selectedStringFreq.textContent = `${t.freq.toFixed(2)} Hz target`;
}

instrumentSelect.addEventListener("change", () => {
  state.instrument = instrumentSelect.value;
  state.selectedString = 0;
  populateTunings();
});

tuningSelect.addEventListener("change", () => {
  if (tuningSelect.value === "__add_custom__") {
    openCustomEditor(null, state.instrument);
    populateTunings(state.tuning);
    return;
  }
  state.tuning = tuningSelect.value;
  state.selectedString = 0;
  addRecent();
  updateTuningUI();
});

autoModeBtn.addEventListener("click", () => setMode("auto"));
stringModeBtn.addEventListener("click", () => setMode("string"));

async function startTuner() {
  if (running) return;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {echoCancellation:false, noiseSuppression:false, autoGainControl:false}
    });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = .1;
    buffer = new Float32Array(analyser.fftSize);
    microphone = audioContext.createMediaStreamSource(mediaStream);
    microphone.connect(analyser);
    running = true;
    startButton.textContent = "Listening…";
    startButton.disabled = true;
    addRecent();
    detectPitch();
  } catch (err) {
    console.error(err);
    statusDisplay.textContent = "Microphone unavailable";
    substatus.textContent = "Check your browser microphone permission.";
  }
}

startButton.addEventListener("click", startTuner);

function findClosestTarget(freq) {
  const tuning = currentTuningNotes();
  const candidates = state.mode === "string" ? [tuning[state.selectedString]] : tuning;
  let closest = candidates[0], smallest = Infinity;
  candidates.forEach(target => {
    const cents = Math.abs(1200 * Math.log2(freq / target.freq));
    if (cents < smallest) { smallest = cents; closest = target; }
  });
  return closest;
}

function displayReading(reading, stale=false) {
  const {frequency, target, cents} = reading;
  const clamped = Math.max(-50, Math.min(50, cents));
  const angle = clamped * 1.18;

  if (state.mode === "auto") {
    noteDisplay.textContent = target.note;
    frequencyDisplay.textContent = `${frequency.toFixed(2)} Hz`;
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    if (Math.abs(cents) <= 5) {
      statusDisplay.textContent = "✓ IN TUNE";
      statusDisplay.style.color = "var(--good)";
      substatus.textContent = stale ? "Holding last stable reading…" : `${Math.abs(cents).toFixed(1)}¢ from target`;
    } else if (cents < 0) {
      statusDisplay.textContent = "↑ TUNE UP";
      statusDisplay.style.color = "var(--accent)";
      substatus.textContent = stale ? "Holding last stable reading…" : `${Math.abs(cents).toFixed(1)}¢ flat`;
    } else {
      statusDisplay.textContent = "↓ TUNE DOWN";
      statusDisplay.style.color = "var(--accent)";
      substatus.textContent = stale ? "Holding last stable reading…" : `${Math.abs(cents).toFixed(1)}¢ sharp`;
    }
  } else {
    miniNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    if (Math.abs(cents) <= 5) {
      stringModeStatus.textContent = "✓ IN TUNE";
      stringModeStatus.style.color = "var(--good)";
    } else if (cents < 0) {
      stringModeStatus.textContent = "↑ TUNE UP";
      stringModeStatus.style.color = "var(--accent)";
    } else {
      stringModeStatus.textContent = "↓ TUNE DOWN";
      stringModeStatus.style.color = "var(--accent)";
    }
  }

  if (!stale && Math.abs(cents) <= 3) triggerSuccess(target.note);
}

function clearReading() {
  if (state.mode === "auto") {
    noteDisplay.textContent = "--";
    frequencyDisplay.textContent = "0.00 Hz";
    needle.style.transform = "translateX(-50%) rotate(0deg)";
    statusDisplay.textContent = "Play a string";
    statusDisplay.style.color = "var(--text)";
    substatus.textContent = `Reference: A4 = ${state.referenceHz.toFixed(1)} Hz`;
  } else {
    miniNeedle.style.transform = "translateX(-50%) rotate(0deg)";
    stringModeStatus.textContent = "Play the selected string";
    stringModeStatus.style.color = "var(--text)";
  }
}

function triggerSuccess(note) {
  if (!state.feedback) return;
  const key = `${state.mode}:${note}:${state.selectedString}`;
  const now = performance.now();
  if (key === lastSuccessKey && now - lastSuccessAt < 2500) return;
  lastSuccessKey = key;
  lastSuccessAt = now;

  if (navigator.vibrate) navigator.vibrate([45, 35, 75]);

  try {
    const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + .12);
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.16, ctx.currentTime + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .22);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + .24);
  } catch {}
}

function maybeWarnLowInput(rms) {
  const now = performance.now();
  if (rms < .0045) {
    if (!lowInputSince) lowInputSince = now;
    if (!warningShownThisSession && !warningSuppressedThisSession && now - lowInputSince > LOW_INPUT_WARNING_MS) {
      warningShownThisSession = true;
      if (!inputWarningDialog.open) inputWarningDialog.showModal();
    }
  } else {
    lowInputSince = 0;
  }
}

function detectPitch() {
  if (!running) return;
  analyser.getFloatTimeDomainData(buffer);

  let rms = 0;
  for (let i=0;i<buffer.length;i++) rms += buffer[i]*buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  maybeWarnLowInput(rms);

  const frequency = autoCorrelate(buffer, audioContext.sampleRate);

  if (frequency !== -1 && frequency > 35 && frequency < 1700) {
    const target = findClosestTarget(frequency);
    const cents = 1200 * Math.log2(frequency / target.freq);

    if (Math.abs(cents) < 700) {
      lastReading = {frequency, target, cents};
      lastValidReadingAt = performance.now();
      displayReading(lastReading, false);
    }
  } else {
    const age = performance.now() - lastValidReadingAt;
    if (lastReading && age < HOLD_MS) displayReading(lastReading, true);
    else clearReading();
  }

  requestAnimationFrame(detectPitch);
}

function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let rms = 0;
  for (let i=0;i<SIZE;i++) rms += buf[i]*buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < .0045) return -1;

  const minFreq = 35, maxFreq = 1700;
  const minOffset = Math.floor(sampleRate / maxFreq);
  const maxOffset = Math.min(Math.floor(sampleRate / minFreq), SIZE - 2);
  const correlations = new Float32Array(maxOffset + 2);

  let bestOffset = -1, bestCorrelation = 0, foundGood = false, lastCorrelation = 1;

  for (let offset=minOffset; offset<=maxOffset; offset++) {
    let correlation=0, normA=0, normB=0;
    for (let i=0;i<SIZE-offset;i++) {
      const a=buf[i], b=buf[i+offset];
      correlation += a*b; normA += a*a; normB += b*b;
    }
    correlation /= Math.sqrt(normA*normB) || 1;
    correlations[offset] = correlation;

    if (correlation > .82 && correlation > lastCorrelation) foundGood = true;
    else if (foundGood && correlation < lastCorrelation) {
      bestOffset = offset - 1;
      bestCorrelation = correlations[bestOffset];
      break;
    }

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
    lastCorrelation = correlation;
  }

  if (bestOffset <= 0 || bestCorrelation < .55) return -1;

  let refined = bestOffset;
  const c1 = correlations[bestOffset-1], c2=correlations[bestOffset], c3=correlations[bestOffset+1];
  const denom = c1 - 2*c2 + c3;
  if (Math.abs(denom) > 1e-9) refined = bestOffset + .5*(c1-c3)/denom;
  return sampleRate / refined;
}

$("playReferenceBtn").addEventListener("click", () => {
  const t = currentTuningNotes()[state.selectedString];
  if (!t) return;
  const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = t.freq;
  gain.gain.setValueAtTime(.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.18, ctx.currentTime+.02);
  gain.gain.setValueAtTime(.18, ctx.currentTime+.65);
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+.95);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime+1);
});

$("settingsBtn").addEventListener("click", () => {
  $("referenceHz").value = state.referenceHz;
  $("autostartToggle").checked = state.autostart;
  $("feedbackToggle").checked = state.feedback;
  applyTheme(state.theme);
  settingsDialog.showModal();
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => $(btn.dataset.close).close());
});

document.querySelectorAll(".preset-hz").forEach(btn => {
  btn.addEventListener("click", () => $("referenceHz").value = btn.dataset.hz);
});

document.querySelectorAll(".theme-choice").forEach(btn => {
  btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice));
});

$("saveSettings").addEventListener("click", () => {
  const hz = Number($("referenceHz").value);
  if (!Number.isFinite(hz) || hz < 400 || hz > 480) {
    alert("Choose an A4 reference between 400 and 480 Hz.");
    return;
  }
  state.referenceHz = hz;
  state.autostart = $("autostartToggle").checked;
  state.feedback = $("feedbackToggle").checked;
  saveState();
  updateTuningUI();
  settingsDialog.close();
});

$("manageCustomBtn").addEventListener("click", () => {
  settingsDialog.close();
  renderCustomManager();
  manageDialog.showModal();
});
$("newCustomBtn").addEventListener("click", () => openCustomEditor(null, state.instrument));

function renderCustomManager() {
  const list = $("customPresetList");
  list.innerHTML = "";
  let count = 0;
  Object.entries(state.custom).forEach(([instKey, presets]) => {
    Object.entries(presets).forEach(([name, data]) => {
      count++;
      const row = document.createElement("div");
      row.className = "preset-item";
      const text = document.createElement("div");
      text.innerHTML = `<strong>${escapeHtml(name)}</strong><small>${instruments[instKey].name} · ${data.map(x=>x.note).join(" ")}</small>`;
      const actions = document.createElement("div");
      actions.className = "preset-actions";
      const edit = document.createElement("button");
      edit.className = "icon-button"; edit.textContent = "✎";
      edit.addEventListener("click", () => openCustomEditor(name, instKey));
      const del = document.createElement("button");
      del.className = "icon-button"; del.textContent = "🗑";
      del.addEventListener("click", () => deleteCustom(instKey, name));
      actions.append(edit, del);
      row.append(text, actions);
      list.appendChild(row);
    });
  });
  if (!count) list.innerHTML = `<p class="helper">You haven’t created any custom tunings yet.</p>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function openCustomEditor(name=null, instKey=state.instrument) {
  editingCustom = name ? {name, instKey} : null;
  $("customDialogTitle").textContent = name ? "Edit Custom Tuning" : "Create Custom Tuning";
  $("customInstrument").value = instKey;
  $("customInstrument").disabled = !!name;
  $("customName").value = name || "";
  $("deleteCustomBtn").classList.toggle("hidden", !name);
  buildCustomRows(instKey, name);
  if (manageDialog.open) manageDialog.close();
  customDialog.showModal();
}

function buildCustomRows(instKey, name=null) {
  const inst = instruments[instKey];
  let seed;
  if (name) seed = state.custom[instKey][name];
  else seed = Object.values(inst.presets)[0].map(note => ({note, freq:noteFrequency(note)}));

  const rows = $("customRows");
  rows.innerHTML = "";

  for (let i=0;i<inst.strings;i++) {
    const row = document.createElement("div");
    row.className = "custom-row";

    const idx = document.createElement("div");
    idx.className = "custom-index";
    idx.textContent = `String ${i+1}`;

    const noteWrap = document.createElement("div");
    const noteLabel = document.createElement("label");
    noteLabel.textContent = "Note";
    const select = document.createElement("select");
    select.className = "custom-note";
    allSelectableNotes().forEach(note => {
      const o = document.createElement("option"); o.value=note; o.textContent=note; select.appendChild(o);
    });
    select.value = seed[i]?.note || "A4";
    noteWrap.append(noteLabel, select);

    const freqWrap = document.createElement("div");
    freqWrap.className = "freq-wrap";
    const freqLabel = document.createElement("label");
    freqLabel.textContent = "Hz";
    const freq = document.createElement("input");
    freq.type="number"; freq.step=".01"; freq.className="custom-freq";
    freq.value = Number(seed[i]?.freq || noteFrequency(select.value)).toFixed(2);
    select.addEventListener("change", () => freq.value = noteFrequency(select.value).toFixed(2));
    freqWrap.append(freqLabel, freq);

    row.append(idx, noteWrap, freqWrap);
    rows.appendChild(row);
  }
}

$("customInstrument").addEventListener("change", e => {
  if (!editingCustom) buildCustomRows(e.target.value, null);
});

$("cancelCustom").addEventListener("click", () => customDialog.close());

$("saveCustom").addEventListener("click", () => {
  const instKey = $("customInstrument").value;
  const newName = $("customName").value.trim();
  if (!newName) { alert("Give your custom tuning a name."); return; }

  const notes = [...document.querySelectorAll(".custom-note")];
  const freqs = [...document.querySelectorAll(".custom-freq")];
  const data = notes.map((n,i) => ({note:n.value, freq:Number(freqs[i].value)}));
  if (data.some(x => !Number.isFinite(x.freq) || x.freq<=0)) { alert("Every string needs a valid frequency."); return; }

  if (!state.custom[instKey]) state.custom[instKey] = {};

  if (editingCustom && (editingCustom.name !== newName || editingCustom.instKey !== instKey)) {
    delete state.custom[editingCustom.instKey][editingCustom.name];
  }
  state.custom[instKey][newName] = data;

  state.instrument = instKey;
  state.tuning = `custom:${newName}`;
  instrumentSelect.value = instKey;
  saveState();
  populateTunings(state.tuning);
  customDialog.close();
});

$("deleteCustomBtn").addEventListener("click", () => {
  if (editingCustom) deleteCustom(editingCustom.instKey, editingCustom.name, true);
});

function deleteCustom(instKey, name, fromEditor=false) {
  if (!confirm(`Delete "${name}"?`)) return;
  if (state.custom[instKey]) {
    delete state.custom[instKey][name];
    if (!Object.keys(state.custom[instKey]).length) delete state.custom[instKey];
  }
  state.recent = state.recent.filter(x => !(x.instrument===instKey && x.tuning===`custom:${name}`));
  if (state.instrument===instKey && state.tuning===`custom:${name}`) state.tuning = `preset:${Object.keys(instruments[instKey].presets)[0]}`;
  saveState();
  if (fromEditor) customDialog.close();
  renderCustomManager();
  populateTunings(state.tuning);
}

$("warningOkBtn").addEventListener("click", () => {
  if ($("dontShowSession").checked) warningSuppressedThisSession = true;
  inputWarningDialog.close();
});

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  $("installBtn").classList.remove("hidden");
});

async function promptInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("installBtn").classList.add("hidden");
  } else {
    alert("If your browser does not show an install prompt, use its menu and choose “Add to Home Screen” or “Install app.” On iPhone/iPad, use Safari → Share → Add to Home Screen.");
  }
}
$("installBtn").addEventListener("click", promptInstall);
$("installFromSettings").addEventListener("click", promptInstall);

window.addEventListener("appinstalled", () => $("installBtn").classList.add("hidden"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(console.error));
}
window.addEventListener("online", () => $("offlineBadge").textContent = "Offline Ready");
window.addEventListener("offline", () => $("offlineBadge").textContent = "Offline Mode");

applyTheme(state.theme);
buildInstrumentOptions();
populateTunings(state.tuning);
renderRecent();
setMode(state.mode);
$("referenceHz").value = state.referenceHz;
$("autostartToggle").checked = state.autostart;
$("feedbackToggle").checked = state.feedback;

if (state.autostart) {
  // Browsers require a user gesture before microphone access, so we restore the last setup
  // and put the start button in the most prominent state rather than trying to bypass permission rules.
  startButton.textContent = "Resume Last Setup";
}
