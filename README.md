# 📸 Moments Gallery — Google Photos & Drive Inspired Viewer

A fast, responsive photo and video gallery web app designed for family occasions, ceremonies, and cherished gatherings.

Built with **Next.js 15 (React 19)**, **Tailwind CSS**, **Lucide Icons**, and **Framer Motion**.

---

## ✨ Features

- **Google Drive Navigation**:
  - Breadcrumb trails (`Occasions > Father's Retirement Ceremony > Family`).
  - Hierarchical folders and subfolders.
  - Subfolder filter chips with live item counts.
  - Search bar to quickly filter photos, videos, and relatives.
- **Google Photos Viewing Experience**:
  - **Dynamic Media Grid**: Guarantees at least 6 photos are immediately visible in the primary screen viewport on desktop and mobile.
  - **Immersive Dark Lightbox**: Deep backdrop with full-screen focus.
  - **Boundary-Aware Left & Right Arrows**:
    - **First photo**: Left arrow is strictly disabled (`disabled`, dimmed, `cursor-not-allowed`).
    - **Last photo**: Right arrow is strictly disabled.
  - **Bottom Filmstrip Scroller**: Mini thumbnails at the bottom showing adjacent photos with active ring indicator.
  - **Keyboard Navigation**: `ArrowLeft`, `ArrowRight`, and `Escape` to close.
  - **Mobile Touch Gestures**: Swipe left/right on touchscreens.
- **Integrated Video Playback**:
  - Full online playback for `.mp4` and `.webm` video clips directly inside the lightbox with play/pause, seekbar, and volume controls.
  - Video badges and duration indicators on grid thumbnails.
- **Subfolder & Photo Manager**:
  - Create new subfolders on the fly (e.g. *Family*, *VIP Guests*, *Stage Ceremony*).
  - Add new photos and videos via file picker or URL into any chosen subfolder.

---

## 🚀 Getting Started

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the gallery.

### Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

This repository is configured for automatic deployment on Vercel:
```bash
vercel --prod
```
Or connect your GitHub repository directly to Vercel for continuous deployment on every git push!
