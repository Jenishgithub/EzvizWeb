# Dynamic IP Detection & Camera Configuration - Testing Guide

This guide walks you through testing the complete dynamic IP detection and automatic camera configuration system.

## ✅ Implementation Status

All code is implemented and ready to test:
- ✅ Server auto-detects local IP via `/getServerIp` endpoint
- ✅ Camera IP automatically configured in `mediamtx.yml` via `/configure` endpoint  
- ✅ MediaMTX auto-starts/stops on page load/unload
- ✅ Network scanning finds cameras with RTSP port open
- ✅ Full workflow: detect → scan → select → configure → stream

## 🚀 Quick Start

### Step 1: Start the Discovery Server

```bash
cd /Users/teslatech/projects/teslatech/ezviz_browser
node discovery-server.js
```

You should see output like:
```
🎥 EZVIZ Camera Discovery & Control Server
📍 Server IP: 192.168.1.6
🌍 Subnet: 192.168.1.
Server running on http://0.0.0.0:3000

Available Endpoints:
  GET  /scan           - Scan network for cameras
  GET  /getServerIp    - Get server's local IP address
  POST /configure      - Configure camera IP (query param: cameraIp=X.X.X.X)
  POST /start          - Start MediaMTX
  POST /stop           - Stop MediaMTX
  GET  /status         - Get MediaMTX status
```

### Step 2: Open Browser

Open the GitHub Pages URL (or local version):
- GitHub Pages: https://jenishgithub.github.io/EzvizWeb/
- Local: Open `index.html` in VS Code's Simple Browser

### Step 3: Watch the Magic

The page should automatically:
1. ✅ Detect server IP (shown in "Server IP" field)
2. ✅ Start MediaMTX (status message: "MediaMTX started - Ready to stream")
3. ✅ Display scan and camera selection buttons

### Step 4: Find Your Camera

Click **"Scan Network"** button:
- Wait ~30 seconds for scan to complete
- Camera should appear in dropdown (e.g., "Camera at 192.168.1.4")

### Step 5: Configure & Connect

1. Select camera from dropdown
   - Page auto-calls `/configure` to update `mediamtx.yml`
   - MediaMTX automatically restarts with new camera
   - Status shows "Camera configured and ready to connect"

2. Click **"Connect to Stream"**
   - WebRTC connection should establish
   - Camera video appears in player
   - Status shows "🟢 Connected - Streaming"

### Step 6: Verify Auto-Stop

Close the page:
- Discovery server should show: `✅ MediaMTX stopped`
- MediaMTX process is killed when page closes

## 🧪 Detailed Testing Scenarios

### Test 1: Server IP Detection

**Expected behavior:** 
- Page loads and automatically detects server IP
- "Server IP" input field populates with 192.168.x.x
- Should not be hardcoded or default value

**Test steps:**
1. Start discovery server
2. Open browser to GitHub Pages URL
3. Check "Server IP" field is populated correctly
4. Restart discovery server with different IP (if on different network)
5. Refresh page and verify new IP is detected

**Success criteria:** Server IP auto-detected correctly, changes with network

---

### Test 2: Network Scanning

**Expected behavior:**
- Scan finds all devices with RTSP port 554 open
- Camera appears in dropdown with label "Camera at X.X.X.X"
- Scan handles timeout gracefully (30 seconds)

**Test steps:**
1. Ensure discovery server is running
2. Click "Scan Network" button
3. Wait for scan to complete
4. Verify camera IP appears in dropdown
5. Check browser console for debug info

**Success criteria:** Camera IP discovered and shown in dropdown list

---

### Test 3: Camera Configuration

**Expected behavior:**
- Selecting a camera from dropdown triggers `/configure` endpoint
- `mediamtx.yml` is updated with new camera IP
- MediaMTX restarts with new configuration
- No manual restart required

**Test steps:**
1. Open `mediamtx.yml` in editor (keep open)
2. Scan network and select camera
3. Watch `mediamtx.yml` file for changes
4. Verify source line shows new camera IP:
   ```yaml
   source: rtsp://admin:HFHJHP@192.168.1.4:554/h264/ch1/main/av_stream
   ```
5. Check terminal output: should see logs about restart

**Success criteria:** File updated, MediaMTX restarts, no manual intervention needed

---

### Test 4: Dynamic IP Changes

**Expected behavior:**
- Changing camera IP is seamless
- Previous selection doesn't break future selections
- Multiple scans work correctly

**Test steps:**
1. Scan network, select Camera A
2. Stream works correctly
3. Close browser
4. Physically move camera to different location (or change VLAN)
5. Open browser again
6. Scan network (should find camera at new IP)
7. Select camera and stream works again

**Success criteria:** System adapts to IP changes without reconfiguration

---

### Test 5: WebRTC Connection

**Expected behavior:**
- After configuration, clicking "Connect to Stream" establishes WebRTC
- Video appears in player within 5 seconds
- Status shows "🟢 Connected - Streaming"

**Test steps:**
1. Configure camera via network selection
2. Click "Connect to Stream"
3. Watch browser console for WebRTC logs:
   - "📤 Sending offer to..."
   - "✅ WebRTC connection established"
4. Verify video appears
5. Watch for ICE candidate logs

**Success criteria:** Video streams successfully, connection stable

---

### Test 6: Auto Start/Stop

**Expected behavior:**
- Page load automatically starts MediaMTX
- Page close automatically stops MediaMTX
- No manual process management needed

**Test steps:**
1. Kill all `mediamtx` processes: `killall mediamtx`
2. Start discovery server
3. Open browser (verify MediaMTX starts automatically)
4. Check: `ps aux | grep mediamtx` should show running process
5. Close browser tab/window
6. Check: Process should be killed within 2 seconds

**Success criteria:** Auto-start and auto-stop working reliably

---

### Test 7: Error Handling

**Expected behavior:**
- Discovery server errors shown in browser
- Invalid camera IP shows error message
- Missing server shows helpful error

**Test steps:**
1. Stop discovery server
2. Try clicking "Scan Network"
3. Verify error message: "Make sure discovery server is running"
4. Start discovery server again
5. Verify scan works

**Success criteria:** Graceful error messages, no crashes

## 🔍 Debugging Tips

### Check Server Logs
```bash
# Watch discovery server output
node discovery-server.js
```

### Check Browser Logs
- Open DevTools: F12
- Console tab shows all JavaScript logs
- Look for ✅ (success) and ❌ (error) indicators

### Monitor Configuration File
```bash
# Watch mediamtx.yml for changes
tail -f mediamtx.yml
```

### Check MediaMTX Process
```bash
# See if process is running
ps aux | grep mediamtx

# See all network ports
lsof -i :8889  # WebRTC port
lsof -i :3000  # Discovery server
```

### Check Network Connectivity
```bash
# Verify camera is reachable
ping 192.168.1.4

# Check RTSP port
nc -zv 192.168.1.4 554
```

## 📋 Testing Checklist

- [ ] Discovery server starts without errors
- [ ] Server IP auto-detected on page load
- [ ] MediaMTX auto-starts on page load
- [ ] Network scan completes within 30 seconds
- [ ] Camera appears in dropdown after scan
- [ ] Selecting camera updates `mediamtx.yml`
- [ ] MediaMTX restarts after configuration
- [ ] WebRTC connection successful after restart
- [ ] Video stream appears and plays
- [ ] Page close triggers MediaMTX shutdown
- [ ] Multiple camera selections work correctly
- [ ] Error messages display properly
- [ ] Browser console shows correct logs

## 🐛 Common Issues

### "Make sure discovery server is running"
- **Cause:** Discovery server not started or not accessible on localhost:3000
- **Fix:** Start discovery server: `node discovery-server.js`

### Camera doesn't appear in dropdown after scan
- **Cause:** Network scan found no cameras with RTSP port 554 open
- **Fix:** 
  - Verify camera is powered on
  - Verify camera is on same network
  - Check firewall isn't blocking port 554
  - Test manually: `nc -zv 192.168.1.4 554`

### "Cannot configure camera" error
- **Cause:** `/configure` endpoint failed
- **Fix:**
  - Check `mediamtx.yml` file exists and is readable
  - Check Node.js has write permissions
  - Verify cameraIp parameter is valid IP format

### WebRTC connection fails after configuration
- **Cause:** MediaMTX didn't restart properly or config is invalid
- **Fix:**
  - Check `mediamtx.yml` source line is correct
  - Wait 2-3 seconds after selecting camera (MediaMTX startup time)
  - Manually test MediaMTX: `mediamtx mediamtx.yml`

### No video appears, but connection succeeds
- **Cause:** Camera not streaming at configured path
- **Fix:**
  - Verify RTSP path: `rtsp://admin:HFHJHP@192.168.1.4:554/h264/ch1/main/av_stream`
  - Test with VLC: `vlc rtsp://admin:HFHJHP@192.168.1.4:554/...`

## ✨ Next Steps

Once testing is complete:

1. **Commit to GitHub**
   ```bash
   git add .
   git commit -m "Implement dynamic IP detection and camera configuration"
   git push
   ```

2. **Test from Different Device**
   - Use phone/tablet to test GitHub Pages URL
   - Verify remote access works

3. **Consider Remote Access Setup**
   - See [DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md) for VPN/tunneling options
   - Recommended: Tailscale for secure remote access

4. **Production Hardening**
   - Add input validation to `/configure` endpoint
   - Add authentication if exposed to internet
   - Add rate limiting to `/scan` endpoint

## 📞 Support

For issues or questions:
- Check browser console (F12) for error messages
- Check discovery server terminal output
- Review logs in GITHUB_PAGES_QUICK_START.md
- Search existing documentation files

Good luck! 🚀
