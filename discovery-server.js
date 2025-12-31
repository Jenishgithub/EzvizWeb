#!/usr/bin/env node

const http = require('http');
const net = require('net');
const os = require('os');

const RTSP_PORT = 554;
const SCAN_TIMEOUT_MS = 500;
const SERVER_PORT = 3000;

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

// HTTP Server setup
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
  console.log(`\n🎥 EZVIZ Camera Discovery Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  console.log(`\nCurrent subnet: ${subnet}*`);
  console.log(`\nEndpoints:`);
  console.log(`  GET /scan   - Scan network for cameras with RTSP port open`);
  console.log(`  GET /subnet - Get current subnet\n`);
  console.log(`Press Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
