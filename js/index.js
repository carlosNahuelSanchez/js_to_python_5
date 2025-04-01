const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Petición: ${req.url}`);

    if (req.method === 'POST' && req.url === '/multiplicar') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { matriz1, matriz2 } = JSON.parse(body);

            const filas1 = matriz1.length;
            const columnas1 = matriz1[0].length;
            const filas2 = matriz2.length;
            const columnas2 = matriz2[0].length;

            if (columnas1 !== filas2) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'El número de columnas de la primera matriz debe ser igual al número de filas de la segunda matriz.' }));
            }

            const matrizResultado = Array(filas1).fill().map(() => Array(columnas2).fill(0));

            for (let i = 0; i < filas1; i++) {
                for (let j = 0; j < columnas2; j++) {
                    for (let k = 0; k < columnas1; k++) {
                        matrizResultado[i][j] += matriz1[i][k] * matriz2[k][j];
                    }
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ matrizResultado }));
        });

    } else {
        let filePath = req.url === '/' ? 'public/index.html' : `public${req.url}`;
        filePath = path.join(__dirname, filePath);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
});

const PORT = 4500;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
