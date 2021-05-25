
// npm install resx-parser --save
// https://www.npmjs.com/package/resx-parser
// "./locales/test.resx"

const fs = require('fs');
console.log("Locales test program started.");
//fs.readFile('./locales/test.resx', 'utf8', callback);

// https://stackoverflow.com/a/32873155
fs.readFile("./locales/test.resx", 'utf8', function(err, data) {
  if (!err) {
    //console.log(data);
  }
});


//
//const fs = require('fs');
const convert = require('xml-js');
const xmlFile = fs.readFileSync("./locales/test.resx", 'utf8');
const jsonData = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 4}));


// All
console.log(jsonData.root.data);  // outputs: {_text: 'Test Value 2'}


// Loop
/*
for (let key in jsonData.root.data) {
  console.log('Entry ' + key + '/' + (Object.keys(jsonData.root.data).length - 1) + ', value: ' + Object.values(jsonData.root.data[key].value)[0])
}
*/


// Find
/*
const targetNode =

    jsonData.root.data
    .find(x =>

        x._attributes.name === 'Test Key 2'
    );

console.log(Object.values(targetNode.value)[0]);  // outputs: {_text: 'Test Value 2'}
*/

