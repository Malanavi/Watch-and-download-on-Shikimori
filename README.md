# <img src="assets/icons/logo.png" alt="Watch on Shikimori logo" width="24" style="vertical-align: middle;"/> Watch and download on Shikimori

Watch and download on Shikimori is a browser extension that lets you **watch and download anime directly on the Shikimori website** using built-in players and torrent trackers.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [How to use?](#how-to-use)
- [How to Build](#how-to-build)
- [Project Status](#project-status)
- [License](#license)

## Features

- Shikimori-style **Show / Hide Player** button.
- Built-in **Kodik** and **AniLibria** players.
- Player features:
  - Resolution selection (up to 1080p)
  - Playback speed control
  - Multiple dubbing and subtitle options
- Automatically resumes playback from the last watched episode.
- Ability to show and hide the player without page reload.
- Direct links to search for the current anime on supported torrent trackers.
- Clean integration into the Shikimori UI.

## Installation

<div align="center">

[![image](https://img.shields.io/amo/v/watch-on-shikimori?color=orange&style=for-the-badge&logo=firefoxbrowser)](https://addons.mozilla.org/en-US/firefox/addon/watch-on-shikimori/)
[![image](https://img.shields.io/chrome-web-store/v/gbhlkingdkfeiolpfgpeclddinlahnjf?color=blue&style=for-the-badge&logo=google-chrome)](https://chromewebstore.google.com/detail/watch-and-download-on-shi/gbhlkingdkfeiolpfgpeclddinlahnjf)

</div>

> 💡 You can install the stable version directly from Firefox Add-ons, Chrome Web Store
> or build and load the extension manually (see [How to Build](#how-to-build)).

## How to use?

### 1. Show the player
Click the **Show Player** button on an anime page.

![image](assets/screenshots/screenshot_1_chrome.jpeg?raw=true)

### 2. Watch anime
Watch anime using the built-in **Kodik** or **AniLibria** player with multiple dubbing and subtitle options.

![image](assets/screenshots/screenshot_2_chrome.jpeg?raw=true)

### 3. Hide the player
Click the button again to hide the player.

![image](assets/screenshots/screenshot_3_chrome.jpeg?raw=true)

### 4. Download anime
Use the provided links to find and download anime from supported torrent trackers.

![image](assets/screenshots/screenshot_4_chrome.jpeg?raw=true)

## How to Build

This project uses **Node.js**, **npm**, and a build step that outputs a ready-to-use browser extension.

### Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9

### 1. Clone the repository

```bash
git clone https://github.com/Malanavi/Watch-and-download-on-Shikimori.git
cd Watch-and-download-on-Shikimori
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

After the build completes, the compiled extension will be available in the `dist/` directory.

### 4. Load the extension into the browser (Manual installation)

#### Firefox

1. Open about:debugging
2. Go to This Firefox
3. Click Load Temporary Add-on
4. Select the file: `dist/manifest.json`

#### Chrome / Chromium

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the folder: `dist/`

⚠️ Important:
Always load the extension using the manifest.json file located in the dist folder,
not the root manifest.json.

## Project Status

- Current version: **4.x**
- Status: **Maintenance mode**
- Updates are released only to fix critical bugs or breaking issues.

## License

This project is licensed under the **GPL-3.0-or-later** license.
See the [LICENSE](LICENSE) file for details.
