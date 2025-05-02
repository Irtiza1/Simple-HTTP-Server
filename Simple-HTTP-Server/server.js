const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    }[ext] || 'text/html';

    if (req.method === 'GET') {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('<h1>404 Not Found</h1>');
            } else {
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
            fs.appendFile('contact_submissions.txt', JSON.stringify(data) + '\n', err => {
                res.writeHead(302, {'Location': '/thankyou.html'});
                res.end();
            });
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

