//imports the http module:
const http = require('http'),
fs = require('fs'),
url = require('url');


//function from http module, and the tow areguments of the function passed into createServer()
http.createServer((request, response) => {
    let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

    fs.appendFile
    ('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date () + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err,data) => {
        if (err) {
            throw err;
        }

          response.writeHead(200, {'Content-Type': 'text/html'})
          response.write(data);
          response.end();
    });

  

    //listens for a response on port 8080
}).listen(8080);

console.log('My first Node test server is running on port 8080');

