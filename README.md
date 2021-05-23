
<p align="center">
  <img src="assets/Space_Station_13_logo_(space_bg).png" />
  <h2 align="center">
    <a href="https://github.com/frosty-dev/white-dream-main/">White Dream Project</a> 🤖 Server Control Unit
  </h2>

  <p align="center">Helps commicating with the server (that's runs on <a href="http://byond.com/">BYOND</a> <a href=" https://github.com/topics/byond?l=dm">DM Lang</a>) and <a href="https://discord.com/">Discord</a> bot.
  </p>
</p>

<p align="center">
  <a href="">
    <img src="assets/uses-badges.svg"/>
  </a>
  <a href="">
    <img src="assets/open-source.svg"/>
  </a>

  <br>

  <a href="https://forthebadge.com">
    <img src="https://forthebadge.com/images/badges/made-with-javascript.svg"/>
  </a>
  <a href="https://forthebadge.com">
    <img src="https://forthebadge.com/images/badges/made-with-markdown.svg"/>
  </a>

  <br>

  <a href="https://code.visualstudio.com/">
    <img src="assets/Made_in-VS_Code-1f425f.svg "/>
  </a>
  <a href="">
    <img src="https://badgen.net/github/checks/Gesugao-san/wdbot/master/ubuntu"/>
  </a>
  <a href="">
    <img src="https://badgen.net/github/checks/Gesugao-san/wdbot/master/windows"/>
  </a>
  <a href="">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/Gesugao-san/wdbot"/>
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="assets/License-MIT-yellow.svg"/>
  </a>

  <br>

  <a href="">
    <img src="https://status.david-dm.org/gh/Gesugao-san/wdbot.svg"/>
  <a href="">
    <img src="https://status.david-dm.org/gh/Gesugao-san/wdbot.svg?type=dev"/>
  </a>
  <a href="https://crowdin.com/project/wdbot">
    <img src="https://badges.crowdin.net/wdbot/localized.svg"/>
  </a>
  <a href="https://github.com/Gesugao-san/wdbot/issues?q=is%3Apr+is%3Aclosed">
    <img src="https://img.shields.io/github/last-commit/Gesugao-san/wdbot"/>
  </a>

  <br>

  <a href="https://GitHub.com/Gesugao-san/wdbot/network/">
    <img src="https://img.shields.io/github/forks/Gesugao-san/wdbot.svg?style=social&label=Fork&maxAge=2592000"/>
  </a>
  <a href="https://GitHub.com/Gesugao-san/wdbot/stargazers/">
    <img src="https://img.shields.io/github/stars/Gesugao-san/wdbot.svg?style=social&label=Star&maxAge=2592000"/>
  </a>
  <a href="https://funclub.pro/">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https://funclub.pro/"/>
  </a>
  <a href="https://discord.com/invite/bNrAW37">
    <img src="https://img.shields.io/discord/433622753350778890.svg?color=7289da&label=FUNCLUB&logo=discord&style=flat-square"/>
  </a>
</p>

---

<details>
<summary><strong><big>Table of Contents</big></strong></summary>

** [How to use this](#how-to-use-this)
*** [Linux](#linux)
*** [Windows](#windows)
** [License](#license)

</details>

---

## About

This bot greatly simplifies the hosting of game servers. It is not necessary, but without it, the life of the host will be clearly more difficult.

Runs on [Node.js®](https://nodejs.org/) and using [Discord](https://discord.com/).

## How to use this

### Linux

0. Check if the [BYOND](http://byond.com/) platform is installed. [If not, then find out the latest version here](https://secure.byond.com/download/).
    At the time of writing, the current Stable version is 513.1542, but you can check it here:
    <table>
    <tr align="center">
      <td>
        <small>White Theme</small><br>
        <object data="http://www.byond.com/download/version.txt" type="text/plain" width="90px" height="60px" style="background-color: white">
        <a href="http://www.byond.com/download/version.txt" style="color: black">I cann't open latest version file for you, sorry</a>
        </object>
      </td>
      <td>
        <small>Gray Theme</small><br>
        <iframe src="http://www.byond.com/download/version.txt" frameborder="1" width="90px" height="60px" style="background-color: gray"></iframe>
      </td>
      <td>
        First line - Stable version<br>
        Second line - Beta version<br>
      </td>
    </tr>
    </table>
    Or manually <a href="http://www.byond.com/download/version.txt">here</a>.

Download and unzip the installation package:

```bash
wget http://www.byond.com/download/build/513/513.1542_byond_linux.zip
unzip 513.1542_byond_linux.zip
rm 513.1542_byond_linux.zip
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

In case that the help information is displayed, it means that the BYOND is installed and you can proceed.

1. Copy [`index.js`](/index.js) and [`s1.json`](servers/s1.json) files into some dir, it doesn't matters what dir.
2. Install all dependencies by issuing this `npm i discord.js shelljs chokidar log-timestamp is-root`.
3. Edit[`index.js`](/index.js) and [`s1.json`](servers/s1.json) (you can create multiple servers) as your server(s) need. ~~The main things you need to edit is on top of the file.~~
4. Create dirs for `production` and `repos`. In the `repos` dir clone your server and name his folder like `repo_SERVERNAME`.
5. Replace your `deploy.sh` in the server repo with ours.
6. Now run `node index.js` and that is.
7. You forgot to install screen: `sudo apt install screen`

Also use this, if your bot crashes sometimes: https://www.npmjs.com/package/forever
Then need to compile all libs and place in the server prod dir.

## Windows
To do or delete.

# License

MIT.

---

<p align="center">
  <iframe src="https://free.timeanddate.com/clock/i7th8w1f/n179/fc666/tct/pct/ftb/bo2/pd2/tt0/td2/th2/ta1/tb1" frameborder="0" width="350" height="19" allowtransparency="true">Current Time (New York)</iframe>

  <br>

  <a href="https://2ip.ua/ru/" title="Check your IP address">
    <img src="https://2ip.ua/service/ipimg/ip/small1.png">
  </a>
  <!--
  <img src="https://userbarkin.ru/proba/7.png">
  <img src="https://2ip.io/bar/ip3.gif"/>
  -->
</p>
