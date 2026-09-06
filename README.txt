ThunderTune v1.2

Upload the CONTENTS of this folder to the root of your GitHub Pages repository:

index.html
styles.css
app.js
manifest.json
service-worker.js
icons/

Important:
- GitHub Pages provides HTTPS, which is required for microphone access and PWA installation.
- After updating service-worker.js in future versions, change the CACHE name so devices refresh cached files.
- iPhone/iPad installation: Safari > Share > Add to Home Screen.
- Android/Chrome: use the in-app install button when Chrome exposes the install prompt.

Features in this build:
- PWA install support
- Offline caching
- Recent tunings
- Restores last instrument/tuning/mode
- Light/Dark/Thunder themes
- Custom tuning create/edit/rename/delete
- Auto Detect mode
- Interactive Tune by String headstock
- Low-input microphone warning with session suppression
- Haptic feedback + success ding
- Mobile-first responsive layout + compact landscape view
