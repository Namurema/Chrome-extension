# LinkedIn Remote Frontend Jobs — Chrome Extension
A lightweight Chrome extension that lets you instantly search for **remote frontend developer and engineer jobs in Africa** on LinkedIn, with one click.



## What It Does

- Searches LinkedIn Jobs filtered to **Remote** positions in **Africa**
- Comes with **9 preset job title chips**: Frontend Developer, Frontend Engineer, React Developer, Next.js, Vue.js, Angular, JavaScript, TypeScript, and UI Developer
- Supports a **custom keyword input** so you can search any title you want
- Filter by **Experience Level**, **Date Posted**, and **Sort Order**
- Every search automatically locks in `Work Type: Remote` and `Location: Africa` — you never have to set those manually


## Project Structure

chrome-extension/
├── manifest.json    # Extension config (Manifest V3)
├── popup.html       # UI layout
├── popup.css        # Styling
├── popup.js         # Search logic & URL builder
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png



## How to Install

1. Clone  this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `chrome-extension` folder
6. The extension icon (blue **F**) will appear in your Chrome toolbar

> To pin it: click the 🧩 puzzle piece icon → click the pin next to "LinkedIn Remote Frontend Jobs"

---

## How to Use

1. Click the extension icon in your toolbar
2. Select a **job title chip** or type your own keyword
3. Adjust filters if needed (experience level, date posted, sort order)
4. Click **Search LinkedIn Jobs** — LinkedIn opens in a new tab with remote Africa results
5. Or use the **quick-action buttons** at the bottom for a one-click search

---

## Updating the Extension

After making any code changes, go to `chrome://extensions` and click the **refresh (↺)** icon on the extension card to reload it
