# Friday League: eFootball tournament app

The app is hosted free on GitHub Pages, packaged as an Android app with PWABuilder, and keeps its data in Firebase.

## Files
| File | Purpose |
|---|---|
| `index.html` | the whole app |
| `manifest.webmanifest` | app name, icons and colours, used for installing and by PWABuilder |
| `sw.js` | service worker, which makes the app installable and lets it open offline |
| `icons/` | app icons, including a maskable icon for Android |
| `screenshots/` | store screenshots that PWABuilder picks up |
| `.nojekyll` | tells GitHub Pages to serve the files exactly as they are |

## 1. Firebase (data)
The app is already linked to
`https://fridaytournament-aa12f-default-rtdb.europe-west1.firebasedatabase.app`

In the Firebase console, open **Realtime Database → Rules**, set the rules below, and click **Publish**:
```json
{ "rules": { ".read": true, ".write": true } }
```

## 2. GitHub Pages (hosting)
1. Go to https://github.com/new and name the repository `friday-tournament`. Set it to **Public** (Pages is free only for public repos) and click **Create repository**.
2. On the new repo page, click **uploading an existing file**.
3. Open **E:\Friday Tournament** in Explorer, select **everything inside it** (`index.html`, `manifest.webmanifest`, `sw.js`, `.nojekyll`, the `icons` folder and the `screenshots` folder) and drag it all onto the page. Then click **Commit changes**.
   - Windows hides `.nojekyll` by default. Turn on *View → Show → Hidden items* so you can select it. If you skip it, the app still works.
4. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then click **Save**.
5. Wait 1–2 minutes. Your app is now live at
   `https://<your-github-username>.github.io/friday-tournament/`

Open that link on a phone and log in. You should see a green **Live** dot under the title, which means you're connected to Firebase.

## 3. PWABuilder (Android app)
1. Go to https://www.pwabuilder.com, paste your GitHub Pages link and click **Start**.
2. The report should show the manifest, service worker and icons as detected. Click **Package for stores**.
3. **Android** → **Generate package**. You can keep the defaults (package ID like `io.github.yourname.friday_tournament`).
4. Download the zip. It contains:
   - an **.apk** you can send straight to friends to install (they'll need to allow "install unknown apps"),
   - an **.aab** for the Google Play Store, if you ever want to publish it there,
   - `assetlinks.json` plus a signing key. **Keep the signing key safe**, because you need it to publish updates.
5. Optional, so the app opens without the browser address bar: create a folder `.well-known` in your repo and upload the `assetlinks.json` from the zip into it.

For iPhone, open the GitHub Pages link in Safari, tap **Share → Add to Home Screen**, and it installs like an app.

## Updating the app later
Edit the files and upload them again to the GitHub repo using **Add file → Upload files**. Phones pick up the new version the next time the app opens. You don't need to rebuild the Android app unless you change the name or icon.

## How it works
- **Login:** choose your user from the dropdown. The first time, you create your password. After that, that password is how you log in.
- **Admin (Mohamed):** creates tournaments, adds players, resets passwords, and finishes or deletes tournaments.
- **Solo / Duo:** in Duo, players are paired into teams of 2, either randomly or by hand.
- **Table order:** points, then head-to-head results, then goal difference, then goals scored. The champion is announced early as soon as nobody can catch the leader.
