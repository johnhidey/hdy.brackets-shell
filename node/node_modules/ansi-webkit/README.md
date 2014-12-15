
# ANSI-WebKit

## turns this

![ansi][1]


## into this

![webkit][2]


## how

```js
var aw = require('ansi-webkit');
var str = '[42m[31m[1mspawn[22m[39m[49m ';
console.log.apply(console, aw.parse(str));
```


## example

```js
// show the dev tools by default
require('nw.gui').Window.get().showDevTools().resizeTo(800, 1000);
var aw = require('ansi-webkit');

var spawn = require('child_process').spawn,
  child = spawn('node', ['spawn.js']);

child.stdout.on('data', function (e) {
  var str = e.toString().trim();
  // ansi
  console.log(str);
  // parsed
  console.log.apply(console, aw.parse(str));
});

child.stderr.on('data', function (e) {
  var str = e.toString().trim();
  console.log(str);
});
```

## license

MIT


  [1]: http://i.imgur.com/gyPudQz.png
  [2]: http://i.imgur.com/hZJxhID.png
