const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = './public' + (parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
    const ext = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    }[ext] || 'text/html';

    if (req.method === 'GET') {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                // File doesn't exist — serve the 404.html page
                fs.readFile('./public/404.html', (err404, errorPage) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(errorPage);
                });
            } else {
                // File exists — serve it
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content);
            }
        });
    }

    if (req.method === 'POST' && req.url === '/contact') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const data = querystring.parse(body);
            console.log("Received form data:", data);
    
            fs.appendFile('contact_submissions.txt', JSON.stringify(data) + '\n', err => {
                if (err) {
                    console.error("Error writing to file:", err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(302, {'Location': `/thankyou.html?name=${encodeURIComponent(data.name)}`});
                    res.end();
                }
            });
        });
    }
    



});



const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

