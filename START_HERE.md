# 🚀 Quick Start - GitHub Pages Hosting

## TL;DR (30 seconds)

You can host on **GitHub Pages** so you don't need to manually run a web server!

### Two Files Available

```
index.html                 ← Use for LOCAL ONLY setup
index-github-pages.html    ← Use for GITHUB PAGES hosting
```

### Choose Your Path

**PATH A: GitHub Pages (Recommended) ⭐**
```bash
# Rename file
mv index-github-pages.html index.html

# Push to GitHub
git add index.html
git commit -m "GitHub Pages version"
git push

# Go to Settings → Pages → Deploy from main
# Then visit: https://YOUR_USERNAME.github.io/ezviz_browser/

# Run locally (only thing needed!)
mediamtx mediamtx.yml
```

**PATH B: Local Development**
```bash
# Use current index.html as-is
git push

# Run both
python3 -m http.server 8080
mediamtx mediamtx.yml

# Visit: http://localhost:8080/index.html
```

---

## Why GitHub Pages?

| Aspect | Local | GitHub Pages |
|--------|-------|--------------|
| Access anywhere? | ❌ No | ✅ Yes |
| Manual servers? | ✅ 2 servers | ❌ 1 server |
| Setup time | 5 min | 10 min |
| Hosting cost | Free | Free |
| Domain | localhost | your-username.github.io |

---

## The Catch

**You still need MediaMTX running locally** (can't avoid this)
```bash
mediamtx mediamtx.yml
```

That's it. No other servers needed for GitHub Pages!

---

## Step by Step (5 minutes)

### 1. Prepare Files
```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
mv index-github-pages.html index.html
```

### 2. Commit
```bash
git add index.html
git commit -m "Use GitHub Pages version"
git push
```

### 3. Enable GitHub Pages
Visit: `https://github.com/YOUR_USERNAME/ezviz_browser/settings/pages`
- Select "Deploy from a branch"
- Choose "main"
- Wait 2 minutes

### 4. Run MediaMTX
```bash
mediamtx mediamtx.yml
```

### 5. Visit
```
https://YOUR_USERNAME.github.io/ezviz_browser/
```

---

## Documentation

- **Quick start:** This file
- **Detailed GitHub Pages guide:** `GITHUB_PAGES_QUICK_START.md`
- **With auto-discovery:** `DYNAMIC_IP_DISCOVERY.md`
- **All options:** `DEPLOYMENT_OPTIONS.md`

---

## Support Files Created

```
✅ index-github-pages.html      - GitHub Pages compatible version
✅ GITHUB_PAGES_SETUP.md         - Full setup guide
✅ GITHUB_PAGES_QUICK_START.md   - Visual guide
✅ DEPLOYMENT_OPTIONS.md         - Compare all 3 approaches
✅ .gitignore                    - Protects mediamtx.yml
✅ setup-github-pages.sh         - Automated setup script (optional)
```

---

## What Changed Between Versions?

### Original index.html (Local)
- ✅ Network discovery (auto-find cameras)
- ✅ Scan button
- ❌ Requires Node.js discovery server

### index-github-pages.html (GitHub Pages)
- ✅ Simple manual IP entry
- ✅ 100% static files
- ✅ No backend needed
- ❌ No auto-discovery

**Both work perfectly!** Choose based on your needs.

---

## Questions?

- **How do I access from my phone?** 
  - Use GitHub Pages URL from any network
  
- **Can I use dynamic IPs?**
  - Yes, just enter the IP each time
  - Browser auto-saves it with localStorage
  
- **What if I want auto-discovery?**
  - Keep the local setup with discovery-server.js
  - Or deploy to Netlify for serverless functions
  
- **Is my camera IP exposed?**
  - No! You enter it manually each time
  - Nothing is stored on GitHub

---

## Next: Deploy Now! 🎉

Ready? Follow the 5-step guide above and you're done!

Questions? Read the detailed guides in this folder.
