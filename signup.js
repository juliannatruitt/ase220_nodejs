const http = require('http');
const fs = require('fs');
// const readline = require('readline');

const server = http.createServer(function(req, res) {
    if (req.method == 'GET') {
        if (req.url.includes('/signup_signin')) {
            res.write(fs.readFileSync('./html/signup_signin.html', 'utf-8'));
            res.end();
        // Tried debug
        // const filePath = path.join(__dirname, 'html', 'signup_signin.html');
        //     fs.readFile(filePath, 'utf8', function(err, data) {
        //         if (err) {
        //             console.error('Error reading file:', err);
        //             res.writeHead(500);
        //             res.write('Internal Server Error');
        //             res.end();
        //         } else {
        //             res.writeHead(200, {'Content-Type': 'text/html'});
        //             res.write(data);
        //             res.end();
        //         }
        //     });
        // }
    } else {
        if (req.method == "POST") {
            if (req.url.includes('/api/signup')) {
                let body = '';
                req.on('data', function(data) {
                    body += data;
                })
                req.on('end', function() {
                    let exists = fs.existsSync('./credentials.csv');
                    if (exists) {
                        let [username, password] = body.split('&');
                        username = decodeURIComponent(username.split('=')[1]);
                        password = decodeURIComponent(password.split('=')[1]); 
                        // Validate username and password here if needed
                        fs.readFile('./credentials.csv', 'utf8', function(error, content) {
                            let users = content.split('\n');
                            for (let i = 0; i < users.length; i++) {
                                let [savedUsername, savedPassword] = users[i].split(';');
                                if (savedUsername === username) {
                                    res.write('<h1>User with this username already exists!</h1>');
                                    res.end();
                                    return;
                                }
                            }
                            fs.appendFileSync('./credentials.csv', `${username};${password}\n`);
                            res.write("<h1>User Successfully Created!</h1>");
                            res.end();
                        });
                    }
                });
            }
        }
    }
});

server.listen(5500);
