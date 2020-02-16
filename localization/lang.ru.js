const fs  = require('fs');
const cfg = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

lang = {
  language_name : `Russian (WIP)`,

  select_lang : `Successfully selected language: `,
  select_lang2 : `Now output is localized.`,
  greeting_log : "Script is initialized and client is ready. Waiting for commands…",
  greeting_print : `Bot script is successfully started and ready to serve you. Type \`${cfg.general.cmd_prefix}shelp\` for help.`,
  bot_status_playing : "with servers",
  server_online : "ONLINE",
  server_offline : "OFFLINE",
  server_build_compiling : "COMPILING",
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
};
