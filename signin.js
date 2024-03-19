const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter email address: ', (email) => {
    rl.question('Enter password: ', (password) => {
        fs.readFile('./credentials.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading credentials data file:', err);
                rl.close();
                return;
            }
            const rows = data.split('\n').map(row => row.split(';'));
            const match = rows.find(row => row[0] === email && row[1] === password);
            if (match) {
                console.log('Successful login.');
            } else {
                console.log('That email or password is not correct. Please try again.');
            }
            rl.close();
        });
    });
});
