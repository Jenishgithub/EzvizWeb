# Dynamic Camera IP Discovery Guide

Since IP addresses can change, this guide covers how to automatically discover your EZVIZ camera's IP address instead of hardcoding it.

## Why This Matters

- DHCP can assign different IPs to devices on restart
- Cameras might be moved to different networks
- Having a manual scan feature is convenient for setup

## Architecture

```
Web Browser (index.html)
       ↓
Discovery Server (discovery-server.js) [Node.js - Port 3000]
       ↓
Local Network Scanner
       ↓
RTSP Port Check (554)
       ↓
Camera IP Detection
```

## Implementation

### 1. **Frontend Features** (index.html)

The updated HTML includes:

#### Manual IP Entry
- Input fields for both camera and server IP
- User can manually enter known IPs
- Credentials saved to browser localStorage

#### Network Scan Button
- Scans the local network for devices with RTSP port (554) open
- Shows dropdown with discovered cameras
- Click to auto-select and connect

#### Persistent Storage
- Previous IPs are saved and auto-loaded
- Uses browser's localStorage API
- Never needs re-entering if network is stable

```javascript
// Save IPs to localStorage
localStorage.setItem('cameraIp', '192.168.1.4');
localStorage.setItem('serverIp', '192.168.1.6');

// Load IPs on page load
const savedIp = localStorage.getItem('cameraIp');
```

### 2. **Backend Discovery Service** (discovery-server.js)

Node.js server that scans your local network:

#### What It Does
1. Gets your current network subnet
2. Checks each IP (1-254) for open RTSP port 554
3. Returns list of discovered cameras
4. Runs on port 3000 (configurable)

#### Why Node.js Backend
- Browser can't make raw TCP socket connections (security restriction)
- Backend has full network access
- Can scan multiple IPs concurrently

#### How the Scan Works
```
Local IP: 192.168.1.6
Subnet: 192.168.1.
Scan: 192.168.1.1 → 192.168.1.254
Check: Is port 554 open?
Result: Found 192.168.1.4 (EZVIZ Camera)
```

## Setup Instructions

### Step 1: Install Node.js

If not already installed:
```bash
# macOS with Homebrew
brew install node

# Or download from https://nodejs.org/
```

### Step 2: Run Discovery Server

```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
node discovery-server.js
```

You should see:
```
🎥 EZVIZ Camera Discovery Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running on http://localhost:3000

Current subnet: 192.168.1.*

Endpoints:
  GET /scan   - Scan network for cameras with RTSP port open
  GET /subnet - Get current subnet

Press Ctrl+C to stop
```

### Step 3: Run Python HTTP Server (in a separate terminal)

```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
python3 -m http.server 8080
```

### Step 4: Open in Browser

Navigate to:
```
http://localhost:8080/index.html
```

### Step 5: Scan or Enter IPs Manually

**Option A: Automatic Scan**
1. Click "🔍 Scan Network" button
2. Wait for scan to complete
3. Select camera from dropdown
4. Stream starts automatically

**Option B: Manual Entry**
1. Enter Camera IP (192.168.1.4)
2. Enter Server IP (192.168.1.6)
3. Press Enter or close controls
4. Stream starts automatically

## Browser Storage (localStorage)

The frontend uses localStorage to persist IPs:

```javascript
// Saved in browser storage as:
localStorage.cameraIp = "192.168.1.4"
localStorage.serverIp = "192.168.1.6"
```

**Clear stored IPs:**
- Open Developer Tools (F12)
- Console tab: `localStorage.clear()`
- Refresh page

## API Endpoints

### GET /scan

Scans the network for cameras.

**Response:**
```json
{
  "cameras": [
    "192.168.1.4",
    "192.168.1.25"
  ]
}
```

### GET /subnet

Returns current network subnet.

**Response:**
```json
{
  "subnet": "192.168.1."
}
```

## Troubleshooting

### Scan Returns No Cameras
1. Ensure discovery server is running on port 3000
2. Verify camera has RTSP enabled and accessible
3. Check if camera is on the same network
4. Try manually entering IP instead

### "Make sure discovery server is running" Error
- Run: `node discovery-server.js`
- Check that port 3000 isn't in use: `lsof -i :3000`
- Verify localhost:3000 is accessible

### Camera Found But Won't Connect
1. Verify MediaMTX is running
2. Check server IP is correct
3. Ensure ports 8889 and 8189 are accessible
4. Review MediaMTX logs for errors

### Scan is Slow
- Network scan takes ~30 seconds (255 IPs × 500ms timeout)
- Smaller timeout = faster but might miss cameras
- Adjust `SCAN_TIMEOUT_MS` in discovery-server.js if needed

## Advanced Configuration

### Customize Scan Timeout

Edit `discovery-server.js`:
```javascript
const SCAN_TIMEOUT_MS = 500;  // Change this value
// Lower = faster scan but might miss devices
// Higher = slower scan but more reliable
```

### Change Server Port

Edit `discovery-server.js`:
```javascript
const SERVER_PORT = 3000;  // Change this
```

And update `index.html`:
```javascript
const CONFIG = {
  DISCOVERY_SERVER: 'http://localhost:3000',  // Change port here
  ...
};
```

### Run Discovery Server on Startup

**macOS with launchd:**

Create `~/Library/LaunchAgents/com.ezviz.discovery.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ezviz.discovery</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/teslatech/projects/teslatech/ezviz_browser/discovery-server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/tmp/ezviz-discovery-error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/ezviz-discovery.log</string>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.ezviz.discovery.plist
```

## Security Considerations

- Discovery server scans ONLY your local network
- No cameras IPs are stored on server
- All scanning happens locally
- Browser stores IPs in localStorage (local device only)
- No external services are used

## Comparison: Browser vs Backend Approach

| Feature | Browser JS | Node.js Backend |
|---------|------------|-----------------|
| Direct socket access | ❌ Blocked by security | ✅ Available |
| Network scanning | ❌ Cannot implement | ✅ Full support |
| Port checking | ❌ Cannot check directly | ✅ Full support |
| Local storage | ✅ localStorage API | ✅ File system |
| Deployment | ✅ Trivial | ✅ One more service |

## References

- [Node.js Net Module](https://nodejs.org/api/net.html)
- [Browser localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [WebRTC Peer Connection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)
