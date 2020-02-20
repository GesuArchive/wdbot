# Space Station 13 servers control bot

This bot greatly simplifies the hosting of game servers. It is not necessary, but without it, the life of the host will be clearly more difficult.
Runs on Linux, using Node.js® as engine and using Discord as input.

## How to use this
0. Byond installed? Install it.
2. Copy `h.js` and `s1.json` files into some dir, it doesn't matters what dir.
1. Install all dependencies by issuing this `npm i discord.js shelljs chokidar log-timestamp`.
3. Edit `h.js` and `s1.json`(you can create multiple servers) as your server(s) need. The main things you need to edit is on top of the file.
9. Create dirs for `production` and `repos`. In the `repos` dir clone your server and name his folder like `repo_SERVERNAME`.
6. Replace your `deploy.sh` in the server repo with ours.
7. Now run `node h.js` and that is.
4. You fool, you forgot to install screen. Do it by `sudo apt install screen`.
666. Also use this, if your bot crashes sometimes: https://www.npmjs.com/package/forever

## And yes, you need to compile all libs and place in the server prod dir
Do it, lazy man.
