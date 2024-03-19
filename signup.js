const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Enter your email address: ', (email) => {
    rl.question('Enter your password: ', (password) => {

        const user = {
            email,
            password
        };

        fs.appendFileSync('credentials.csv', `${user.email};${user.password};\n`);
        console.log('User successfully signed up.');
        rl.close();
    });
});
