
console.log("Locales test program started.");

var fs = require('fs');
var locale = JSON.parse(fs.readFileSync('./locales/ru_RU.json', 'utf8'));

console.log("locale: " + locale);
console.log("locale.general: " + locale.general);

