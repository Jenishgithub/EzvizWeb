# 🌍 GitHub Pages Hosting Guide

## The Problem

You want to host your EZVIZ streaming application **without manually running servers**.

## The Solution

**GitHub Pages hosts your frontend, MediaMTX runs locally!**

```
Your Browser                  GitHub Pages              Your Laptop
    │                             │                          │
    ├─ Opens:                     │                          │
    │ ezviz_browser.github.io ◄───┼──────────────────────────┤ Serves HTML/JS
    │                             │                          │
    │                             │     Connects to:         │
    │                             │     192.168.1.6:8889 ───►│ MediaMTX
    │                             │                          │
    │◄────────── WebRTC Stream ──────────────────────────────│
    │  (Video from camera)                                   │
    │                                                        │
```

## What You Get

✅ No manual Python server running  
✅ Access from anywhere (office, mobile, etc.)  
✅ Free forever (GitHub Pages)  
✅ One command to deploy: `git push`  
✅ Just keep MediaMTX running  

## Files You Need

| File | Purpose | Push to GitHub? |
|------|---------|-----------------|
| `index-github-pages.html` | Web interface | ✅ Yes (rename to `index.html`) |
| `mediamtx.yml` | Camera config | ❌ No (add to `.gitignore`) |
| `README.md` | Documentation | ✅ Yes |
| `discovery-server.js` | Discovery | ❌ No (only for local discovery) |

## 5-Minute Setup

### 1️⃣ Replace index.html
```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
git rm index.html  # Remove old version
mv index-github-pages.html index.html  # Rename new one
```

### 2️⃣ Commit to GitHub
```bash
git add index.html
git commit -m "Switch to GitHub Pages version"
git push
```

### 3️⃣ Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Select "Deploy from a branch"
3. Choose "main" branch
4. Wait 1-2 minutes

### 4️⃣ Run MediaMTX (Only Thing Local!)
```bash
mediamtx mediamtx.yml
```

### 5️⃣ Visit Your Site
```
https://YOUR_USERNAME.github.io/ezviz_browser/
```

Enter your laptop IP (192.168.1.6) and click Connect!

---

## Key Differences: GitHub Pages Version

### What Changed
- ❌ Removed discovery server integration
- ❌ Removed automatic network scanning
- ✅ Simplified to pure static files
- ✅ Manual IP entry (no backend needed)

### Why This Works
- GitHub Pages can only host static files
- Can't run Node.js or Python servers
- MediaMTX handles the video streaming
- Browser downloads HTML/JS from GitHub
- Browser connects directly to your MediaMTX

### Is This Enough?
✅ **YES!** For most use cases:
- Local network: Works perfectly
- Remote access: Works (just enter IP)
- Auto-discovery: Not available (but rarely needed)

If you really want auto-discovery on GitHub Pages, use Netlify instead (requires Netlify account).

---

## Access From Different Networks

### Same WiFi (192.168.1.x)
```
GitHub Pages URL: https://YOUR_USERNAME.github.io/ezviz_browser/
Enter IP: 192.168.1.6
Result: ✅ Works!
```

### Mobile (Outside Network)
```
GitHub Pages URL: https://YOUR_USERNAME.github.io/ezviz_browser/
Enter IP: [Your public home IP or dynamic DNS]
Result: ⚠️ Requires port forwarding + firewall setup
```

### Work Network
```
GitHub Pages URL: https://YOUR_USERNAME.github.io/ezviz_browser/
Enter IP: Same as above
Result: ⚠️ Same as mobile (advanced setup needed)
```

---

## Files in Repository

```
ezviz_browser/
├── 📄 index.html .................. ✅ Push (GitHub Pages serves this)
├── 📄 README.md ................... ✅ Push
├── 📄 DEPLOYMENT_OPTIONS.md ....... ✅ Push
├── 📄 GITHUB_PAGES_SETUP.md ....... ✅ Push
├── 📄 DYNAMIC_IP_DISCOVERY.md ..... ✅ Push (for reference)
│
├── 🔧 mediamtx.yml ............... ❌ DON'T PUSH (has credentials)
├── 🔧 discovery-server.js ......... ❌ DON'T PUSH (local only)
├── 🔧 setup-github-pages.sh ....... ❌ Optional
│
├── 📋 .gitignore .................. ✅ Push (protects credentials)
└── 📦 node_modules/ .............. ❌ DON'T PUSH (add to .gitignore)
```

---

## Security ✅

### What's Private
- 🔐 Camera credentials (in `mediamtx.yml`)
- 🔐 MediaMTX server IP (you enter it when connecting)
- 🔐 Your home network

### What's Public
- 📝 HTML/JavaScript code (GitHub public repo)
- 📊 README documentation
- No API keys or passwords are stored

`mediamtx.yml` is in `.gitignore` so it never gets pushed! ✅

---

## Comparing All 3 Options

### Local Setup (Option 1)
```bash
python3 -m http.server 8080     # HTTP server
mediamtx mediamtx.yml           # MediaMTX
# Open: http://localhost:8080/index.html
```
- ✅ Works immediately
- ✅ Full features
- ❌ Local network only

### GitHub Pages (Option 2) ⭐ RECOMMENDED
```bash
mediamtx mediamtx.yml           # Just this!
# Open: https://USERNAME.github.io/ezviz_browser/
```
- ✅ Remote access
- ✅ No web server needed
- ✅ Free hosting forever
- ❌ Manual IP entry

### With Auto-Discovery (Option 3)
```bash
node discovery-server.js         # Discovery
python3 -m http.server 8080      # HTTP server  
mediamtx mediamtx.yml           # MediaMTX
# Open: http://localhost:8080/index.html
```
- ✅ Auto-discovery works
- ✅ Easier to use
- ❌ More setup
- ❌ Can't use GitHub Pages

---

## Troubleshooting

### GitHub Pages not live?
```
→ Wait 1-2 minutes
→ Check Actions tab for build status
→ Clear cache: Cmd+Shift+R
```

### Can't connect to stream?
```
→ MediaMTX running? mediamtx mediamtx.yml
→ IP correct? Check with: ifconfig | grep inet
→ Same network? Both devices connected to same WiFi?
→ Firewall? Check that ports 8889 and 8189 are allowed
```

### Can't find GitHub Pages URL?
```
→ Go to repo Settings → Pages
→ Look for "Your site is live at: https://..."
→ Or wait a bit longer if it shows "Building"
```

---

## Summary

| Need | Solution |
|------|----------|
| **Simple setup** | Use GitHub Pages (Option 2) ⭐ |
| **Remote access** | Use GitHub Pages (Option 2) ⭐ |
| **Auto-discovery** | Use local setup with Node.js (Option 3) |
| **Best UX** | Deploy to Netlify (more advanced) |

**Recommendation: Go with GitHub Pages! 🚀**

It gives you everything you need without extra complexity.
