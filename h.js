
//--------------------------------------------------------------------------//
// White Dream bot used for BYOND serverfuck.
// Author: Valtos
// Use wisely and report bugs if you find any.
// Fuck.
//--------------------------------------------------------------------------//

const os_config_path = './config.json';

// message consoles colors
mclr = {
	Rst:				"\x1b[0m",	FgBlack:		"\x1b[30m",
	Bright:			"\x1b[1m",	FgRed:			"\x1b[31m",
	Dim:				"\x1b[2m",	FgGreen:		"\x1b[32m",
	Underscore:	"\x1b[4m",	FgYellow:		"\x1b[33m",
	Blink:			"\x1b[5m",	FgBlue:			"\x1b[34m",
	Reverse:		"\x1b[7m",	FgMagenta:	"\x1b[35m",
	Hidden:			"\x1b[8m",	FgCyan:			"\x1b[36m",
	FgWhite:														"\x1b[37m",
};

stat_msg = {
  //blank:				mclr.Reset			+ "______" + mclr.Reset,
  boot:					mclr.FgMagenta	+ " BOOT " + mclr.Rst, // FgMagenta
  command:			mclr.FgYellow		+ " CMND " + mclr.Rst, // FgYellow

  done:					mclr.FgGreen		+ "  OK  " + mclr.Rst, // JOB_DONE
  failed:				mclr.FgRed			+ "FAILED" + mclr.Rst, // JOB_FAILED
  skipped:			mclr.Reset			+ " INFO " + mclr.Rst, // JOB_SKIPPED
  timeout:			mclr.FgRed			+ " TIME " + mclr.Reset, // JOB_TIMEOUT

  /* dependency:		mclr.FgYellow		+ "DEPEND" + mclr.Reset, // JOB_DEPENDENCY
  assert:				mclr.FgYellow		+ "ASSERT" + mclr.Reset, // JOB_ASSERT
  unsupported:	mclr.FgYellow		+ "UNSUPP" + mclr.Reset, // JOB_UNSUPPORTED
  colleced:			mclr.Reset			+ "COLECT" + mclr.Reset, // JOB_COLLECTED
  once:					mclr.FgRed			+ " ONCE " + mclr.Reset, // JOB_ONCE */
};

console.log(`${mclr.Rst}[____-__-__T__:__:__.___Z] [${stat_msg.boot}] Script started. Trying to import modules...`);

const Discord		= require('discord.js');
const shell			= require('shelljs');
const fs				= require('fs');
const chokidar	= require('chokidar');
									require('log-timestamp');

console.log("\x1b[32m" + "Importing modules done." + "\x1b[0m" + " Trying to load config files...");
const cfg	= JSON.parse(fs.readFileSync(os_config_path, 'utf8'));

console.log("\x1b[32m" + "Configs loaded, help command: " + cfg.general.cmd_prefix + cfg.commands.general.help + "." + "\x1b[0m" + " Trying to load localization files...");
if ((cfg.general.OUTPUT_LANGUAGE == "ENG") || (typeof(cfg.general.OUTPUT_LANGUAGE) != String))  {
	console.log("According to configuration file, trying to loading file of language: English...");
	const lang	= require(cfg.directories.LOC_ENG);
	console.log("Localization file file required.");
} else {
	console.log("According to configuration, trying to loading file of language: Russian...");
	const lang	= require(cfg.directories.LOC_RUS);
	console.log("Localization file file required.");
};

console.log(lang.select_lang + lang.language_name + ". " + lang.select_lang2);

console.log(lang.server1_settings_loading);
const Server1	= JSON.parse(fs.readFileSync(cfg.directories.S1_JSON, 'utf8'));
console.log(lang.server2_settings_loading);
const Server2	= JSON.parse(fs.readFileSync(cfg.directories.S2_JSON, 'utf8'));

console.log(lang.servers_settings_loaded);
const client						= new Discord.Client();
const cmd_channel				= client.channels.get(cfg.channels_id.COMMAND_LINE);
const endround_channel	= client.channels.get(cfg.channels_id.ENDROUND);

client.on('ready', () => {
	console.log(lang.greeting_log);
	client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.greeting_print + mclr.Rst);
	client.user.setActivity(lang.bot_status_playing);
});

setInterval(checkOnline, 5000); // refreshes data about servers every 5 seconds

// we use screens for DD and DM

async function checkOnline(server) {
	var s1_onlinestatus  = shell.exec(`[ "$(screen -ls | grep ${Server1.name}server)"  ] && echo ${lang.server_online} || echo ${lang.server_offline}`, { silent: true });
	var s1_compilestatus = shell.exec(`[ "$(screen -ls | grep ${Server1.name}compile)" ] && echo ${lang.server_build_compiling} || echo ${lang.server_build_not_compiling}`, { silent: true });

	var s2_onlinestatus  = shell.exec(`[ "$(screen -ls | grep ${Server2.name}server)"  ] && echo ${lang.server_online} || echo ${lang.server_offline}`, { silent: true });
	var s2_compilestatus = shell.exec(`[ "$(screen -ls | grep ${Server2.name}compile)" ] && echo ${lang.server_build_compiling} || echo ${lang.server_build_not_compiling}`, { silent: true });

	if (s1_compilestatus == lang.server_build_compiling) s1_onlinestatus = s1_compilestatus;
	if (s2_compilestatus == lang.server_build_compiling) s2_onlinestatus = s2_compilestatus;

	//if (typeof lastMinutes === 'undefined') var lastMinutes = today.getTime() - (1000 * 60 * 10) // 600 000 milisec - 10 minutes

	//if (Math.abs(today.getMinutes() - lastMinutes) >= 3) { // && (today.getMinutes()[-1] in [0, 5]
	//if ((today.getMinutes()[-1] == 1) || (today.getMinutes()[-1] == 3) || (today.getMinutes()[-1] == 6) || (today.getMinutes()[-1] == 9)) {

	var today = new Date();
	if (today.getMonth() < 9) var date = today.getFullYear() + '.0' + (today.getMonth() + 1) + '.' + today.getDate();
	var date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
	var time = today.getHours() + ":00"; //+ today.getMinutes();
	var dateTime = date + ', ' + time;

	client.channels.get(cfg.channels_id.COMMAND_LINE).setTopic(` | ${cfg.servers.first.Discord_show_name}: ${s1_onlinestatus} | ${cfg.servers.second.Discord_show_name}: ${s2_onlinestatus} | Updated: ${dateTime} (1 hour)`);

};

if ((cfg.general.replays_avaliable) && (cfg.directories.DEMOS != "")) {
	chokidar.watch(cfg.directories.DEMOS, {ignoreInitial: true, interval: 15000}).on('addDir', (event, path) => { // every 15 seconds
		endround_channel.send(`${lang.endround_message}${event.slice(-4)} ${lang.endround_message2}${event.slice(-4)}`); // here is the channel where links to replays posted
	});
};

client.on('message', message => {
	if (message.author.bot) return;
	console.log(`[${message.author.username}] [${message.channel.name}]: ${message.content}`);
	if (message.channel != client.channels.get(cfg.channels_id.COMMAND_LINE)) return;
	if (!message.content.startsWith(cfg.general.cmd_prefix)) return;

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.help)) {
		if (cfg.script_debug) console.log(lang.cmd_recived_help);
		print_help();
		return;
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.whoisadmin) && message.author.id == cfg.general.HOST_USER_ID) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${Server1.admins}`);
				break;
			case Server2.name:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${Server2.admins}`);
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
				return;
		}
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.adduser) && message.author.id == cfg.general.HOST_USER_ID) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				var uid = Server1.admins.indexOf(msg[2]);
				if (uid == -1) {
					Server1.admins.push(msg[2]);
					fs.writeFileSync('./s1.json', JSON.stringify(Server1, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_added_to_server+msg[2]+lang.contoller_added_to_server2+msg[1]+lang.contoller_added_to_server3);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_already_added+msg[2]+lang.contoller_already_added2+msg[1]+lang.contoller_already_added3);
				}
				break;
			case Server2.name:
				var uid = Server2.admins.indexOf(msg[2]);
				if (uid == -1) {
					Server2.admins.push(msg[2]);
					fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_added_to_server+msg[2]+lang.contoller_added_to_server2+msg[1]+lang.contoller_added_to_server3);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_already_added+msg[2]+lang.contoller_already_added2+msg[1]+lang.contoller_already_added3);
				}
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
				return;
		}
	};

	if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.remuser) && message.author.id == cfg.general.HOST_USER_ID) {
		var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
		switch(msg[1]) {
			case Server1.name:
				var uid = Server1.admins.indexOf(msg[2]);
				if (uid != -1) {
					Server1.admins.splice(Server1.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s1.json', JSON.stringify(Server1, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_removed+msg[2]+lang.contoller_removed2+msg[1]+lang.contoller_removed3);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_to_remove_not_found+msg[2]+lang.contoller_to_remove_not_found2+msg[1]+lang.contoller_to_remove_not_found3);
				};
				break;
			case Server2.name:
				var uid = Server2.admins.indexOf(msg[2]);
				if (uid != -1) {
					Server2.admins.splice(Server2.admins.indexOf(msg[2]), 1);
					fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_removed+msg[2]+lang.contoller_removed2+msg[1]+lang.contoller_removed3);
				} else {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_to_remove_not_found+msg[2]+lang.contoller_to_remove_not_found2+msg[1]+lang.contoller_to_remove_not_found3);
				}
				break;
			default:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
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
			client.channels.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
			return;
	};
	console.log("Trying to load OS shell servers control paths.");
	os_cmds = {
		server_name:			`${cfg.directories.REPOS}server_${sname}`,
		server_repo:			`${cfg.directories.REPOS}repo_${sname}`,
		server_prod_name:	`${cfg.directories.REPOS}server_${sname}`,
	};
	os_cmd_paths = {
		deploy:						`sh ${os_cmds.server_repo}/tools/deploy.sh ${cfg.directories.REPOS}server_${sname}`,
		compile:					`cd ${os_cmds.server_repo}/ && : > ../${sname}_compile.log && screen -dmS ${sname}compile -L -Logfile ../${sname}_compile.log DreamMaker tgstation.dme`,
		update_compile:		`cd ${os_cmds.server_repo}/ && : > ../${sname}_update.log && : > ../${sname}_compile.log && git pull > ../${sname}_update.log && screen -dmS ${sname}compile -L -Logfile ../${sname}_compile.log DreamMaker tgstation.dme`,
		update:						`cd ${os_cmds.server_repo}/ && : > ../${sname}_update.log && git pull > ../${sname}_update.log &`,
		send_compile_log:	`cat ${cfg.directories.REPOS}${sname}_compile.log`,
		send_update_log:	`cat ${cfg.directories.REPOS}${sname}_update.log`,
		dlog:							`cat ${cfg.directories.PROD}${sname}_dd.log`,
		ddlog:						`${cfg.directories.PROD}${sname}_dd.log`,
		start1:						`[ "$(screen -ls | grep ${sname}server)"  ] && echo 1 || echo 0`,
		start2:						`export LD_LIBRARY_PATH=${os_cmds.server_prod_name} && cd ${os_cmds.server_prod_name}/ && : > ../${sname}_dd.log && screen -dmS ${sname}server -L -Logfile ../${sname}_dd.log DreamDaemon tgstation.dmb -port ${port} -trusted -public -threads on -params config-directory=cfg`,
		stop:							`screen -X -S ${sname}server quit`
	};
	console.log("OS shell servers control paths loaded.");
	if (admins.includes(uid)) {
		if (devs.includes(uid)) {
			switch (cmd) {
				case cfg.commands.build_control.deploy:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to execute deploy build of server.`);
					shell.exec(os_cmd_paths.deploy, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Deploy command executed.`);
					break;
				case cfg.commands.build_control.compile:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to execute compile build of server.`);
					shell.exec(os_cmd_paths.compile, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Compile command executed. Compiling in progress.`);
					break;
				case cfg.commands.build_control.update_compile:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to execute bungle "auto+update+compile".`);
					shell.exec(os_cmd_paths.update_compile, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Started Auto-update-compile.`);
					break;
				case cfg.commands.build_control.update:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to execute update.`);
					shell.exec(os_cmd_paths.update, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Update command executed.`);
					break;
				case cfg.commands.build_control.send_compile_log:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to send compile log.`);
					var log = shell.exec(os_cmd_paths.send_compile_log, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`\`\`\`${log}\`\`\``);
					break;
				case cfg.commands.build_control.send_update_log:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to send update log.`);
					var log = shell.exec(os_cmd_paths.send_update_log, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
					break;
				case cfg.commands.build_control.dlog:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to send dd log via "cat".`);
					var log = shell.exec(os_cmd_paths.dlog, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
					break;
				case cfg.commands.build_control.ddlog:
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to send dd log directly.`);
					if (fs.existsSync(os_cmd_paths.ddlog)) {
						client.channels.get(cfg.channels_id.COMMAND_LINE).send({ files: [os_cmd_paths.ddlog] });
					} else {
						client.channels.get(cfg.channels_id.COMMAND_LINE).send(`It seems that there is no required file, <@${mts.author.id}>.`);
					};
					break;
			};
		};
		switch (cmd) {
			case cfg.commands.work_control.restart:
			case cfg.commands.work_control.stop:
				if (cmd == cfg.commands.work_control.restart) client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Server emergency restart sequence engaged.`);
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to stop server.`);
				shell.exec(os_cmd_paths.stop, { silent: true });
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Stop command executed. Stopped.`); // Killed
				if (cmd == cfg.commands.work_control.restart) {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to start server.`);
					shell.exec(os_cmd_paths.start2, { silent: true });
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Start command executed. Starting.`);
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Server emergency restart sequence finished.`);
				}
				break;
			case cfg.commands.work_control.start:
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to check server's pulse.`);
				if (shell.exec(os_cmd_paths.start1, { silent: true }) == "1\n") {
					client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Server is still online, starting not required.`); // Not dead yet.
					break;
				};
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Trying to start server.`);
				shell.exec(os_cmd_paths.start2, { silent: true });
				client.channels.get(cfg.channels_id.COMMAND_LINE).send(`${sname}: Start command executed. Starting.`);
				break;
		};
	};
};

async function print_help() {
	if (cfg.script_debug) console.log("Function \"print_help\" called.");
	console.log(arguments.callee.name);
	var h	= "Help contents:\n";
	h += `> Host user privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}${cfg.commands.general.adduser} SERVER_NAME UID\` - adds user to server\n`;
	h += `\`${cfg.general.cmd_prefix}${cfg.commands.general.remuser} SERVER_NAME UID\` - removes user from server\n`;
	h += `\`${cfg.general.cmd_prefix}${cfg.commands.general.whoisadmin} SERVER_NAME\` - list of users in server\n`;
	h += `> Developer user privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}${cfg.commands.general.help}\` - displays this information\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.compile}\` - runs compilation in the repo dir\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.deploy}\` - moves compiled files and things defined in deploy.sh\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.update}\` - updates local repo from master\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.send_compile_log}\` - sends compile log file\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.send_update_log}\` - sends update log file\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.dlog}\` - displays DreamDaemon log\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.build_control.ddlog}\` - retrieve dd.log file from the server\n`;
	h += `> Regular user privileges:\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.work_control.start}\` - start server\n`;
	h += `\`${cfg.general.cmd_prefix}SERVER_NAME ${cfg.commands.work_control.stop}\` - stop server\n`;
	client.channels.get(cfg.channels_id.COMMAND_LINE).send(h);
}

console.log("Script body is initialized. Trying to login and start servicing...");
client.login(cfg.general.BOT_ACCESS_TOKEN);
