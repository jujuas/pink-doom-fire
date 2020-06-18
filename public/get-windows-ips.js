var lines = WScript.Stdin.ReadAll().split('\n');
var adaptersIps = '';

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];

  if (line.match(/IPv4/)) {
    var ipRegex = new RegExp(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/g);
    var ip = line.match(ipRegex);
    adaptersIps += ip + ' ';

    WScript.echo(ip);
    break;
  }
}