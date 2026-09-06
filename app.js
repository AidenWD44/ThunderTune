
const NOTE_NAMES = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
const instruments = {
  guitar6: {name:"6-String Guitar",icon:"🎸",strings:6,defaults:["E2","A2","D3","G3","B3","E4"],presets:{"Standard":["E2","A2","D3","G3","B3","E4"],"Drop D":["D2","A2","D3","G3","B3","E4"],"Half-Step Down":["Eb2","Ab2","Db3","Gb3","Bb3","Eb4"],"D Standard":["D2","G2","C3","F3","A3","D4"],"Drop C":["C2","G2","C3","F3","A3","D4"]}},
  guitar12: {name:"12-String Guitar",icon:"🎸",strings:12,defaults:["E2","E3","A2","A3","D3","D4","G3","G4","B3","B3","E4","E4"],presets:{"Standard":["E2","E3","A2","A3","D3","D4","G3","G4","B3","B3","E4","E4"]}},
  bass4: {name:"4-String Bass",icon:"🎸",strings:4,defaults:["E1","A1","D2","G2"],presets:{"Standard":["E1","A1","D2","G2"],"Drop D":["D1","A1","D2","G2"]}},
  ukulele: {name:"Ukulele",icon:"🪕",strings:4,defaults:["G4","C4","E4","A4"],presets:{"Standard (High G)":["G4","C4","E4","A4"],"Low G":["G3","C4","E4","A4"]}},
  violin: {name:"Violin",icon:"🎻",strings:4,defaults:["G3","D4","A4","E5"],presets:{"Standard":["G3","D4","A4","E5"]}},
  mandolin: {name:"Mandolin",icon:"🎻",strings:8,defaults:["G3","G3","D4","D4","A4","A4","E5","E5"],presets:{"Standard":["G3","G3","D4","D4","A4","A4","E5","E5"]}},
  banjo5: {name:"5-String Banjo",icon:"🪕",strings:5,defaults:["G4","D3","G3","B3","D4"],presets:{"Open G":["G4","D3","G3","B3","D4"],"Double C":["G4","C3","G3","C4","D4"]}}
};
const headstockConfigs = {
  guitar6: {
    image: 'assets/headstocks/guitar6.png',
    width: 330, height: 683, bubble: 38,
    hotspots: [
      { peg: { x: 48, y: 390 }, label: { x: 100, y: 390 } },
      { peg: { x: 48, y: 302 }, label: { x: 100, y: 302 } },
      { peg: { x: 48, y: 214 }, label: { x: 100, y: 214 } },
      { peg: { x: 282, y: 214 }, label: { x: 230, y: 214 } },
      { peg: { x: 282, y: 302 }, label: { x: 230, y: 302 } },
      { peg: { x: 282, y: 390 }, label: { x: 230, y: 390 } }
    ]
  },
  guitar12: {
    image: 'assets/headstocks/guitar12.png',
    width: 500, height: 667, bubble: 30,
    hotspots: [
      { peg: { x: 76, y: 464 }, label: { x: 128, y: 464 } },
      { peg: { x: 76, y: 406 }, label: { x: 128, y: 406 } },
      { peg: { x: 76, y: 350 }, label: { x: 128, y: 350 } },
      { peg: { x: 76, y: 294 }, label: { x: 128, y: 294 } },
      { peg: { x: 76, y: 238 }, label: { x: 128, y: 238 } },
      { peg: { x: 76, y: 182 }, label: { x: 128, y: 182 } },
      { peg: { x: 424, y: 182 }, label: { x: 372, y: 182 } },
      { peg: { x: 424, y: 238 }, label: { x: 372, y: 238 } },
      { peg: { x: 424, y: 294 }, label: { x: 372, y: 294 } },
      { peg: { x: 424, y: 350 }, label: { x: 372, y: 350 } },
      { peg: { x: 424, y: 406 }, label: { x: 372, y: 406 } },
      { peg: { x: 424, y: 464 }, label: { x: 372, y: 464 } }
    ]
  },
  bass4: {
    image: 'assets/headstocks/bass4.png',
    width: 960, height: 650, bubble: 40, imageClass: 'bass-horizontal',
    hotspots: [
      { peg: { x: 126, y: 143 }, label: { x: 126, y: 255 } },
      { peg: { x: 330, y: 147 }, label: { x: 330, y: 255 } },
      { peg: { x: 537, y: 156 }, label: { x: 537, y: 255 } },
      { peg: { x: 746, y: 162 }, label: { x: 746, y: 255 } }
    ]
  },
  ukulele: {
    image: 'assets/headstocks/ukulele.png',
    width: 500, height: 647, bubble: 40,
    hotspots: [
      { peg: { x: 164, y: 246 }, label: { x: 124, y: 180 } },
      { peg: { x: 108, y: 548 }, label: { x: 94, y: 470 } },
      { peg: { x: 342, y: 246 }, label: { x: 380, y: 180 } },
      { peg: { x: 392, y: 557 }, label: { x: 404, y: 480 } }
    ]
  },
  violin: {
    image: 'assets/headstocks/violin.png',
    width: 960, height: 640, bubble: 40,
    hotspots: [
      { peg: { x: 735, y: 170 }, label: { x: 600, y: 160 } },
      { peg: { x: 796, y: 200 }, label: { x: 650, y: 240 } },
      { peg: { x: 714, y: 315 }, label: { x: 590, y: 335 } },
      { peg: { x: 776, y: 355 }, label: { x: 640, y: 410 } }
    ]
  },
  mandolin: {
    image: 'assets/headstocks/mandolin.png',
    width: 330, height: 663, bubble: 30,
    hotspots: [
      { peg: { x: 22, y: 447 }, label: { x: 82, y: 447 } },
      { peg: { x: 22, y: 367 }, label: { x: 82, y: 367 } },
      { peg: { x: 22, y: 288 }, label: { x: 82, y: 288 } },
      { peg: { x: 22, y: 210 }, label: { x: 82, y: 210 } },
      { peg: { x: 308, y: 210 }, label: { x: 248, y: 210 } },
      { peg: { x: 308, y: 288 }, label: { x: 248, y: 288 } },
      { peg: { x: 308, y: 367 }, label: { x: 248, y: 367 } },
      { peg: { x: 308, y: 447 }, label: { x: 248, y: 447 } }
    ]
  },
  banjo5: {
    image: 'assets/headstocks/banjo5.png',
    width: 330, height: 663, bubble: 36,
    hotspots: [
      { peg: { x: 92, y: 188 }, label: { x: 126, y: 144 } },
      { peg: { x: 239, y: 188 }, label: { x: 203, y: 144 } },
      { peg: { x: 92, y: 292 }, label: { x: 126, y: 332 } },
      { peg: { x: 239, y: 292 }, label: { x: 203, y: 332 } },
      { peg: { x: 65, y: 541 }, label: { x: 128, y: 522 } }
    ]
  }
};
const $ = id => document.getElementById(id);
let state = {referenceHz:Number(localStorage.getItem('tt_referenceHz'))||440,theme:localStorage.getItem('tt_theme')||'thunder',autostart:localStorage.getItem('tt_autostart')==='true',feedback:localStorage.getItem('tt_feedback')!=='false',instrument:localStorage.getItem('tt_lastInstrument')||'guitar6',tuning:localStorage.getItem('tt_lastTuning')||'preset:Standard',mode:localStorage.getItem('tt_lastMode')||'auto',recent:JSON.parse(localStorage.getItem('tt_recent')||'[]'),custom:JSON.parse(localStorage.getItem('tt_custom')||'{}'),selectedString:Number(localStorage.getItem('tt_selectedString'))||0};
let audioContext, analyser, microphone, buffer, mediaStream;
let running=false,lastValidReadingAt=0,lastReading=null,lowInputSince=0,warningShownThisSession=false,warningSuppressedThisSession=false,deferredInstallPrompt=null,lastSuccessKey='',lastSuccessAt=0,editingCustom=null,autoDetectedIndex=null;
const HOLD_MS=3500, LOW_INPUT_WARNING_MS=4200, RMS_THRESHOLD=0.0023;
function saveState(){localStorage.setItem('tt_referenceHz',state.referenceHz);localStorage.setItem('tt_theme',state.theme);localStorage.setItem('tt_autostart',state.autostart);localStorage.setItem('tt_feedback',state.feedback);localStorage.setItem('tt_lastInstrument',state.instrument);localStorage.setItem('tt_lastTuning',state.tuning);localStorage.setItem('tt_lastMode',state.mode);localStorage.setItem('tt_recent',JSON.stringify(state.recent));localStorage.setItem('tt_custom',JSON.stringify(state.custom));localStorage.setItem('tt_selectedString',String(state.selectedString));}
function applyTheme(theme){state.theme=theme;document.body.dataset.theme=theme;document.querySelectorAll('.theme-choice').forEach(btn=>btn.classList.toggle('selected',btn.dataset.themeChoice===theme));saveState();}
function noteToMidi(note){const m=note.match(/^([A-G])([#b]?)(-?\d+)$/);if(!m)return null;const [,letter,accidental,octaveText]=m;const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter];let semitone=base+(accidental==='#'?1:accidental==='b'?-1:0);semitone=(semitone+12)%12;return (Number(octaveText)+1)*12+semitone;}
function noteFrequency(note){const midi=noteToMidi(note);return state.referenceHz*Math.pow(2,(midi-69)/12);}
function allSelectableNotes(){const out=[];for(let o=0;o<=6;o++)NOTE_NAMES.forEach(n=>out.push(`${n}${o}`));return out;}
function customForInstrument(key){return state.custom[key]||{};}
function tuningName(value=state.tuning){return value.includes(':')?value.split(':').slice(1).join(':'):value;}
function showView(view){$('homeView').classList.toggle('hidden',view!=='home');$('tunerView').classList.toggle('hidden',view!=='tuner');}
function buildHome(){const grid=$('instrumentGrid');grid.innerHTML='';Object.entries(instruments).forEach(([key,inst])=>{const b=document.createElement('button');b.className='instrument-card';b.innerHTML=`<div class="emoji">${inst.icon}</div><strong>${inst.name}</strong><span>${inst.strings} strings</span>`;b.addEventListener('click',()=>openInstrument(key));grid.appendChild(b);});renderHomeRecent();}
function renderHomeRecent(){const holder=$('homeRecent');holder.innerHTML='';$('homeRecentSection').classList.toggle('hidden',state.recent.length===0);state.recent.forEach(item=>{const chip=document.createElement('button');chip.className='recent-chip';chip.textContent=item.label;chip.addEventListener('click',()=>{state.instrument=item.instrument;state.tuning=item.tuning;openInstrument(item.instrument,true);});holder.appendChild(chip);});}
function buildCustomInstrumentSelect(){const select=$('customInstrument');select.innerHTML='';Object.entries(instruments).forEach(([key,inst])=>{const o=document.createElement('option');o.value=key;o.textContent=inst.name;select.appendChild(o);});}
function populateTunings(preferred=state.tuning){const inst=instruments[state.instrument], select=$('tuningSelect');select.innerHTML='';Object.keys(inst.presets).forEach(name=>{const o=document.createElement('option');o.value=`preset:${name}`;o.textContent=name;select.appendChild(o);});Object.keys(customForInstrument(state.instrument)).forEach(name=>{const o=document.createElement('option');o.value=`custom:${name}`;o.textContent=`★ ${name}`;select.appendChild(o);});const add=document.createElement('option');add.value='__add_custom__';add.textContent='+ Add Custom Tuning…';select.appendChild(add);const valid=[...select.options].some(o=>o.value===preferred);select.value=valid?preferred:select.options[0].value;state.tuning=select.value;updateTunerUI();}
function currentTuningNotes(){const inst=instruments[state.instrument];if(state.tuning.startsWith('preset:')){const name=state.tuning.slice(7);return inst.presets[name].map(note=>({note,freq:noteFrequency(note)}));}if(state.tuning.startsWith('custom:')){const name=state.tuning.slice(7);return (customForInstrument(state.instrument)[name]||[]).map(x=>({note:x.note,freq:Number(x.freq)}));}return inst.defaults.map(note=>({note,freq:noteFrequency(note)}));}
function addRecent(){const entry={instrument:state.instrument,tuning:state.tuning,label:`${instruments[state.instrument].name} · ${tuningName()}`};state.recent=[entry,...state.recent.filter(x=>!(x.instrument===entry.instrument&&x.tuning===entry.tuning))].slice(0,5);saveState();renderRecent();renderHomeRecent();}
function renderRecent(){const holder=$('recentTunings');holder.innerHTML='';$('recentSection').classList.toggle('hidden',state.recent.length===0);state.recent.forEach(item=>{const chip=document.createElement('button');chip.className='recent-chip';chip.textContent=item.label;chip.addEventListener('click',()=>{state.instrument=item.instrument;state.tuning=item.tuning;openInstrument(item.instrument,true);});holder.appendChild(chip);});}
function isTuningValidForInstrument(tuning,instrumentKey){const inst=instruments[instrumentKey];if(tuning.startsWith('preset:'))return Object.prototype.hasOwnProperty.call(inst.presets,tuning.slice(7));if(tuning.startsWith('custom:'))return Object.prototype.hasOwnProperty.call(customForInstrument(instrumentKey),tuning.slice(7));return false;}
function openInstrument(key,preserveTuning=false){state.instrument=key;state.selectedString=0;if(!preserveTuning||!isTuningValidForInstrument(state.tuning,key)){const first=Object.keys(instruments[key].presets)[0];state.tuning=`preset:${first}`;}populateTunings(state.tuning);setMode(state.mode||'auto');showView('tuner');saveState();}
function setMode(mode){state.mode=mode;$('autoModeBtn').classList.toggle('active',mode==='auto');$('stringModeBtn').classList.toggle('active',mode==='string');$('stringModeHint').textContent=mode==='string'?'Tap a tuning peg or string chip to choose the string you want.':'Auto Detect listens for the closest note in the current tuning.';renderStringChips();renderHeadstock();saveState();}
function selectStringIndex(i,switchMode=true){
  const notes=currentTuningNotes();
  if(!notes[i]) return;
  state.selectedString=i;
  $('selectedStringNote').textContent=notes[i].note;
  $('selectedStringFreq').textContent=`${notes[i].freq.toFixed(2)} Hz target`;
  if(switchMode) setMode('string');
  else { renderStringChips(); renderHeadstock(); saveState(); }
}
function updateTunerUI(){
  const notes=currentTuningNotes();
  state.selectedString=Math.min(state.selectedString,notes.length-1);
  $('instrumentTitle').textContent=instruments[state.instrument].name;
  $('referenceTitle').textContent=`A4 = ${state.referenceHz.toFixed(1)} Hz`;
  $('selectedStringNote').textContent=notes[state.selectedString]?.note||'--';
  $('selectedStringFreq').textContent=`${(notes[state.selectedString]?.freq||0).toFixed(2)} Hz target`;
  renderRecent();
  renderStringChips();
  renderHeadstock();
  clearReading();
  saveState();
}
function renderStringChips(){
  const holder=$('stringChips');
  holder.innerHTML='';
  currentTuningNotes().forEach((item,i)=>{
    const activeIndex=state.mode==='string'?state.selectedString:autoDetectedIndex;
    const chip=document.createElement('button');
    chip.className='string-chip'+(i===activeIndex?' active':'');
    chip.textContent=`${i+1}: ${item.note}`;
    chip.addEventListener('click',()=>selectStringIndex(i,true));
    holder.appendChild(chip);
  });
}
function renderHeadstock(){
  const config=headstockConfigs[state.instrument];
  const board=$('headstockBoard');
  const img=$('headstockImage');
  const overlay=$('headstockOverlay');
  const buttons=$('headstockButtons');
  const notes=currentTuningNotes();
  const activeIndex=state.mode==='string'?state.selectedString:autoDetectedIndex;

  board.style.aspectRatio=`${config.width} / ${config.height}`;
  img.src=config.image;
  img.className='headstock-image'+(config.imageClass?` ${config.imageClass}`:'');
  img.alt=`${instruments[state.instrument].name} headstock`;
  overlay.setAttribute('viewBox',`0 0 ${config.width} ${config.height}`);
  overlay.innerHTML='';
  buttons.innerHTML='';
  const ns='http://www.w3.org/2000/svg';

  notes.forEach((item,i)=>{
    const hotspot=config.hotspots[i];
    if(!hotspot) return;
    const line=document.createElementNS(ns,'line');
    line.setAttribute('x1',hotspot.peg.x);
    line.setAttribute('y1',hotspot.peg.y);
    line.setAttribute('x2',hotspot.label.x);
    line.setAttribute('y2',hotspot.label.y);
    line.setAttribute('class','headstock-link'+(i===activeIndex?' active':''));
    overlay.appendChild(line);

    const dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',hotspot.peg.x);
    dot.setAttribute('cy',hotspot.peg.y);
    dot.setAttribute('r',Math.max(6, Math.round((config.bubble||38)*0.18)));
    dot.setAttribute('class','peg-dot'+(i===activeIndex?' active':''));
    overlay.appendChild(dot);

    const bubble=document.createElement('button');
    const bubbleSize=config.bubble||38;
    bubble.className='note-bubble';
    if(bubbleSize<=32) bubble.classList.add('compact');
    if(bubbleSize<=28) bubble.classList.add('tiny');
    bubble.style.width=`${bubbleSize}px`;
    bubble.style.height=`${bubbleSize}px`;
    bubble.style.left=`${(hotspot.label.x/config.width)*100}%`;
    bubble.style.top=`${(hotspot.label.y/config.height)*100}%`;
    bubble.textContent=item.note.replace(/[0-9]/g,'');
    if(i===activeIndex) bubble.classList.add('active');
    bubble.setAttribute('aria-label',`String ${i+1}, ${item.note}`);
    bubble.addEventListener('click',()=>selectStringIndex(i,true));
    buttons.appendChild(bubble);
  });
}
function findClosestTarget(freq){
  const tuning=currentTuningNotes();
  const candidates=state.mode==='string'?[{...tuning[state.selectedString],index:state.selectedString}]:tuning.map((t,index)=>({...t,index}));
  let closest=candidates[0], smallest=Infinity;
  candidates.forEach(target=>{const cents=Math.abs(1200*Math.log2(freq/target.freq));if(cents<smallest){smallest=cents;closest=target;}});
  return closest;
}
async function startTuner(){if(running)return;try{mediaStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});audioContext=new (window.AudioContext||window.webkitAudioContext)();analyser=audioContext.createAnalyser();analyser.fftSize=8192;analyser.smoothingTimeConstant=.16;buffer=new Float32Array(analyser.fftSize);microphone=audioContext.createMediaStreamSource(mediaStream);microphone.connect(analyser);running=true;$('startButton').textContent='Listening…';$('startButton').disabled=true;addRecent();detectPitch();}catch(err){console.error(err);$('status').textContent='Microphone unavailable';$('substatus').textContent='Check browser microphone permission.';}}
function triggerSuccess(note){if(!state.feedback)return;const key=`${state.mode}:${state.instrument}:${note}:${state.selectedString}`;const now=performance.now();if(key===lastSuccessKey&&now-lastSuccessAt<2200)return;lastSuccessKey=key;lastSuccessAt=now;if(navigator.vibrate)navigator.vibrate([35,30,65]);try{const ctx=audioContext||new (window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(900,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(1350,ctx.currentTime+.12);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.16,ctx.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.24);}catch{}}
function maybeWarnLowInput(rms){const now=performance.now();if(rms<RMS_THRESHOLD){if(!lowInputSince)lowInputSince=now;if(!warningShownThisSession&&!warningSuppressedThisSession&&now-lowInputSince>LOW_INPUT_WARNING_MS){warningShownThisSession=true;if(!$('inputWarningDialog').open)$('inputWarningDialog').showModal();}}else lowInputSince=0;}
function displayReading(reading,stale=false){const {frequency,target,cents}=reading;const clamped=Math.max(-50,Math.min(50,cents));const angle=clamped*1.18;$('note').textContent=target.note;$('frequency').textContent=`${frequency.toFixed(2)} Hz`;$('needle').style.transform=`translateX(-50%) rotate(${angle}deg)`;$('selectedStringNote').textContent=target.note;$('selectedStringFreq').textContent=`${target.freq.toFixed(2)} Hz target`;if(Math.abs(cents)<=5){$('status').textContent='✓ IN TUNE';$('status').style.color='var(--good)';$('substatus').textContent=stale?'Holding last stable reading…':`${Math.abs(cents).toFixed(1)}¢ from target`;}else if(cents<0){$('status').textContent='↑ TUNE UP';$('status').style.color='var(--accent)';$('substatus').textContent=stale?'Holding last stable reading…':`${Math.abs(cents).toFixed(1)}¢ flat`;}else{$('status').textContent='↓ TUNE DOWN';$('status').style.color='var(--accent)';$('substatus').textContent=stale?'Holding last stable reading…':`${Math.abs(cents).toFixed(1)}¢ sharp`;}if(!stale&&Math.abs(cents)<=3)triggerSuccess(target.note);}
function clearReading(){$('note').textContent='--';$('frequency').textContent='0.00 Hz';$('needle').style.transform='translateX(-50%) rotate(0deg)';$('status').textContent=running?'Play a string':'Press Start';$('status').style.color='var(--text)';$('substatus').textContent=running?'Play one clear note at a time.':'Choose a tuning and start the mic.';autoDetectedIndex=state.mode==='string'?state.selectedString:null;renderStringChips();renderHeadstock();}
function detectPitch(){if(!running)return;analyser.getFloatTimeDomainData(buffer);let rms=0;for(let i=0;i<buffer.length;i++)rms+=buffer[i]*buffer[i];rms=Math.sqrt(rms/buffer.length);maybeWarnLowInput(rms);const frequency=autoCorrelate(buffer,audioContext.sampleRate);if(frequency!==-1&&frequency>30&&frequency<1700){const target=findClosestTarget(frequency);const cents=1200*Math.log2(frequency/target.freq);if(Math.abs(cents)<700){lastReading={frequency,target,cents};lastValidReadingAt=performance.now();autoDetectedIndex=target.index;renderStringChips();renderHeadstock();displayReading(lastReading,false);}}else{const age=performance.now()-lastValidReadingAt;if(lastReading&&age<HOLD_MS)displayReading(lastReading,true);else clearReading();}requestAnimationFrame(detectPitch);}
function autoCorrelate(buf,sampleRate){const SIZE=buf.length;let rms=0;for(let i=0;i<SIZE;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/SIZE);if(rms<RMS_THRESHOLD)return -1;const minFreq=30,maxFreq=1700,minOffset=Math.floor(sampleRate/maxFreq),maxOffset=Math.min(Math.floor(sampleRate/minFreq),SIZE-2),correlations=new Float32Array(maxOffset+2);let bestOffset=-1,bestCorrelation=0,foundGood=false,lastCorrelation=1;for(let offset=minOffset;offset<=maxOffset;offset++){let correlation=0,normA=0,normB=0;for(let i=0;i<SIZE-offset;i++){const a=buf[i],b=buf[i+offset];correlation+=a*b;normA+=a*a;normB+=b*b;}correlation/=Math.sqrt(normA*normB)||1;correlations[offset]=correlation;if(correlation>.80&&correlation>lastCorrelation)foundGood=true;else if(foundGood&&correlation<lastCorrelation){bestOffset=offset-1;bestCorrelation=correlations[bestOffset];break;}if(correlation>bestCorrelation){bestCorrelation=correlation;bestOffset=offset;}lastCorrelation=correlation;}if(bestOffset<=0||bestCorrelation<.50)return -1;let refined=bestOffset;const c1=correlations[bestOffset-1],c2=correlations[bestOffset],c3=correlations[bestOffset+1],denom=c1-2*c2+c3;if(Math.abs(denom)>1e-9)refined=bestOffset+.5*(c1-c3)/denom;return sampleRate/refined;}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function renderCustomManager(){const list=$('customPresetList');list.innerHTML='';let count=0;Object.entries(state.custom).forEach(([instKey,presets])=>{Object.entries(presets).forEach(([name,data])=>{count++;const row=document.createElement('div');row.className='preset-item';const text=document.createElement('div');text.innerHTML=`<strong>${escapeHtml(name)}</strong><small>${instruments[instKey].name} · ${data.map(x=>x.note).join(' ')}</small>`;const actions=document.createElement('div');actions.className='preset-actions';const editBtn=document.createElement('button');editBtn.className='icon-button';editBtn.textContent='✎';editBtn.addEventListener('click',()=>openCustomEditor(name,instKey));const delBtn=document.createElement('button');delBtn.className='icon-button';delBtn.textContent='🗑';delBtn.addEventListener('click',()=>deleteCustom(instKey,name));actions.append(editBtn,delBtn);row.append(text,actions);list.appendChild(row);});});if(!count)list.innerHTML=`<p class="helper">You haven’t created any custom tunings yet.</p>`;}
function openCustomEditor(name=null,instKey=state.instrument){editingCustom=name?{name,instKey}:null;$('customDialogTitle').textContent=name?'Edit Custom Tuning':'Create Custom Tuning';$('customInstrument').value=instKey;$('customInstrument').disabled=!!name;$('customName').value=name||'';$('deleteCustomBtn').classList.toggle('hidden',!name);buildCustomRows(instKey,name);if($('manageDialog').open)$('manageDialog').close();$('customDialog').showModal();}
function buildCustomRows(instKey,name=null){const inst=instruments[instKey];let seed=name?state.custom[instKey][name]:Object.values(inst.presets)[0].map(note=>({note,freq:noteFrequency(note)}));const rows=$('customRows');rows.innerHTML='';for(let i=0;i<inst.strings;i++){const row=document.createElement('div');row.className='custom-row';const idx=document.createElement('div');idx.className='custom-index';idx.textContent=`String ${i+1}`;const noteWrap=document.createElement('div');const noteLabel=document.createElement('label');noteLabel.textContent='Note';const select=document.createElement('select');select.className='custom-note';allSelectableNotes().forEach(note=>{const o=document.createElement('option');o.value=note;o.textContent=note;select.appendChild(o);});select.value=seed[i]?.note||'A4';noteWrap.append(noteLabel,select);const freqWrap=document.createElement('div');freqWrap.className='freq-wrap';const freqLabel=document.createElement('label');freqLabel.textContent='Hz';const freq=document.createElement('input');freq.type='number';freq.step='.01';freq.className='custom-freq';freq.value=Number(seed[i]?.freq||noteFrequency(select.value)).toFixed(2);select.addEventListener('change',()=>freq.value=noteFrequency(select.value).toFixed(2));freqWrap.append(freqLabel,freq);row.append(idx,noteWrap,freqWrap);rows.appendChild(row);}}
function deleteCustom(instKey,name,fromEditor=false){if(!confirm(`Delete "${name}"?`))return;if(state.custom[instKey]){delete state.custom[instKey][name];if(!Object.keys(state.custom[instKey]).length)delete state.custom[instKey];}state.recent=state.recent.filter(x=>!(x.instrument===instKey&&x.tuning===`custom:${name}`));if(state.instrument===instKey&&state.tuning===`custom:${name}`){const first=Object.keys(instruments[instKey].presets)[0];state.tuning=`preset:${first}`;}saveState();if(fromEditor)$('customDialog').close();renderCustomManager();if(state.instrument===instKey)populateTunings(state.tuning);renderHomeRecent();}
async function promptInstall(){if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('installBtn').classList.add('hidden');}else{alert('If your browser does not show an install prompt, use its menu and choose “Add to Home Screen” or “Install app.” On iPhone/iPad, use Safari → Share → Add to Home Screen.');}}
function openSettings(){$('referenceHz').value=state.referenceHz;$('autostartToggle').checked=state.autostart;$('feedbackToggle').checked=state.feedback;applyTheme(state.theme);$('settingsDialog').showModal();}
function bindEvents(){$('homeSettingsBtn').addEventListener('click',openSettings);$('tunerSettingsBtn').addEventListener('click',openSettings);$('backBtn').addEventListener('click',()=>showView('home'));$('startButton').addEventListener('click',startTuner);$('tuningSelect').addEventListener('change',()=>{if($('tuningSelect').value==='__add_custom__'){openCustomEditor(null,state.instrument);populateTunings(state.tuning);return;}state.tuning=$('tuningSelect').value;state.selectedString=0;addRecent();updateTunerUI();});$('autoModeBtn').addEventListener('click',()=>setMode('auto'));$('stringModeBtn').addEventListener('click',()=>setMode('string'));$('playReferenceBtn').addEventListener('click',()=>{const target=currentTuningNotes()[state.selectedString];if(!target)return;const ctx=audioContext||new (window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(), gain=ctx.createGain();osc.type='sine';osc.frequency.value=target.freq;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+.02);gain.gain.setValueAtTime(.18,ctx.currentTime+.65);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.95);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+1);});document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.close).close()));document.querySelectorAll('.preset-hz').forEach(btn=>btn.addEventListener('click',()=>$('referenceHz').value=btn.dataset.hz));document.querySelectorAll('.theme-choice').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.themeChoice)));$('saveSettings').addEventListener('click',()=>{const hz=Number($('referenceHz').value);if(!Number.isFinite(hz)||hz<400||hz>480){alert('Choose an A4 reference between 400 and 480 Hz.');return;}state.referenceHz=hz;state.autostart=$('autostartToggle').checked;state.feedback=$('feedbackToggle').checked;saveState();updateTunerUI();$('settingsDialog').close();});$('installBtn').addEventListener('click',promptInstall);$('installFromSettings').addEventListener('click',promptInstall);$('manageCustomBtn').addEventListener('click',()=>{$('settingsDialog').close();renderCustomManager();$('manageDialog').showModal();});$('newCustomBtn').addEventListener('click',()=>openCustomEditor(null,state.instrument));$('cancelCustom').addEventListener('click',()=>$('customDialog').close());$('customInstrument').addEventListener('change',e=>{if(!editingCustom)buildCustomRows(e.target.value,null);});$('saveCustom').addEventListener('click',()=>{const instKey=$('customInstrument').value,newName=$('customName').value.trim();if(!newName){alert('Give your custom tuning a name.');return;}const notes=[...document.querySelectorAll('.custom-note')], freqs=[...document.querySelectorAll('.custom-freq')];const data=notes.map((n,i)=>({note:n.value,freq:Number(freqs[i].value)}));if(data.some(x=>!Number.isFinite(x.freq)||x.freq<=0)){alert('Every string needs a valid frequency.');return;}if(!state.custom[instKey])state.custom[instKey]={};if(editingCustom&&(editingCustom.name!==newName||editingCustom.instKey!==instKey)){delete state.custom[editingCustom.instKey][editingCustom.name];}state.custom[instKey][newName]=data;state.instrument=instKey;state.tuning=`custom:${newName}`;saveState();populateTunings(state.tuning);renderHomeRecent();$('customDialog').close();});$('deleteCustomBtn').addEventListener('click',()=>{if(editingCustom)deleteCustom(editingCustom.instKey,editingCustom.name,true);});$('warningOkBtn').addEventListener('click',()=>{if($('dontShowSession').checked)warningSuppressedThisSession=true;$('inputWarningDialog').close();});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;$('installBtn').classList.remove('hidden');});window.addEventListener('appinstalled',()=>$('installBtn').classList.add('hidden'));if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(console.error));}}
function init(){applyTheme(state.theme);buildHome();buildCustomInstrumentSelect();bindEvents();setTimeout(()=>{$('splashView').classList.add('hidden');if(state.autostart&&instruments[state.instrument]){openInstrument(state.instrument,true);showView('tuner');}else showView('home');},1850);}
init();
