// Import required modules
const WebSocket = require('ws');  // WebSocket library
const http = require('http');     // HTTP server module
const fs = require('fs');         // File system module for reading config file

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Handle HTTP requests (if needed in the future)
  res.end('WebSocket Server');
});

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Read the sensor configuration from config.json
const sensorConfig = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

// Event listener for WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected.');

  // Function to send random sensor data to the connected client
  const sendRandomData = () => {
    Object.entries(sensorConfig).forEach(([sensorName, sensorData]) => {
      if (sensorData.enabled) {
        // Generate a random value within the specified range for each enabled sensor
        const randomValue = Math.random() * (sensorData.maxValue - sensorData.minValue) + sensorData.minValue;

        // Prepare the data to be sent to the client
        const sensorDataToSend = {
          sensorName,
          value: randomValue,
        };

        // Send the JSON-formatted sensor data to the client
        ws.send(JSON.stringify(sensorDataToSend));
      }
    });
  };

  // Send initial random data when a client connects
  sendRandomData();

  // Send random data every second
  const intervalId = setInterval(sendRandomData, 1000);

  // Event listener for WebSocket connection close
  ws.on('close', () => {
    console.log('Client disconnected.');
    // Stop sending data when the client disconnects
    clearInterval(intervalId);
  });
});

// Start the HTTP server on port 8080
server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
});
