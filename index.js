
//--------------------------------------------------------------------------//
// Node.js bot for maintenancers, developers and hosts of BYOND SS13 servers
// Original version taken from «White Dream»
// Original author: Valtos, modder of original: Gesugao-san
// Use wisely and report bugs if you find any.
//--------------------------------------------------------------------------//

process.chdir('/home/ubuntu/_ss13_hosting/wdbot/'); // require('os').homedir();
const os_config_path = './config.json';

// message consoles colors
mclr = {
  Rst:        "\x1b[0m", FgBlack:   "\x1b[30m",
  Bright:     "\x1b[1m", FgRed:     "\x1b[31m",
  Dim:        "\x1b[2m", FgGreen:   "\x1b[32m",
  Underscore: "\x1b[4m", FgYellow:  "\x1b[33m",
  Blink:      "\x1b[5m", FgBlue:    "\x1b[34m",
  Reverse:    "\x1b[7m", FgMagenta: "\x1b[35m",
  Hidden:     "\x1b[8m", FgCyan:    "\x1b[36m",
  FgWhite:                          "\x1b[37m",
};

stat_msg = {
  //blank:    mclr.Rst   + "______" + mclr.Rst,
  boot:      mclr.FgMagenta + " BOOT " + mclr.Rst, // FgMagenta
  load:      mclr.FgMagenta + " LOAD " + mclr.Rst, // FgMagenta
  command:   mclr.FgYellow  + " CMND " + mclr.Rst, // FgYellow
  not_cmd:   mclr.Rst       + "NOTCMD" + mclr.Rst, // FgYellow

  ok:      mclr.FgGreen  + "  OK  " + mclr.Rst, // JOB_DONE
  failed:  mclr.FgRed    + "FAILED" + mclr.Rst, // JOB_FAILED
  info:    mclr.Rst      + " INFO " + mclr.Rst, // JOB_SKIPPED
  warning: mclr.FgYellow + "WARNIN" + mclr.FgYellow, // WARNING  // JOB_TIMEOUT

  /* dependency:  mclr.FgYellow  + "DEPEND" + mclr.Rst, // JOB_DEPENDENCY
  assert:      mclr.FgYellow  + "ASSERT" + mclr.Rst, // JOB_ASSERT
  unsupported: mclr.FgYellow  + "UNSUPP" + mclr.Rst, // JOB_UNSUPPORTED
  colleced:    mclr.Rst       + "COLECT" + mclr.Rst, // JOB_COLLECTED
  once:        mclr.FgRed     + " ONCE " + mclr.Rst, // JOB_ONCE */
};

console.log(`${mclr.Rst}[____-__-__T__:__:__.___Z] [${stat_msg.boot}] Script started. Trying to check elevated privileges...`);

/*
const isRoot = require('is-root');

if isRoot() {
  console.log(`${mclr.Rst}[____-__-__T__:__:__.___Z] [${stat_msg.ok}] Elevated privileges confirmed. Trying to import modules...`);
} else {
  console.log(`${mclr.Rst}[____-__-__T__:__:__.___Z] [${stat_msg.warning}] Elevated privileges is NOT confirmed. Launch as root. Exiting...`);
  return;
};*/

const Discord  = require('discord.js');
const shell    = require('shelljs');
const fs       = require('fs');
const chokidar = require('chokidar');
require('log-timestamp');

console.log(`[${stat_msg.info}] This platform is: ${process.platform}`);

console.log(`[${stat_msg.load}] Importing modules done. Trying to load config files...`);
const cfg = JSON.parse(fs.readFileSync(os_config_path, 'utf8'));

console.log(`[${stat_msg.ok}] Configs loaded, help command: ${cfg.general.cmd_prefix}${cfg.commands.general.help}. Trying to load localization files...`);
if ((cfg.general.OUTPUT_LANGUAGE == "ENG") || (typeof(cfg.general.OUTPUT_LANGUAGE) != String))  {
  console.log(`[${stat_msg.load}] According to configuration file, trying to loading file of language: English...`);
  const lang = require(cfg.directories.LOC_ENG);
  console.log(`[${stat_msg.ok}] Localization file file required.`);
} else {
  console.log(`[${stat_msg.loading}] According to configuration, trying to loading file of language: Russian...`);
  const lang = require(cfg.directories.LOC_RUS);
  console.log(`[${stat_msg.ok}] Localization file file required.`);
};

console.log(`[${stat_msg.ok}] ${lang.select_lang} ${lang.language_name}. ${lang.select_lang2}`);

console.log(`[${stat_msg.load}] ${lang.server1_settings_loading}`);
const Server1 = JSON.parse(fs.readFileSync(cfg.directories.S1_JSON, 'utf8'));
console.log(`[${stat_msg.load}] ${lang.server2_settings_loading}`);
const Server2 = JSON.parse(fs.readFileSync(cfg.directories.S2_JSON, 'utf8'));

console.log(`[${stat_msg.ok}] ${lang.servers_settings_loaded}`);
const client      = new Discord.Client();
const cmd_channel    = client.channels.cache.get(cfg.channels_id.COMMAND_LINE);
const endround_channel = client.channels.cache.get(cfg.channels_id.ENDROUND);

client.on('ready', () => {
  var client_is_ready = true;
  console.log(`[${stat_msg.info}] Logged in as «${client.user.tag}».`);
  console.log(`[${stat_msg.boot}] ${lang.greeting_log}${mclr.Rst}`)
  client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.greeting_print);
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

  client.channels.cache.get(cfg.channels_id.COMMAND_LINE).setTopic(` | ${cfg.servers.first.Discord_show_name}: ${s1_onlinestatus} | ${cfg.servers.second.Discord_show_name}: ${s2_onlinestatus} | Updated: ${dateTime} (1 hour)`);

};

if ((cfg.general.replays_avaliable) && (cfg.directories.DEMOS != "")) {
  chokidar.watch(cfg.directories.DEMOS, {ignoreInitial: true, interval: 15000}).on('addDir', (event, path) => { // every 15 seconds
    endround_channel.send(`${lang.endround_message}${event.slice(-4)} ${lang.endround_message2}${event.slice(-4)}`); // here is the channel where links to replays posted
  });
};

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel != client.channels.cache.get(cfg.channels_id.COMMAND_LINE)) return;
  if (!message.content.startsWith(cfg.general.cmd_prefix)) {
    console.log(`[${stat_msg.not_cmd}] (${message.author.username}) {${message.channel.name}}: ${message.content}`);
    return;
  } else {
    console.log(`[${stat_msg.command}] (${message.author.username}) {${message.channel.name}}: ${message.content}`);
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`\`\`\`Сommand recognized, executing. If nothing printed, that can be error.\`\`\``);
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.help)) {
    if (cfg.script_debug) console.log(stat_msg.info + " " + lang.cmd_recived_help);
    print_help();
    return;
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.nodejs.version)) {
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`Node.js version: ${process.version}`);
    return;
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.servers_list)) {
    var slist_out = `Avaliable game servers (names only):\n`;
    slist_out +=    `** • Server №1:** \`${Server1.name}\` — ${Server1.avaliable ? "avaliable" : "not avaliable"}\n`;
    slist_out +=    `** • Server №2:** \`${Server2.name}\` — ${Server2.avaliable ? "avaliable" : "not avaliable"}\n`;
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(slist_out);
    return;
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.nodejs.uptime)) {
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`Current Node.js process uptime: ${process.uptime()}`);
    return;
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + cfg.commands.general.whoisadmin) && message.author.id == cfg.general.HOST_USER_ID) {
    var msg = message.content.slice(cfg.general.cmd_prefix.length).split(' ');
    switch(msg[1]) {
    case Server1.name:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`${Server1.admins}`);
      break;
    case Server2.name:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`${Server2.admins}`);
      break;
    default:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`No avaliable servers with entered name is not detected.`);
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
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
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_added_to_server+msg[2]+lang.contoller_added_to_server2+msg[1]+lang.contoller_added_to_server3);
      } else {
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_already_added+msg[2]+lang.contoller_already_added2+msg[1]+lang.contoller_already_added3);
      }
      break;
    case Server2.name:
      var uid = Server2.admins.indexOf(msg[2]);
      if (uid == -1) {
        Server2.admins.push(msg[2]);
        fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_added_to_server+msg[2]+lang.contoller_added_to_server2+msg[1]+lang.contoller_added_to_server3);
      } else {
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_already_added+msg[2]+lang.contoller_already_added2+msg[1]+lang.contoller_already_added3);
      }
      break;
    default:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
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
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_removed+msg[2]+lang.contoller_removed2+msg[1]+lang.contoller_removed3);
      } else {
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_to_remove_not_found+msg[2]+lang.contoller_to_remove_not_found2+msg[1]+lang.contoller_to_remove_not_found3);
      };
      break;
    case Server2.name:
      var uid = Server2.admins.indexOf(msg[2]);
      if (uid != -1) {
        Server2.admins.splice(Server2.admins.indexOf(msg[2]), 1);
        fs.writeFileSync('./s2.json', JSON.stringify(Server2, null, 4));
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_removed+msg[2]+lang.contoller_removed2+msg[1]+lang.contoller_removed3);
      } else {
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.contoller_to_remove_not_found+msg[2]+lang.contoller_to_remove_not_found2+msg[1]+lang.contoller_to_remove_not_found3);
      }
      break;
    default:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
      return;
    }
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + "s " + Server1.name)) {
    cmd_to = message.content.slice(cfg.general.cmd_prefix.length).split(' ').slice(2).join(" ");
    issue_command(message.author.id, cmd_to, Server1.name);
  };

  if (message.content.startsWith(cfg.general.cmd_prefix + "s " + Server2.name)) {
    cmd_to = message.content.slice(cfg.general.cmd_prefix.length).split(' ').slice(2).join(" ");
    issue_command(message.author.id, cmd_to, Server2.name);
  };

});

async function issue_command(uid, cmd, server) {
  var savaliable;
  var sname;
  var admins;
  var devs;
  var port;
  switch(server) {
    case Server1.name:
      savaliable = Server1.avaliable;
      sname      = Server1.name;
      admins     = Server1.admins;
      devs       = Server1.devs;
      port       = Server1.port;
      break;
    case Server2.name:
      savaliable = Server2.avaliable;
      sname      = Server2.name;
      admins     = Server2.admins;
      devs       = Server2.devs;
      port       = Server2.port;
      break;
    default:
      client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(lang.run_help_for_help);
      return;
  };

  if (savaliable) {
    console.log(`[${stat_msg.boot}] ${sname}: Someone was tried to operate with available game server, continuing.`);
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is available by config, continuing.`);
  } else {
    console.log(`[${stat_msg.failed}] ${sname}: Someone was tried to operate with unavailable game server, aboarting.`);
    client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is unavailable by config, aboarting.`);
    return;
  };

  console.log(`[${stat_msg.load}] ${sname}: Trying to load OS shell game servers control paths.`);
  os_cmds = {
    server_development: `${cfg.directories.REPOS}repo_${sname}`,
    server_production:  `${cfg.directories.REPOS}server_${sname}`
  };
  os_cmd_paths = {
    update:         `cd ${os_cmds.server_development}/ && : > ../${sname}_update.log && git pull -f > ../${sname}_update.log &`,
    compile:        `cd ${os_cmds.server_development}/ && : > ../${sname}_compile.log && screen -dmS ${sname}compile -L -Logfile ../${sname}_compile.log DreamMaker tgstation.dme`,
    update_compile: `cd ${os_cmds.server_development}/ && : > ../${sname}_update.log && : > ../${sname}_compile.log && git pull -f > ../${sname}_update.log && screen -dmS ${sname}compile -L -Logfile ../${sname}_compile.log DreamMaker tgstation.dme`,
    deploy:         `sh ${os_cmds.server_development}/tools/deploy.sh ${os_cmds.server_production}server_${sname}`,
    //shell.exec('sh ' + REPOS_DIR + 'repo_' + sname + '/tools/deploy.sh ' + PROD_DIR + 'server_' + sname, { silent: true });

    log_update_show:        `cat ${cfg.directories.REPOS}${sname}_update.log`,
    log_update_upload:          `${cfg.directories.REPOS}${sname}_update.log`,
    log_compile_show:       `cat ${cfg.directories.REPOS}${sname}_compile.log`,
    log_compile_upload:         `${cfg.directories.REPOS}${sname}_compile.log`,
    log_dreamdaemon_show:   `cat ${cfg.directories.REPOS}${sname}_dd.log`,
    log_dreamdaemon_upload:     `${cfg.directories.REPOS}${sname}_dd.log`,

    start1: `[ "$(screen -ls | grep ${sname}server)" ] && echo 1 || echo 0`,
    start2: `export LD_LIBRARY_PATH=${os_cmds.server_production} && cd ${os_cmds.server_production}/ && : > ../${sname}_dd.log && screen -dmS ${sname}server -L -Logfile ../${sname}_dd.log DreamDaemon tgstation.dmb -port ${port} -trusted -public -threads on -params config-directory=cfg`,
    stop:   `screen -X -S ${sname}server quit`
  };
  console.log(`[${stat_msg.ok}] ${sname}: OS shell game servers control paths loaded.`);

  if (admins.includes(uid)) {
    if (devs.includes(uid)) {
      switch (cmd) {
        case cfg.commands.build_control.update:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to execute update.`);
          shell.exec(os_cmd_paths.update, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Update command executed.`);
          break;
        case cfg.commands.build_control.compile:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to execute compile build of game server.`);
          shell.exec(os_cmd_paths.compile, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Compile command executed. Compiling in progress.`);
          break;
        case cfg.commands.build_control.update_compile:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to execute bungle "auto+update+compile".`);
          shell.exec(os_cmd_paths.update_compile, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Started Auto-update-compile.`);
          break;
        case cfg.commands.build_control.deploy:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to execute deploy build of game server.`);
          shell.exec(os_cmd_paths.deploy, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Deploy command executed.`);
          break;

        case cfg.commands.build_control.log_update_show:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send update log («cat»). If nothing printed, that can be error.`);
          console.log(`[${stat_msg.load}] ${sname}: os_cmd_paths.log_update_show=«${os_cmd_paths.log_update_show}».`);
          var log = shell.exec(os_cmd_paths.log_update_show, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
          break;
        case cfg.commands.build_control.log_update_upload:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send update log (upload). If nothing printed, that can be error.`);
          console.log(`[${stat_msg.load}] ${sname}: os_cmd_paths.log_update_upload=«${os_cmd_paths.log_update_upload}».`);
          if (fs.existsSync(os_cmd_paths.log_update_upload)) {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send({ files: [os_cmd_paths.log_update_upload] });
          } else {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`It seems that there is no required file.`);
          };
          break;
        case cfg.commands.build_control.log_compile_show:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send compile log («cat»). If nothing printed, that can be error.`);
          var log = shell.exec(os_cmd_paths.log_compile_show, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`${log}`);
          break;
        case cfg.commands.build_control.log_compile_upload:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send compile log (upload). If nothing printed, that can be error.`);
          if (fs.existsSync(os_cmd_paths.log_compile_upload)) {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send({ files: [os_cmd_paths.log_compile_upload] });
          } else {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`It seems that there is no required file.`);
          };
          break;
        case cfg.commands.build_control.log_dreamdaemon_show:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send dd log («cat»). If nothing printed, that can be error.`);
          var log = shell.exec(os_cmd_paths.log_dreamdaemon_show, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`${log}`, { split: true });
          break;
        case cfg.commands.build_control.log_dreamdaemon_upload:
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to send dd log (upload). If nothing printed, that can be error.`);
          if (fs.existsSync(os_cmd_paths.log_dreamdaemon_upload)) {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send({ files: [os_cmd_paths.log_dreamdaemon_upload] });
          } else {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`It seems that there is no required file.`);
          };
          break;
      };
    };
    switch (cmd) {
      case cfg.commands.work_control.status:
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server status check sequence engaged**.`)
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to check game server's pulse.`);
        if (shell.exec(os_cmd_paths.start1, { silent: true }) == "1\n") {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is __online__.`) // Not dead yet.
        } else {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is __offline__.`);
        };
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server status check sequence finished**.`);
        break;
      case cfg.commands.work_control.restart:
      case cfg.commands.work_control.stop:
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server ${cmd == cfg.commands.work_control.restart ? "restarting" : "stopping"} sequence engaged**.`);

        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to check game server's pulse.`);
        if (shell.exec(os_cmd_paths.start1, { silent: true }) == "0\n") {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is already offline, stopping not required.`); // Not dead yet.
        } else {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is online, trying to stop game server.`);
          shell.exec(os_cmd_paths.stop, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Stop command executed. Game server must be stopped.`) // Killed
        };

        if (cmd == cfg.commands.work_control.restart) {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to check game server's pulse.`);
          if (shell.exec(os_cmd_paths.start1, { silent: true }) == "1\n") {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is already online, starting not required.`) // Not dead yet.
          } else {
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is offline, trying to start game server.`);
            shell.exec(os_cmd_paths.start2, { silent: true });
            client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Start command executed. Game server must be started.`)
          }
        };
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server ${cmd == cfg.commands.work_control.restart ? "restarting" : "stopping"} sequence finished**.`);
        break;

      case cfg.commands.work_control.start:
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server starting sequence engaged**.`)
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Trying to check game server's pulse.`);
        if (shell.exec(os_cmd_paths.start1, { silent: true }) == "1\n") {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is already online, starting not required.`) // Not dead yet.
        } else {
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Game server is offline, trying to start game server.`);
          shell.exec(os_cmd_paths.start2, { silent: true });
          client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: Start command executed. Game server must be started.`);
        };
        client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(`**${sname}**: **Game server starting sequence finished**.`);
        break
    };
  };
};

async function print_help() {
  if (cfg.script_debug) console.log(`${stat_msg.info} Function \"print_help\" called.`);
  //console.log(arguments.callee.name);

  var h1 = `\`${cfg.general.cmd_prefix}${cfg.commands.general.adduser} SERVERNAME UID\` — adds user to game server contol\n`;
  h1 +=    `\`${cfg.general.cmd_prefix}${cfg.commands.general.remuser} SERVERNAME UID\` — removes user from game server control\n`;
  h1 +=    `\`${cfg.general.cmd_prefix}${cfg.commands.general.whoisadmin} SERVERNAME\` — list of users in game server control\n`;
  h1 +=    `\`${cfg.general.cmd_prefix}${cfg.commands.nodejs.version}\` — displays the Node.js version string.\n`;
  h1 +=    `\`${cfg.general.cmd_prefix}${cfg.commands.nodejs.uptime}\` — displays uptime in seconds of the current Node.js process running.\n`;

  var h2 = `\`${cfg.general.cmd_prefix}${cfg.commands.general.help}\` — displays this information\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.compile}\` — runs compilation in the repo dir\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.deploy}\` — moves compiled files and defined in «deploy.sh»\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.update}\` — updates local repo from master\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_update_show}\` — displays update log (via "cat")\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_update_upload}\` — upload update log from host to here\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_compile_show}\` — displays compile log (via "cat")\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_compile_upload}\` — upload compile log from host to here\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_dreamdaemon_show}\` — displays DreamDaemon log (via "cat")\n`;
  h2 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.build_control.log_dreamdaemon_upload}\` — upload SERVERNAME_dd.log from host to here\n`;

  var h3 = `\`${cfg.general.cmd_prefix}${cfg.commands.general.servers_list}\` — list avaliable game servers name\n`;
  h3 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.work_control.status}\` — check status of game server\n`;
  h3 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.work_control.restart}\` — restart game server\n`;
  h3 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.work_control.start}\` — start game server\n`;
  h3 +=    `\`${cfg.general.cmd_prefix}s SERVERNAME ${cfg.commands.work_control.stop}\` — stop game server\n`;

  var h = `Help contents:\n`;
  h +=    `** • Host user privileges:**\n`;
  h +=    h1;
  h +=    `** • Developer user privileges:**\n`;
  h +=    h2;
  h +=    `** • Regular user privileges:**\n`;
  h +=    h3;
  client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send(h);
};

console.log(`[${stat_msg.boot}] Trying to login and start servicing...`);
client.login(cfg.general.BOT_ACCESS_TOKEN);

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.console.log("Bot reconnecting..."))
  .on("error", err => client.console.error(err))
  .on("warn", info => client.console.warn(info));

//trap `[____-__-__T__:__:__.___Z] [${stat_msg.ok}] Interruption detected, shutting down... ; exit 1`;



console.log('Script body is initialized.');

//graceful shutdown
process.on('SIGINT', function() { console.log("Caught interrupt signal (CTRL-C)"); process.exit(1) });
process.on('SIGQUIT', function() { console.log("Caught interrupt signal (keyboard quit action)"); process.exit(1) });
process.on('SIGTERM', function() { console.log("Caught interrupt signal (operating system kill)"); process.exit(1) });

process.on('exit', code => {
  console.log (`Exiting. Exit code: ${code}`);
  // client.channels.cache.get(cfg.channels_id.COMMAND_LINE).send("Script stopping die external command.");
  // client.user.setStatus("offline");
  process.exit(1);
});
