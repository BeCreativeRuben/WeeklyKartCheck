const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - File Not Found</h1>
                    <p>The file ${filePath} was not found.</p>
                    <p>Available files:</p>
                    <ul>
                        <li><a href="/index.html">index.html</a> - Main Kart Check System</li>
                        <li><a href="/comprehensive-debug.html">comprehensive-debug.html</a> - Debug Tool</li>
                        <li><a href="/simple-test.html">simple-test.html</a> - Simple Test</li>
                        <li><a href="/test-new-system.html">test-new-system.html</a> - Test New System</li>
                    </ul>
                `);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Kart Check System Server`);
    console.log(`📁 Serving files from: ${process.cwd()}`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
    console.log('-'.repeat(50));
    console.log(`Available pages:`);
    console.log(`- Main System: http://localhost:${PORT}/index.html`);
    console.log(`- Debug Tool: http://localhost:${PORT}/comprehensive-debug.html`);
    console.log(`- Simple Test: http://localhost:${PORT}/simple-test.html`);
    console.log(`- Test New System: http://localhost:${PORT}/test-new-system.html`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped by user');
    server.close(() => {
        process.exit(0);
    });
});
