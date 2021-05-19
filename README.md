
[![Space Station 13 logo](https://upload.wikimedia.org/wikipedia/commons/7/7a/Spacestation13_logo.png)](http://www.byond.com/games/Exadv1/SpaceStation13)

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-markdown.svg)](https://forthebadge.com)
[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![Crowdin](https://badges.crowdin.net/wdbot/localized.svg)](https://crowdin.com/project/wdbot) ![GitHub last commit](https://img.shields.io/github/last-commit/Gesugao-san/wdbot) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub forks](https://img.shields.io/github/forks/Gesugao-san/wdbot.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/Gesugao-san/wdbot/network/) [![GitHub stars](https://img.shields.io/github/stars/Gesugao-san/wdbot.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/Gesugao-san/wdbot/stargazers/)

# Space Station 13 servers control bot

This bot greatly simplifies the hosting of game servers. It is not necessary, but without it, the life of the host will be clearly more difficult.
Runs on Linux, using Node.js® as engine and using Discord as input.

## How to use this
1. Install the BYOND if it is not installed:

Find out the latest version: https://www.byond.com/download/

* At the time of writing, the current version is 512.1488

Download the installation package:

```bash
wget http://www.byond.com/download/build/512/512.1471_byond_linux.zip
unzip 512.1471_byond_linux.zip
rm 512.1471_byond_linux.zip
cd byond/
```

Install it:

```bash
sudo make install
```

And test it:

```bash
DreamDaemon
```

The help information is displayed - the BYOND is installed.

2. Copy `h.js` and `s1.json` files into some dir, it doesn't matters what dir.
3. Install all dependencies by issuing this `npm i discord.js shelljs chokidar log-timestamp is-root`.
4. Edit `h.js` and `s1.json`(you can create multiple servers) as your server(s) need. The main things you need to edit is on top of the file.
5. Create dirs for `production` and `repos`. In the `repos` dir clone your server and name his folder like `repo_SERVERNAME`.
6. Replace your `deploy.sh` in the server repo with ours.
7. Now run `node h.js` and that is.
8.  forgot to install . Do it by `sudo apt install screen`. Install the ёё if it is not installed:

Also use this, if your bot crashes sometimes: https://www.npmjs.com/package/forever

## And yes, you need to compile all libs and place in the server prod dir
Do it, lazy man.
