const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

const wss = new WebSocket.Server({ server });

let ideas = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify(ideas));

    ws.on('message', (message) => {
        console.log('Received:', message.toString()); 
        const idea = message.toString(); 
    
        if (typeof idea === "string") {
            ideas.push(idea);
        }
    
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(ideas)); 
            }
        });
    });
        ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});
