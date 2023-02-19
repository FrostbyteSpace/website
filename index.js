// Load the dotenv file \\
require('dotenv').config();

// Now load required modules \\
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const DiscordOauth2 = require('discord-oauth2');

// Load the discord oauth2 module \\
const oauth = new DiscordOauth2({
    clientId: process.env.STABLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

// We are using Fastify to start listening \\
const fastify = require('fastify')({
    logger: false
});

// Register the Fastify cookie module \\
fastify.register(require('@fastify/cookie'), {
    "secret": process.env.COOKIE_SECRET
});

fastify.get('/', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'index.html'));
    res.type('text/html').send(stream);
});

fastify.get('/status', (req, res) => {
    let stream = fs.createReadStream(path.join(__dirname, 'web', 'status.html'));
    res.type('text/html').send(stream);
});

fastify.get('/dashboard', (req, res) => {
    // Check if the user is logged in \\
    if (req.cookies.token) {
        // Unsign the cookie \\
        var token = req.unsignCookie(req.cookies.token).value;
        oauth.getUser(token).then(async (user) => {
            let guilds = (await oauth.getUserGuilds(token)).filter(guild => guild.permissions & 32);
            // Sort the guilds by name \\
            guilds.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            // If the token is valid, then render the dashboard \\
            // The dashboard is rendered using EJS.. despite the file being .html \\
            ejs.renderFile(path.join(__dirname, 'web', 'dashboard.html'), {
                user: user,
                guilds: guilds,
                guildCount: guilds.length
            }, (err, str) => {
                if (err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    res.type('text/html').send(str);
                }
            });
        }).catch(err => {
            // If the token is invalid, then redirect to the login page \\
            console.log(err);
            res.redirect('/');
        });
    } else {
        // If the user is not logged in, then redirect to the login page \\
        res.redirect('/oauth/dashboard');
    }
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

    // OAuth \\
    fastify.get("/oauth/dashboard", (req, res) => {
        res.redirect(oauth.generateAuthUrl({
            scope: 'identify guilds',
            prompt: 'none'
        }));
    });

    fastify.get('/oauth/callback', (req, res) => {
        oauth.tokenRequest({
            code: req.query.code,
            scope: 'identify guilds',
            grantType: 'authorization_code'
        }).then((data) => {
            oauth.getUser(data.access_token).then((user) => {
                res.setCookie('token', data.access_token, {
                    path: '/',
                    maxAge: 604800000,
                    signed: true
                });
                res.setCookie('cookieNoteClosed', 'true', {
                    path: '/',
                    maxAge: 604800000,
                    signed: true
                });
                // If the refreshToken is not null, then set the cookie \\
                if (data.refresh_token) {
                    res.setCookie('refreshToken', data.refresh_token, {
                        path: '/',
                        maxAge: 604800000,
                        signed: true
                    });
                }
                res.redirect('/dashboard');
            });
        });
    });

    fastify.get('/oauth/logout', (req, res) => {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.redirect('/');
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