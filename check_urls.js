const https = require('https');

const codes = ['NS60', 'ns60', '42', 'NS40', 'ns40', '27', 'N70', 'n70'];
const baseUrl = 'https://bateriasecuador.com/wp-content/uploads/2023/09/';

function checkUrl(code) {
    const url = `${baseUrl}${code}-01-700x700.webp`;
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            console.log(`${code}: ${res.statusCode}`);
            resolve();
        });
        req.on('error', (e) => {
            console.log(`${code}: Error ${e.message}`);
            resolve();
        });
        req.end();
    });
}

async function run() {
    for (const code of codes) {
        await checkUrl(code);
    }
}

run();
