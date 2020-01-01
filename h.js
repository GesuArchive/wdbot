
//------------------------------------------------------//
// White Dream bot used for BYOND serverfuck.
// Author: Valtos
// Use wisely and report bugs if you find any.
// Fuck.
//------------------------------------------------------//

const Discord 		= require('discord.js');
const shell 		= require('shelljs');
const fs 			= require('fs');
const chokidar 		= require('chokidar');
					  require('log-timestamp');

const TOKEN 		= ''; 				   // bot token
const prefix 		= '/';				   // bot prefix
const MAIN_CHANNEL 	= '654799849333719080';// channel id for bot, where you type cmds
const HOST			= '184761278634524673';//host user ID

const client 		= new Discord.Client();
const channel 		= client.channels.get(MAIN_CHANNEL);

const demos 		= '/home/ubuntu/production/server_white/data/logs/demos/'; // demos dir if exist, otherwise use ""
const REPOS_DIR		= '/home/ubuntu/repos/'; // repos dir
const PROD_DIR		= '/home/ubuntu/production/'; // production dir

const S1 			= JSON.parse(fs.readFileSync('./s1.json', 'utf8'));
const S2 			= JSON.parse(fs.readFileSync('./s2.json', 'utf8'));

client.on('ready', () => {
	client.user.setActivity("with servers"); 
});

setInterval(checkOnline, 5000); // refreshes data about servers every 5 seconds

// we use screens for DD and DM

async function checkOnline(server) {
	var s1_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + S1.name + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s1_compilestatus = shell.exec('[ "$(screen -ls | grep ' + S1.name + 'compile)" ] && echo ONLINE || echo OFFLINE', { silent: true });

	var s2_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + S2.name + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s2_compilestatus = shell.exec('[ "$(screen -ls | grep ' + S2.name + 'compile)" ] && echo ONLINE || echo OFFLINE', { silent: true });

	if (s1_compilestatus == "ONLINE\n") {
		s1_onlinestatus = "COMPILING";
	};

	if (s2_compilestatus == "ONLINE\n") {
		s2_onlinestatus = "COMPILING";
	};

	client.channels.get(MAIN_CHANNEL).setTopic(`SERVER_1: ${s1_onlinestatus} | SERVER_2: ${s2_onlinestatus}`);
};

chokidar.watch(demos, {ignoreInitial: true, interval: 15000}).on('addDir', (event, path) => { // every 15 seconds
	if(demos === "") return;
	client.channels.get("594650207950471168").send(`Round №${event.slice(-4)} ended. Replay: https://hub.station13.ru/replay/?roundid=${event.slice(-4)}`); // here is the channel where links to replays posted
});

client.on('message', message => {
	if (message.author.bot) return;
	console.log(`[${message.author.username}] [${message.channel.name}]: ${message.content}`);
	if (message.channel != client.channels.get(MAIN_CHANNEL)) return;
	if (!message.content.startsWith(prefix)) return;

	if (message.content.startsWith(prefix + "shelp")) {
		print_help();
		return;
	};

	if (message.content.startsWith(prefix + "luser") && message.author.id == HOST) {
		var msg = message.content.slice(prefix.length).split(' ');
		switch(msg[1]) {
			case S1.name:
				client.channels.get(MAIN_CHANNEL).send(`${S1.admins}`);
				break;
			case S2.name:
				client.channels.get(MAIN_CHANNEL).send(`${S2.admins}`);
				break;
			default:
				client.channels.get(MAIN_CHANNEL).send(`Run ${prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(prefix + "adduser") && message.author.id == HOST) {
		var msg = message.content.slice(prefix.length).split(' ');
		switch(msg[1]) {
			case S1.name:
				var uid = S1.admins.indexOf(msg[2]);
				if (uid == -1) {
					S1.admins.push(msg[2])
					fs.writeFileSync('./s1.json', JSON.stringify(S1, null, 4));
					client.channels.get(MAIN_CHANNEL).send(`Added <@${msg[2]}> to ${msg[1]}.`);
				} else {
					client.channels.get(MAIN_CHANNEL).send(`User <@${msg[2]}> already in ${msg[1]}.`);
				}
				break;
			case S2.name:
				var uid = S2.admins.indexOf(msg[2]);
				if (uid == -1) {
					S2.admins.push(msg[2])
					fs.writeFileSync('./s2.json', JSON.stringify(S2, null, 4));
					client.channels.get(MAIN_CHANNEL).send(`Added <@${msg[2]}> to ${msg[1]}.`);
				} else {
					client.channels.get(MAIN_CHANNEL).send(`User <@${msg[2]}> already in ${msg[1]}.`);
				}
				break;
			default:
				client.channels.get(MAIN_CHANNEL).send(`Run ${prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(prefix + "remuser") && message.author.id == HOST) {
		var msg = message.content.slice(prefix.length).split(' ');
		switch(msg[1]) {
			case S1.name:
				var uid = S1.admins.indexOf(msg[2]);
				if (uid != -1) {
					S1.admins.splice(S1.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s1.json', JSON.stringify(S1, null, 4));
					client.channels.get(MAIN_CHANNEL).send(`Removed <@${msg[2]}> from ${msg[1]}.`);
				} else {
					client.channels.get(MAIN_CHANNEL).send(`No such ID <@${msg[2]}> in ${msg[1]}.`);
				};
				break;
			case S2.name:
				var uid = S2.admins.indexOf(msg[2]);
				if (uid != -1) {
					S22.admins.splice(S2.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s2.json', JSON.stringify(S2, null, 4));
					client.channels.get(MAIN_CHANNEL).send(`Removed <@${msg[2]}> from ${msg[1]}.`);
				} else {
					client.channels.get(MAIN_CHANNEL).send(`No such ID <@${msg[2]}> in ${msg[1]}.`);
				}
				break;
			default:
				client.channels.get(MAIN_CHANNEL).send(`Run ${prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(prefix + S1.name)) {
		cmd_to = message.content.slice(prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, S1.name);
	};

	if (message.content.startsWith(prefix + S2.name)) {
		cmd_to = message.content.slice(prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, S2.name);
	};

});

async function issue_command(uid, cmd, server) {
	var sname;
	var admins;
	var devs;
	var port;
	switch(server) {
		case S1.name:
			sname  = S1.name;
			admins = S1.admins;
			devs   = S1.devs;
			port   = S1.port;
			break;
		case S2.name:
			sname  = S2.name;
			admins = S2.admins;
			devs   = S2.devs;
			port   = S2.port;
			break;
		default:
			client.channels.get(MAIN_CHANNEL).send(`Run ${prefix}shelp`);
			return;
	};
	if (admins.includes(uid)) {
		if (devs.includes(uid)) {
			switch (cmd) {
				case "deploy":
					shell.exec('sh ' + REPOS_DIR + 'repo_' + sname + '/tools/deploy.sh ' + PROD_DIR + 'server_' + sname, { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${sname}: Deployed.`);
					break;
				case "compile":
					shell.exec('cd ' + REPOS_DIR + 'repo_' + sname + '/ && : > ../' + sname + '_compile.log && screen -dmS ' + sname + 'compile -L -Logfile ../' + sname + '_compile.log DreamMaker tgstation.dme', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${sname}: Compiling.`);
					break;
				case "uc":
					shell.exec('cd ' + REPOS_DIR + 'repo_' + sname + '/ && : > ../' + sname + '_update.log && : > ../' + sname + '_compile.log && git pull > ../' + sname + '_update.log && screen -dmS ' + sname + 'compile -L -Logfile ../' + sname + '_compile.log DreamMaker tgstation.dme', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${sname}: Started Auto-update-compile.`);
					break;
				case "update":
					shell.exec('cd ' + REPOS_DIR + 'repo_' + sname + '/ && : > ../' + sname + '_update.log && git pull > ../' + sname + '_update.log &', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${sname}: Updated.`);
					break;
				case "clog":
					var log = shell.exec('cat ' + REPOS_DIR + sname + '_compile.log', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`\`\`\`${log}\`\`\``);
					break;
				case "ulog":
					var log = shell.exec('cat ' + REPOS_DIR + sname + '_update.log', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${log}`, { split: true });
					break;
				case "dlog":
					var log = shell.exec('cat ' + PROD_DIR + sname + '_dd.log', { silent: true });
					client.channels.get(MAIN_CHANNEL).send(`${log}`, { split: true });
					break;
				case "ddlog":
					if (fs.existsSync(PROD_DIR + sname + '_dd.log')) {
						client.channels.get(MAIN_CHANNEL).send({ files: [PROD_DIR + sname + '_dd.log'] });
					} else {
						client.channels.get(MAIN_CHANNEL).send(`No file, <@${mts.author.id}>`);
					};
					break;
			};
		};
		switch (cmd) {
			case "start":
				if (shell.exec('[ "$(screen -ls | grep ' + sname + 'server)"  ] && echo 1 || echo 0', { silent: true }) == "1\n") {
					client.channels.get(MAIN_CHANNEL).send(`${sname}: Not dead yet.`);
				};
				shell.exec('export LD_LIBRARY_PATH=' + PROD_DIR + 'server_' + sname + ' && cd ' + PROD_DIR + 'server_' + sname + '/ && : > ../' + sname + '_dd.log && screen -dmS ' + sname + 'server -L -Logfile ../' + sname + '_dd.log DreamDaemon tgstation.dmb -port ' + port + ' -trusted -public -threads on -params config-directory=cfg', { silent: true });
				client.channels.get(MAIN_CHANNEL).send(`${sname}: Starting.`);
				break;
			case "stop":
				shell.exec('screen -X -S ' + sname + 'server quit', { silent: true });
				client.channels.get(MAIN_CHANNEL).send(`${sname}: Killed.`);
				break;
		};
	};
};

async function print_help() {
	var h = "Help contents:\n";
	h += `> Host\n`;
	h += `\`${prefix}adduser SERVER UID\` - adds user to server\n`;
	h += `\`${prefix}remuser SERVER UID\` - removes user from server\n`;
	h += `\`${prefix}luser SERVER\` - list of users in server\n`;
	h += `> Dev\n`;
	h += `\`${prefix}shelp\` - displays this information\n`;
	h += `\`${prefix}SERVER compile\` - runs compilation in the repo dir\n`;
	h += `\`${prefix}SERVER deploy\` - moves compiled files and things defined in deploy.sh\n`;
	h += `\`${prefix}SERVER update\` - updates local repo from master\n`;
	h += `\`${prefix}SERVER clog\` - displays compile log\n`;
	h += `\`${prefix}SERVER ulog\` - displays update log\n`;
	h += `\`${prefix}SERVER dlog\` - displays DreamDaemon log\n`;
	h += `\`${prefix}SERVER ddlog\` - retrieve dd.log file from the server\n`;
	h += `> User\n`;
	h += `\`${prefix}SERVER start|stop\` - start/stop server\n`;
	client.channels.get(MAIN_CHANNEL).send(h);
}

client.login(TOKEN);
