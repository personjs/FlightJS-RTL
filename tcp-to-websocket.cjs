const WebSocket = require('./node_modules/ws');
const net = require('net');

// Define WebSocket server
const wss = new WebSocket.Server({
  port: 8080,
  path: '/ws',
  maxPayload: 1024 * 1024, // 1 MiB
});

// Define TCP server details
const HOST = '11.32.32.10'; // Your TCP server host
const PORT = 30003; // Your TCP server port

function parseData(data) {
  try {
    const fields = data.split(",");
    return {
      "id": fields[4],
      "latitude": fields[14],
      "longitude": fields[15],
      "altitude": fields[11],
      "heading": null,
      "speed": null,
      "timestamp": Date.now(),
    }
  } catch (err) {
    console.error('Failed to parse data:', err);
  }
  return null;
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Create a TCP client to connect to the TCP server
  const tcpClient = new net.Socket();
  tcpClient.connect(PORT, HOST, () => {
    console.log('Connected to TCP server');
  });

  // Forward data from WebSocket to TCP server
  ws.on('message', (message) => {
    console.log('Sending data to TCP server:', message);
    tcpClient.write(message);
  });

  // Forward data from TCP server to WebSocket
  tcpClient.on('data', (data) => {
    const planeData = parseData(data.toString());
    if (planeData.latitude && planeData.longitude) {
      console.log(data.toString());
      console.log(JSON.stringify(planeData));
      ws.send(JSON.stringify(planeData)); // Send data to WebSocket client
    }
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    tcpClient.end(); // Close TCP connection when WebSocket disconnects
  });
});

console.log(`WebSocket server running on ws://localhost:8080/ws`);
