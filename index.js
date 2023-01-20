// Load the dotenv file \\
require('dotenv').config();

// Now load required modules \\
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// We are using Fastify to start listening \\
const fastify = require('fastify')({
    logger: false
});

fastify.get('/', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'index.html'));
    res.type('text/html').send(stream);
});

fastify.get('/dashboard', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'wip.html')); // I have no idea when this will be done \\
    res.type('text/html').send(stream);
});

fastify.get('/tos', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'tos.html'));
    res.type('text/html').send(stream);
});

fastify.get('/privacy', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'privacy.html'));
    res.type('text/html').send(stream);
});

// URLs \\

    // Invite URLs \\
    fastify.get('/invite/stable', (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.STABLE_CLIENT_ID}&permissions=2105536231&scope=bot`);
    });

    fastify.get('/invite/canary', (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CANARY_CLIENT_ID}&permissions=2105536231&scope=bot`);
    });

    fastify.get("/invite/alpha", (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.ALPHA_CLIENT_ID}&permissions=2105536231&scope=bot`);
    });

    fastify.get("/invite/legacy", (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.LEGACY_CLIENT_ID}&permissions=2105536231&scope=bot`);
    });

    // Support URLs \\
    fastify.get('/support', (req, res) => {
        res.redirect(`https://discord.gg/${process.env.SUPPORT_INVITE} `);
    });

    // Github \\
    fastify.get('/github', (req, res) => {
        res.redirect('https://github.com/FrostbyteSpace');
    });

// Assets \\
fastify.get('/assets/:file', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'static', req.params.file));
    res.send(stream);
});

// CDN \\
fastify.post('/cdn/', (req, res) => {
    // Authenticate with a key from .env \\
    if (req.query.key !== process.env.CDN_KEY) {
        res.code(401).send({error: "Invalid CDN key"});
    } else {
        // Write the file \\
        fs.writeFile(path.join(__dirname, 'cdn', req.headers.file), req.body, (err) => {
            if (err) {
                res.code(500).send({error: "Failed to write file"});
            } else {
                res.code(200).send({success: "File written successfully"});
            }
        });
    }
});

fastify.get('/cdn/:file', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'cdn', req.params.file));
    res.send(stream);
});

// Listen on the port provided in the dot env file \\
fastify.listen({port: process.env.PORT, host: "0.0.0.0"}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
})