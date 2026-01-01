#!/usr/bin/env node

const http = require('http');
const net = require('net');
const os = require('os');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const RTSP_PORT = 554;
const SCAN_TIMEOUT_MS = 500;
const SERVER_PORT = 3000;
const MEDIAMTX_CONFIG = path.join(__dirname, 'mediamtx.yml');

let mediamtxProcess = null;
let currentCameraIp = null;

/**
 * Get the local subnet from network interfaces
 * Example: 192.168.1.
 */
function getSubnet() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const ip = iface.address;
        const lastDot = ip.lastIndexOf('.');
        return ip.substring(0, lastDot + 1);
      }
    }
  }
  return null;
}

/**
 * Check if a specific port is open on a host
 */
function isPortOpen(host, port, timeout) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

/**
 * Scan the network for devices with RTSP port open
 */
async function scanNetwork() {
  const subnet = getSubnet();
  if (!subnet) {
    console.error('Unable to get subnet!');
    return { error: 'Unable to get subnet' };
  }

  console.log(`\nScanning subnet: ${subnet}*`);
  const cameras = [];
  const promises = [];

  // Scan IPs 1-254
  for (let i = 1; i < 255; i++) {
    const host = subnet + i;
    promises.push(
      isPortOpen(host, RTSP_PORT, SCAN_TIMEOUT_MS).then((isOpen) => {
        if (isOpen) {
          cameras.push(host);
          console.log(`✓ Found camera at: ${host}`);
        }
      })
    );
  }

  await Promise.all(promises);
  console.log(`\nScan complete. Found ${cameras.length} device(s)\n`);
  return { cameras };
}

/**
 * Get the server's local IP address
 */
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/**
 * Configure camera IP in mediamtx.yml
 */
function configureCameraIp(cameraIp) {
  if (!cameraIp) {
    return { status: 'error', error: 'cameraIp parameter is required' };
  }

  try {
    console.log(`\n📝 Configuring camera IP: ${cameraIp}`);
    
    // Read current config
    let config = fs.readFileSync(MEDIAMTX_CONFIG, 'utf8');
    
    // Replace camera IP in RTSP source URL
    // Pattern: rtsp://admin:PASSWORD@OLD_IP:554/...
    const cameraIpPattern = /rtsp:\/\/([^@]+)@[\d.]+:/;
    const credentials = config.match(cameraIpPattern)?.[1] || 'admin:HFHJHP';
    
    // Replace the source line
    const oldPattern = /source:\s*rtsp:\/\/[^\n]+/;
    const newSource = `source: rtsp://${credentials}@${cameraIp}:554/h264/ch1/main/av_stream`;
    
    config = config.replace(oldPattern, newSource);
    
    // Write updated config
    fs.writeFileSync(MEDIAMTX_CONFIG, config);
    
    currentCameraIp = cameraIp;
    console.log(`✅ Camera IP configured: ${cameraIp}`);
    return { 
      status: 'success', 
      message: `Camera IP configured to ${cameraIp}`,
      cameraIp: cameraIp
    };
  } catch (error) {
    console.error('❌ Error configuring camera IP:', error);
    return { status: 'error', error: error.message };
  }
}

// HTTP Server setup
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (req.url === '/scan' && req.method === 'GET') {
      const result = await scanNetwork();
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else if (req.url === '/subnet' && req.method === 'GET') {
      const subnet = getSubnet();
      res.writeHead(200);
      res.end(JSON.stringify({ subnet }));
    } else if (req.url === '/getServerIp' && req.method === 'GET') {
      const serverIp = getLocalIp();
      res.writeHead(200);
      res.end(JSON.stringify({ serverIp }));
    } else if (req.url.startsWith('/configure') && req.method === 'POST') {
      const urlParams = new URL(req.url, `http://${req.headers.host}`);
      const cameraIp = urlParams.searchParams.get('cameraIp');
      const result = configureCameraIp(cameraIp);
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else if (req.url === '/start' && req.method === 'POST') {
      const result = startMediaMTX();
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else if (req.url === '/stop' && req.method === 'POST') {
      const result = stopMediaMTX();
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else if (req.url === '/status' && req.method === 'GET') {
      const status = getMediaMTXStatus();
      res.writeHead(200);
      res.end(JSON.stringify(status));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(SERVER_PORT, '0.0.0.0', () => {
  const subnet = getSubnet();
  const serverIp = getLocalIp();
  console.log(`\n🎥 EZVIZ Camera Discovery & Control Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  console.log(`Server Local IP: ${serverIp}`);
  console.log(`Current subnet: ${subnet}*`);
  console.log(`MediaMTX config: ${MEDIAMTX_CONFIG}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /scan         - Scan network for cameras with RTSP port open`);
  console.log(`  GET  /subnet       - Get current subnet`);
  console.log(`  GET  /getServerIp  - Get server's local IP address`);
  console.log(`  POST /configure    - Configure camera IP (query param: cameraIp=X.X.X.X)`);
  console.log(`  POST /start        - Start MediaMTX server`);
  console.log(`  POST /stop         - Stop MediaMTX server`);
  console.log(`  GET  /status       - Get MediaMTX status\n`);
  console.log(`Press Ctrl+C to stop\n`);
});

/**
 * Start MediaMTX server
 */
function startMediaMTX() {
  if (mediamtxProcess) {
    return { status: 'already_running', message: 'MediaMTX is already running' };
  }

  try {
    console.log('\n📢 Starting MediaMTX...');
    
    // Spawn mediamtx process
    mediamtxProcess = spawn('mediamtx', [MEDIAMTX_CONFIG], {
      stdio: 'inherit', // Show output in console
      detached: false
    });

    mediamtxProcess.on('error', (error) => {
      console.error('❌ Error starting MediaMTX:', error);
      mediamtxProcess = null;
    });

    mediamtxProcess.on('exit', (code) => {
      console.log(`⚠️  MediaMTX exited with code ${code}`);
      mediamtxProcess = null;
    });

    console.log(`✅ MediaMTX started (PID: ${mediamtxProcess.pid})`);
    return { status: 'success', message: 'MediaMTX started', pid: mediamtxProcess.pid };
  } catch (error) {
    console.error('❌ Failed to start MediaMTX:', error);
    return { status: 'error', error: error.message };
  }
}

/**
 * Stop MediaMTX server
 */
function stopMediaMTX() {
  if (!mediamtxProcess) {
    return { status: 'not_running', message: 'MediaMTX is not running' };
  }

  try {
    console.log('\n📢 Stopping MediaMTX...');
    const pid = mediamtxProcess.pid;
    
    // Kill the process
    mediamtxProcess.kill('SIGTERM');
    mediamtxProcess = null;
    
    console.log(`✅ MediaMTX stopped (was PID: ${pid})`);
    return { status: 'success', message: 'MediaMTX stopped' };
  } catch (error) {
    console.error('❌ Error stopping MediaMTX:', error);
    mediamtxProcess = null;
    return { status: 'error', error: error.message };
  }
}

/**
 * Get MediaMTX status
 */
function getMediaMTXStatus() {
  if (!mediamtxProcess) {
    return { running: false, status: 'not_running' };
  }
  return { running: true, status: 'running', pid: mediamtxProcess.pid };
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
