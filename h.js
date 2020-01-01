
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

const client 		= new Discord.Client();
const channel 		= client.channels.get(MAIN_CHANNEL);

const demos 		= '/somehome/somedir/'; // demos dir if exist, otherwise use ""
const REPOS_DIR		= '/home/tgstation/repos/'; // repos dir
const PROD_DIR		= '/home/tgstation/production/'; // production dir

const S1_ADMINS  	= ["184761278634524673"]; // ids of those, who can stop/start the server
const S1_DEVS    	= ["184761278634524673"]; // all other rights

const S2_ADMINS  	= ["184761278634524673"];
const S2_DEVS    	= ["184761278634524673"];

const S1_NAME		= 'white';
const S1_PORT		= '2019';

const S2_NAME		= 'theta';
const S2_PORT		= '2077';

client.on('ready', () => {
	client.user.setActivity("with servers"); 
});

setInterval(checkOnline, 5000); // refreshes data about servers every 5 seconds

// we use screens for DD and DM

async function checkOnline(server) {
	var s1_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + S1_NAME + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s1_compilestatus = shell.exec('[ "$(screen -ls | grep ' + S1_NAME + 'compile)" ] && echo ONLINE || echo OFFLINE', { silent: true });

	var s2_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + S2_NAME + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s2_compilestatus = shell.exec('[ "$(screen -ls | grep ' + S2_NAME + 'compile)" ] && echo ONLINE || echo OFFLINE', { silent: true });

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

	if (message.content.startsWith(prefix + S1_NAME)) {
		cmd_to = message.content.slice(prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, S1_NAME);
	};

	if (message.content.startsWith(prefix + S2_NAME)) {
		cmd_to = message.content.slice(prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, S2_NAME);
	};

});

async function issue_command(uid, cmd, server) {
	var sname;
	var admins;
	var devs;
	switch(server) {
		case S1_NAME:
			sname  = S1_NAME;
			admins = S1_ADMINS;
			devs   = S1_DEVS;
			break;
		case S2_NAME:
			sname  = S2_NAME;
			admins = S2_ADMINS;
			devs   = S2_DEVS;
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
				shell.exec('export LD_LIBRARY_PATH=' + PROD_DIR + 'server_' + sname + ' && cd ' + PROD_DIR + 'server_' + sname + '/ && : > ../' + sname + '_dd.log && screen -dmS ' + sname + 'server -L -Logfile ../' + sname + '_dd.log DreamDaemon tgstation.dmb -port ' + S1_PORT + ' -trusted -public -threads on -params config-directory=cfg', { silent: true });
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
	h += `\`${prefix}shelp\` - displays this information\n`;
	h += `\`${prefix}SERVER compile\` - runs compilation in the repo dir\n`;
	h += `\`${prefix}SERVER deploy\` - moves compiled files and things defined in deploy.sh\n`;
	h += `\`${prefix}SERVER update\` - updates local repo from master\n`;
	h += `\`${prefix}SERVER clog\` - displays compile log\n`;
	h += `\`${prefix}SERVER ulog\` - displays update log\n`;
	h += `\`${prefix}SERVER dlog\` - displays DreamDaemon log\n`;
	h += `\`${prefix}SERVER ddlog\` - retrieve dd.log file from the server\n`;
	h += `\`${prefix}SERVER start|stop\` - start/stop server\n`;
	client.channels.get(MAIN_CHANNEL).send(h);
}

client.login(TOKEN);
