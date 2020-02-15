const fs  = require('fs');
const cfg	= JSON.parse(fs.readFileSync('./config.json', 'utf8'));

lang = {
    greeting : `SS13 Сервер control bot is online. Type \`${cfg.general.cmd_prefix}shelp\` for help.`
};
