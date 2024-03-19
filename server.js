const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res){
    if (req.method=='GET'){
        if(req.url.includes('/signup') || req.url.includes('/signin')){
            console.log(req.method);
            res.write(fs.readFileSync('./html/signup_signin.html', 'utf-8'));
            res.end();
        }
    }
    else{
        if(req.method=="POST"){
            //res.setHeader('Content-Type', 'application/json');
            if(req.url.includes('/api/signup')){
                let body = '';
                req.on('data', function(data){
                    body += data;
                })
                req.on('end', function(){
                    let exists = fs.existsSync('./credentials.csv');
                    if (exists){
                        let [email, password] = body.split('&');
                        email = email.split('=')[1];
                        email = decodeEmail(email);
                        console.log(email);
                        password = password.split('=')[1];
                        fs.readFile('./credentials.csv','utf8',function(error,content){
                            users = content.split('\n');
                            for(let i=0; i<users.length;i++){
                                user = users[i].split(';')[0];
                                if (user === email){
                                    res.write('<h1>User with this email already exists!</h1>');
                                    res.end();
                                    return;
                                }
                            }
                        fs.appendFileSync('./credentials.csv',`${email};${password};\n`, 'utf-8');
                        res.write("<h1>User Successfuly Created!</h1>");
                        //res.write('<a href=\"localhost:5500/signin\">go to signin page</a>'); //come back to this - figure out why this wont work
                        res.end();
                        });
                    }
                });
            }
            if(req.url.includes('/api/signin')){
                let body = '';
                req.on('data', function(data){
                    body += data;
                });
                req.on('end', function(){
                    let exists = fs.existsSync('./credentials.csv');
                    if (exists){
                        let [email, password] = body.split('&');
                        email = email.split('=')[1];
                        email = decodeEmail(email);
                        password = password.split('=')[1];
                        fs.readFile('./credentials.csv','utf8',function(error,content){
                            users = content.split('\n');
                            for(let i=0; i<users.length;i++){
                                const [thisemail, thispassword] = users[i].split(';');
                                if (thisemail===email && thispassword===password){
                                    res.write('<h1>Logged in!</h1>');
                                    res.end();
                                    return;
                                }
                            }
                            res.write("<h1>Wrong credentials, try again</h1>");
                            res.end();
                        })
                    }
                });
            }
        }
        else{
            res.write( {"status":-1,"error":"unauthorized request"});
        }
    }
});

function decodeEmail(email) {
    return email.replace(/%40/g, '@');
}

server.listen(5500);