# Deployment Options Summary

## Overview

You have 3 ways to deploy this EZVIZ camera streaming application:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Options                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. LOCAL ONLY                                                │
│     ├─ MediaMTX (port 8889)                                  │
│     ├─ Python HTTP server (port 8080)                        │
│     └─ Access: http://localhost:8080/index.html              │
│     ✅ Simple, ❌ Local network only                         │
│                                                               │
│  2. GITHUB PAGES (Recommended for Remote Access)             │
│     ├─ MediaMTX (port 8889) - runs locally                   │
│     ├─ Frontend on GitHub Pages (https://user.github.io)    │
│     └─ No Python server needed!                              │
│     ✅ Free, ✅ Remote access, ❌ No auto-discovery         │
│                                                               │
│  3. WITH DISCOVERY (Best UX, Needs Backend)                  │
│     ├─ MediaMTX (port 8889)                                  │
│     ├─ Node.js Discovery Server (port 3000)                  │
│     ├─ Python HTTP server (port 8080)                        │
│     └─ Auto-finds cameras on network                         │
│     ✅ Full features, ❌ More setup                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Recommended: Option 2 - GitHub Pages

### Why This Is Best:
- ✅ Static hosting (100% free forever)
- ✅ Works from anywhere (office, phone, etc.)
- ✅ Only MediaMTX needs to run (no web server!)
- ✅ Simpler setup
- ⚠️ Manual IP entry (no auto-discovery)

### Setup Steps:

**Step 1: Initialize Git**
```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

**Step 2: Create GitHub Repository**
1. Go to https://github.com/new
2. Create repo named `ezviz_browser` (public)
3. Don't initialize with README
4. Copy the commands to push existing repo

**Step 3: Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/ezviz_browser.git
git push -u origin main
```

**Step 4: Enable GitHub Pages**
1. Go to repo Settings → Pages
2. Select "Deploy from a branch"
3. Choose "main" branch, "/root" folder
4. Wait 1-2 minutes
5. Your site will be at: `https://YOUR_USERNAME.github.io/ezviz_browser/`

**Step 5: Rename the HTML File**
```bash
git rm index.html
mv index-github-pages.html index.html
git add index.html
git commit -m "Switch to GitHub Pages version"
git push
```

**Step 6: Run MediaMTX (Only Thing Running)**
```bash
mediamtx mediamtx.yml
```

Done! Visit your GitHub Pages URL and stream!

---

## File Guide

```
ezviz_browser/
│
├── index.html                    # USE THIS - Full featured (local)
├── index-github-pages.html       # USE THIS - GitHub Pages version
│
├── discovery-server.js           # Optional - Network discovery
│
├── README.md                     # Main documentation
├── GITHUB_PAGES_SETUP.md        # GitHub Pages guide (detailed)
├── DYNAMIC_IP_DISCOVERY.md      # Discovery server guide
│
├── mediamtx.yml                 # MediaMTX config (ADD YOUR CREDENTIALS)
└── .gitignore                   # What to exclude from git
```

---

## Comparison Table

| Feature | Local | GitHub Pages | With Discovery |
|---------|-------|--------------|-----------------|
| **Hosting** | Manual server | GitHub (free) | GitHub + Backend |
| **Access** | Local only | Anywhere | Anywhere |
| **Auto-Discovery** | ❌ No | ❌ No | ✅ Yes |
| **Setup Time** | 5 min | 10 min | 20 min |
| **Running Services** | 2 (MediaMTX + Python) | 1 (MediaMTX) | 3 (MediaMTX + Node + optional Python) |
| **Cost** | Free | Free | Free |
| **Difficulty** | Easy | Easy | Medium |

---

## Important Notes

### What Still Needs to Run Locally

No matter which option you choose, **MediaMTX must run on your laptop/home server**:

```bash
mediamtx mediamtx.yml
```

This is because:
- GitHub Pages can't access your home network
- Only your local MediaMTX can read the EZVIZ camera
- Your browser then connects to MediaMTX for video

### Security Considerations

**GitHub Pages Version (Recommended):**
- Your HTML/JS is public (no secrets)
- You manually enter MediaMTX IP when connecting
- Camera credentials stay in `mediamtx.yml` (not on GitHub)
- Add `mediamtx.yml` to `.gitignore` ✅ Already done!

### Accessing from Remote Networks

**Local Network (Home WiFi):**
- ✅ Works immediately
- Use local IP: `192.168.1.6`

**Remote Networks (Office, Cell):**
- ⚠️ Requires additional setup:
  1. **Dynamic DNS** (IP changes, need to track it)
  2. **Port Forwarding** (expose ports 8889/8189)
  3. **SSL/TLS** (secure connection)
  4. **Firewall Rules**
  
This is advanced - for now, GitHub Pages works perfectly on local network!

---

## Troubleshooting

### GitHub Pages not showing?
- Wait 1-2 minutes for deployment
- Check "Actions" tab for build status
- Clear browser cache (Cmd+Shift+R)

### Can't connect to stream?
- Verify MediaMTX is running
- Check IP address is correct
- Confirm you're on same network as MediaMTX
- Check firewall isn't blocking port 8889

### IPs saved but won't connect?
- Clear localStorage: Press F12 → Console → `localStorage.clear()`
- Refresh page
- Re-enter IPs

---

## Next Steps

1. **Choose your deployment** (recommend Option 2)
2. **Create GitHub repository**
3. **Enable GitHub Pages**
4. **Run MediaMTX locally**
5. **Open your GitHub Pages URL and stream!**

Questions? Check the detailed guides:
- Local + Discovery: See `DYNAMIC_IP_DISCOVERY.md`
- GitHub Pages: See `GITHUB_PAGES_SETUP.md`
