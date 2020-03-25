require('log-timestamp');
const fs  = require('fs');
const cfg	= JSON.parse(fs.readFileSync('./config.json', 'utf8'));

lang = {
  language_name : `Russian (WIP)`,

  select_lang : `Successfully selected language: `,
  select_lang2 : `Now output is localized.`,
  server1_settings_loading: "Now reading servers settings. Trying to load first server settings...",
  server2_settings_loading: "First server settings loaded. Trying to load second server settings...",
  servers_settings_loaded: "Second server settings loaded. All servers settings loaded. Trying to initialize script body...",
  greeting_log : "Client is ready. Waiting for commands...\n__________________________",
  greeting_print : `**Bot is started and ready to serve you. Type** «\`${cfg.general.cmd_prefix}${cfg.commands.general.help}\`» **for help.**`,
  bot_status_playing : `with servers (${cfg.general.cmd_prefix}${cfg.commands.general.help})`,
  server_online : "ONLINE",
  server_offline : "OFFLINE",
  server_build_compiling : "ONLINE & COMPILING",
  server_build_not_compiling : "ONLINE & NOT COMPILING",
  endround_message: `Round №`,
  endround_message2: `ended. Replay: ${cfg.url_for_replays}`,
  cmd_recived_help: "Сommand received: \"help\".",
  run_help_for_help: `I can not understand this command. Please type \`${cfg.general.cmd_prefix}${cfg.commands.general.help}\` for help.`,
  contoller_added_to_server: `Added user <@`,
  contoller_added_to_server2: `> to control `,
  contoller_added_to_server3: ` server.`,
  contoller_already_added: `User <@`,
  contoller_already_added2: `> already added to control `,
  contoller_already_added3: ` server.`,
  contoller_removed: `Removed user <@`,
  contoller_removed2: `> from control `,
  contoller_removed3: ` server.`,
  contoller_to_remove_not_found: `No such UID <@`,
  contoller_to_remove_not_found2: `> in control `,
  contoller_to_remove_not_found3: ` server.`,

  this_file_was_readed1: `Localization file of «`,
  this_file_was_readed2: `» language was readed.`
};

console.log("         " + lang.this_file_was_readed1 + lang.language_name + lang.this_file_was_readed2);
