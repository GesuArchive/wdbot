
//------------------------------------------------------//
// White Dream bot used for BYOND serverfuck.
// Author: Valtos
// Use wisely and report bugs if you find any.
// Fuck.
//------------------------------------------------------//

const Discord		= require('discord.js');
const shell			= require('shelljs');
const fs				= require('fs');
const chokidar	= require('chokidar');
									require('log-timestamp');

const cfg	= JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log("Configs loaded, help command: " + cfg.general.cmd_prefix + cfg.commands.general.help);

if ((cfg.general.OUTPUT_LANGUAGE == "ENG") || (typeof(cfg.general.OUTPUT_LANGUAGE) != "string"))  {
	console.log("Selected language: en");
	const lang	= require('./localization/lang.en');
	//const lang	= JSON.parse(fs.readFileSync('localization/lang.en', 'utf8')).lang_rus
} else {
	console.log("Selected language: ru");
	const lang	= require('./localization/lang.ru');
	//const lang	= JSON.parse(fs.readFileSync('localization/lang.ru', 'utf8')).lang_eng
};

const Server1	= JSON.parse(fs.readFileSync('./s1.json', 'utf8'));
const Server2	= JSON.parse(fs.readFileSync('./s2.json', 'utf8'));

const client			= new Discord.Client();
const cmd_channel	= client.channels.get(cfg.channels_id.COMMAND_LINE);

console.log(typeof(cfg.channels_id.COMMAND_LINE)); // && " ; " && lang.greeting);

client.on('ready', () => {
	client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.greeting);
	client.user.setActivity("with servers");
});

setInterval(checkOnline, 5000); // refreshes data about servers every 5 seconds

// we use screens for DD and DM

async function checkOnline(server) {
	var s1_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + Server1.name + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s1_compilestatus = shell.exec('[ "$(screen -ls | grep ' + Server1.name + 'compile)" ] && echo COMPILATION_IN_PROCESS || echo NOT_COMPILING', { silent: true });

	var s2_onlinestatus  = shell.exec('[ "$(screen -ls | grep ' + Server2.name + 'server)"  ] && echo ONLINE || echo OFFLINE', { silent: true });
	var s2_compilestatus = shell.exec('[ "$(screen -ls | grep ' + Server2.name + 'compile)" ] && echo COMPILATION_IN_PROCESS || echo NOT_COMPILING', { silent: true });

	if (s1_compilestatus == "COMPILATION_IN_PROCESS\n") {
		s1_onlinestatus = "COMPILING";
	};

	if (s2_compilestatus == "COMPILATION_IN_PROCESS\n") {
		s2_onlinestatus = "COMPILING";
	};

	client.channels.get(cfg.channels_id.COMMAND_LINE).setTopic(`SERVER №1: ${s1_onlinestatus} | SERVER №2: ${s2_onlinestatus}`);
};

chokidar.watch(cfg.directories.DEMOS, {ignoreInitial: true, interval: 15000}).on('addDir', (event, path) => { // every 15 seconds
	if(DEMOS_DIR === "") return;
	client.channels.get(ENDROUND_CHANNEL).send(`Round №${event.slice(-4)} ended. Replay: https://hub.station13.ru/replay/?roundid=${event.slice(-4)}`); // here is the channel where links to replays posted
});

client.on('message', message => {
	if (message.author.bot) return;
	console.log(`[${message.author.username}] [${message.channel.name}]: ${message.content}`);
	if (message.channel != client.channels.get(cfg.channels_id.COMMAND_LINE)) return;
	if (!message.content.startsWith(cfg.general.cmd_prefix)) return;

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.help)) {
		console.log("Get command \"help\".");
		print_help();
		return;
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.whoisadmin) && message.author.id == HOST) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${Server1.admins}`);
				break;
			case Server2.name:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${Server2.admins}`);
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Run ${cfg.general.cmd_prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.adduser) && message.author.id == HOST) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				var uid = Server1.admins.indexOf(msg[2]);
				if (uid == -1) {
					Server1.admins.push(msg[2])
					fs.writeFileSync('./s1.json', JSON.stringify(Server1, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Added <@${msg[2]}> to ${msg[1]}.`);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`User <@${msg[2]}> already in ${msg[1]}.`);
				}
				break;
			case Server2.name:
				var uid = Server2.admins.indexOf(msg[2]);
				if (uid == -1) {
					Server2.admins.push(msg[2])
					fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Added <@${msg[2]}> to ${msg[1]}.`);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`User <@${msg[2]}> already in ${msg[1]}.`);
				}
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Run ${cfg.general.cmd_prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.remuser) && message.author.id == HOST) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				var uid = Server1.admins.indexOf(msg[2]);
				if (uid != -1) {
					Server1.admins.splice(Server1.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s1.json', JSON.stringify(Server1, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Removed <@${msg[2]}> from ${msg[1]}.`);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`No such ID <@${msg[2]}> in ${msg[1]}.`);
				};
				break;
			case Server2.name:
				var uid = Server2.admins.indexOf(msg[2]);
				if (uid != -1) {
					S22.admins.splice(Server2.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Removed <@${msg[2]}> from ${msg[1]}.`);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`No such ID <@${msg[2]}> in ${msg[1]}.`);
				}
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Run ${cfg.general.cmd_prefix}shelp`);
				return;
		}
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + Server1.name)) {
		cmd_to = message.content.slice(cfg.general.cmd_prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, Server1.name);
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + Server2.name)) {
		cmd_to = message.content.slice(cfg.general.cmd_prefix.length).split(' ').slice(1).join(" ");
		issue_command(message.author.id, cmd_to, Server2.name);
	};

});

async function issue_command(uid, cmd, server) {
	var sname;
	var admins;
	var devs;
	var port;
	switch(server) {
		case Server1.name:
			sname  = Server1.name;
			admins = Server1.admins;
			devs   = Server1.devs;
			port   = Server1.port;
			break;
		case Server2.name:
			sname  = Server2.name;
			admins = Server2.admins;
			devs   = Server2.devs;
			port   = Server2.port;
			break;
		default:
			client.channels.get(cfg.channels_id.COMMAND_LINE).send(`Run ${cfg.general.cmd_prefix}shelp`);
			return;
	};
	if (admins.includes(uid)) {
		if (devs.includes(uid)) {
			switch (cmd) {
				case cfg.commands.build_control.deploy:
					shell.exec('sh ' + cfg.directories.REPOS + 'repo_' + sname + '/tools/deploy.sh ' + cfg.directories.PROD + 'server_' + sname, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Deployed.`);
					break;
				case cfg.commands.build_control.compile:
					shell.exec('cd ' + cfg.directories.REPOS + 'repo_' + sname + '/ && : > ../' + sname + '_compile.log && screen -dmS ' + sname + 'compile -L -Logfile ../' + sname + '_compile.log DreamMaker tgstation.dme', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Compiling.`);
					break;
				case cfg.commands.build_control.update_compile:
					shell.exec('cd ' + cfg.directories.REPOS + 'repo_' + sname + '/ && : > ../' + sname + '_update.log && : > ../' + sname + '_compile.log && git pull > ../' + sname + '_update.log && screen -dmS ' + sname + 'compile -L -Logfile ../' + sname + '_compile.log DreamMaker tgstation.dme', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Started Auto-update-compile.`);
					break;
				case cfg.commands.build_control.update:
					shell.exec('cd ' + cfg.directories.REPOS + 'repo_' + sname + '/ && : > ../' + sname + '_update.log && git pull > ../' + sname + '_update.log &', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Updated.`);
					break;
				case cfg.commands.build_control.send_compile_log:
					var log = shell.exec('cat ' + cfg.directories.REPOS + sname + '_compile.log', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`\`\`\`${log}\`\`\``);
					break;
				case cfg.commands.build_control.send_update_log:
					var log = shell.exec('cat ' + cfg.directories.REPOS + sname + '_update.log', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
					break;
				case cfg.commands.build_control.dlog:
					var log = shell.exec('cat ' + cfg.directories.PROD + sname + '_dd.log', { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
					break;
				case cfg.commands.build_control.ddlog:
					if (fs.existsSync(cfg.directories.PROD + sname + '_dd.log')) {
						client.channels.get(cfg.channels_id.COMMAND_LINE).send({ files: [cfg.directories.PROD + sname + '_dd.log'] });
					} else {
						client.channels.get(cfg.channels_id.COMMAND_LINE).send(`No file, <@${mts.author.id}>`);
					};
					break;
			};
		};
		switch (cmd) {
			case cfg.commands.work_control.start:
				if (shell.exec('[ "$(screen -ls | grep ' + sname + 'server)"  ] && echo 1 || echo 0', { silent: true }) == "1\n") {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Not dead yet.`);
				};
				shell.exec('export LD_LIBRARY_PATH=' + cfg.directories.PROD + 'server_' + sname + ' && cd ' + cfg.directories.PROD + 'server_' + sname + '/ && : > ../' + sname + '_dd.log && screen -dmS ' + sname + 'server -L -Logfile ../' + sname + '_dd.log DreamDaemon tgstation.dmb -port ' + port + ' -trusted -public -threads on -params config-directory=cfg', { silent: true });
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Starting.`);
				break;
			case cfg.commands.work_control.stop:
				shell.exec('screen -X -S ' + sname + 'server quit', { silent: true });
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Killed.`);
				break;
		};
	};
};

async function print_help() {
	console.log("Function \"print_help\" called.");
	var h = "Help contents:\n";
	h += `> Host privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}adduser SERVER UID\` - adds user to server\n`;
	h += `\`${cfg.general.cmd_prefix}remuser SERVER UID\` - removes user from server\n`;
	h += `\`${cfg.general.cmd_prefix}luser SERVER\` - list of users in server\n`;
	h += `> Developer privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}shelp\` - displays this information\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER compile\` - runs compilation in the repo dir\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER deploy\` - moves compiled files and things defined in deploy.sh\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER update\` - updates local repo from master\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER clog\` - displays compile log\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER ulog\` - displays update log\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER dlog\` - displays DreamDaemon log\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER ddlog\` - retrieve dd.log file from the server\n`;
	h += `> Regular user privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER start|stop\` - start/stop server\n`;
	client.channels.get(cfg.channels_id.COMMAND_LINE).send(h);
}

client.login(cfg.general.BOT_ACCESS_TOKEN);
