# GitHub Pages Version - No Backend Required

This is the simplest version for GitHub Pages deployment. It requires users to enter their IP addresses manually.

## What's Different from the Main Version?

- ❌ No discovery server needed
- ✅ 100% static files (works on GitHub Pages)
- ✅ One HTML file that does everything
- ✅ LocalStorage for saving IPs

## How to Deploy to GitHub Pages

### 1. Create GitHub Repository

```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ezviz_browser.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository settings
2. Scroll to "GitHub Pages"
3. Select "Deploy from a branch"
4. Choose "main" branch and "/root" folder
5. Click Save

Your site will be available at: `https://yourusername.github.io/ezviz_browser/`

### 3. Update Your MediaMTX Server

The streaming will still work from anywhere! As long as:
1. MediaMTX is running on your laptop/server
2. You know the IP address
3. The network is accessible

## Files for GitHub Pages

Keep only these files in your repository:

```
ezviz_browser/
├── index.html          # Main application (supports both discovery and manual)
├── README.md           # Setup instructions
├── SETUP_GITHUB_PAGES.md  # This file
└── .gitignore
```

Delete/exclude from git:
- `discovery-server.js` (not needed for GitHub Pages)
- `node_modules/` (if you added them)
- `.env` files

## Usage Flow

1. Open `https://yourusername.github.io/ezviz_browser/`
2. Enter your **Laptop/Server IP** (where MediaMTX is running)
3. Enter your **Camera IP** (if you want to display it, or leave as default)
4. Click Connect
5. Stream appears!

## What Still Needs to Run Locally

You still need to run these on your laptop/home server:

**Terminal 1 - MediaMTX (RTSP → WebRTC):**
```bash
mediamtx mediamtx.yml
```

**That's it!** No Python server needed because GitHub Pages serves the HTML.

## Accessing from Outside Your Home Network

If you want to access from outside (like work, phone, etc.), you'll need:

1. **Dynamic DNS** - Since home IP changes
2. **Port Forwarding** - Forward ports 8889/8189 to your laptop
3. **HTTPS + TLS** - For remote WebRTC

This is more complex, so for now:
- ✅ Local network access works out of the box
- ⚠️ Remote access requires additional setup

## Alternative: Option 2 - Netlify Serverless Functions

If you want automatic discovery AND GitHub Pages, use Netlify instead:

1. Signup at https://netlify.com (free)
2. Connect your GitHub repository
3. Deploy functions folder
4. Update CONFIG in index.html to use Netlify functions

This gives you:
- ✅ GitHub Pages features
- ✅ Backend discovery server
- ✅ 100% automated

But it requires more setup. Ask if you want this approach.

## Troubleshooting GitHub Pages

### Site not loading
- Wait 1-2 minutes for deployment
- Check "GitHub Pages" section shows "Your site is live at..."
- Clear browser cache

### Can't connect to stream
- Ensure MediaMTX is running: `mediamtx mediamtx.yml`
- Verify IPs are correct
- Check firewall isn't blocking ports 8889/8189
- Use browser DevTools (F12) to check console errors

### Want to keep discovery server?
- Use Netlify instead of GitHub Pages
- Or keep local Node.js server running
- See DYNAMIC_IP_DISCOVERY.md for details
