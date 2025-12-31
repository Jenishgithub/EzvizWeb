# EZVIZ Camera Live Stream via WebRTC

This project streams video from an EZVIZ security camera using RTSP protocol through MediaMTX, converting it to WebRTC for browser playback.

## Architecture

```
EZVIZ Camera (RTSP)
       ↓
MediaMTX (RTSP → WebRTC conversion)
       ↓
Web Browser (WebRTC playback)
```

## Prerequisites

- EZVIZ camera with RTSP stream access
- MediaMTX installed on your system
- Python 3.x (for simple HTTP server)
- Modern web browser with WebRTC support

## Setup Instructions

### 1. Install MediaMTX

Download from [MediaMTX releases](https://github.com/bluenviron/mediamtx/releases) and install on your system.

### 2. Configure MediaMTX

Create or update the `mediamtx.yml` configuration file with your camera details:

```yaml
paths:
  ezviz:
    source: rtsp://admin:PASSWORD@192.168.1.4:554/h264/ch1/main/av_stream
    rtspTransport: tcp

webrtc: true
webrtcEncryption: false
```

**Configuration Breakdown:**
- `paths.ezviz` - Stream path name (used in the web interface)
- `source` - RTSP URL of your EZVIZ camera
  - Replace `PASSWORD` with your camera password
  - Replace `192.168.1.4` with your camera's IP address
  - Replace the stream path if different
- `rtspTransport: tcp` - Use TCP for RTSP (more reliable than UDP)
- `webrtc: true` - Enable WebRTC support
- `webrtcEncryption: false` - Disable encryption for local network use

### 3. Update HTML Configuration

Edit `index.html` and update the CONFIG object with your network details:

```javascript
const CONFIG = {
  MEDIAMTX_HOST: '192.168.1.6',      // Your laptop's IP address
  MEDIAMTX_PORT: 8889,                // MediaMTX WebRTC port
  STREAM_PATH: 'ezviz',               // Matches the path name in mediamtx.yml
  STUN_SERVER: 'stun:stun.l.google.com:19302'
};
```

### 4. Start MediaMTX

```bash
mediamtx mediamtx.yml
```

You should see output like:
```
INF MediaMTX v1.15.6
INF [WebRTC] listener opened on :8889 (HTTP), :8189 (ICE/UDP)
INF [path ezviz] [RTSP source] ready: 1 track (H264)
```

### 5. Start the Python HTTP Server

In the project directory, run:

```bash
python3 -m http.server 8080
```

This starts a local web server on port 8080.

### 6. Open the Stream in Browser

Navigate to:
```
http://localhost:8080/index.html
```

Or from another machine on the network:
```
http://192.168.1.6:8080/index.html
```

The video stream should appear automatically.

## Troubleshooting

### 400 Bad Request Error
- Ensure MediaMTX is running
- Verify the `MEDIAMTX_HOST` in index.html matches your laptop's IP
- Check that `rtspTransport: tcp` is set in mediamtx.yml

### "SetRemoteDescription called with no ice-ufrag" Error
- Ensure the video transceiver is added to RTCPeerConnection
- Verify WebRTC is enabled in mediamtx.yml
- Try refreshing the browser

### Cannot connect to camera
- Verify the camera's RTSP URL is correct
- Test RTSP connection: `ffplay rtsp://admin:PASSWORD@192.168.1.4:554/h264/ch1/main/av_stream`
- Check camera firewall settings
- Ensure TCP port 554 is accessible

### No video displayed
- Check browser console for errors (F12 Developer Tools)
- Verify MediaMTX logs show the RTSP source is "ready"
- Try refreshing the page
- Check that both MediaMTX and HTTP server are running

## Network Configuration

**For Local Network Access:**
- Both servers (MediaMTX and HTTP) should be on the same network
- Use your laptop's IP address in browser URL
- Firewall may need to allow ports 8080, 8889, and 8189

**Example Network Setup:**
- EZVIZ Camera: 192.168.1.4
- Laptop: 192.168.1.6
- Access from phone/tablet: `http://192.168.1.6:8080/index.html`

## Ports Used

| Port | Service | Protocol |
|------|---------|----------|
| 8554 | RTSP Listener | TCP/UDP |
| 8888 | HLS Listener | TCP |
| 8889 | WebRTC HTTP | TCP |
| 8189 | ICE/UDP | UDP |
| 8080 | HTTP Server | TCP |

## File Structure

```
ezviz_browser/
├── README.md          # This file
├── index.html         # Web interface
└── mediamtx.yml       # MediaMTX configuration
```

## Configuration Details

### Important Settings

- **webrtcEncryption: false** - Only for local networks. Enable for remote access.
- **rtspTransport: tcp** - More reliable for home networks than UDP
- **webrtc: true** - Enables WebRTC functionality globally

## Security Notes

- `webrtcEncryption: false` is only suitable for local networks
- For remote access, enable encryption and use proper authentication
- Keep your camera credentials secure
- Use a firewall to restrict access to these ports

## References

- [MediaMTX Documentation](https://github.com/bluenviron/mediamtx)
- [WebRTC Specification](https://www.w3.org/TR/webrtc/)
- [WHEP Protocol](https://datatracker.ietf.org/doc/draft-ietf-wish-whep/)
