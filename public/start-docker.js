const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

let ip;

async function main() {
  ip = await getIp();
  updateNginxFile();
  await composeDown();
  await composeUp();
}

async function getIp() {
  const { stdout, stderr } = await exec('ipconfig | cscript /Nologo get-windows-ips.js');
  if (stderr) console.error(stderr);

  return stdout.replace(new RegExp(/^\s+|\s+$/g), '');
}

function updateNginxFile() {
  const NGINX_CONF_PATH = '../docker/nginx/nginx.conf';

  const originalFile = fs.readFileSync(NGINX_CONF_PATH).toString();
  const regExp = new RegExp('server [0-9]+.[0-9]+.[0-9]+.[0-9]+:');
  const modifiedFile = originalFile.replace(regExp, `server ${ip}:`);

  console.log(`NGINX sendo configurado com o IP ${ip}`);

  fs.writeFileSync(NGINX_CONF_PATH, modifiedFile, err => {
    if (err) throw err;
    console.log('nginx.conf saved!');
  });
}

async function composeDown() {
  const { stdout, stderr } = await exec('docker-compose down');
  if (stderr) console.error(stderr);

  console.log(stdout);
}

async function composeUp() {
  const { stdout, stderr } = await exec('docker-compose up -d');
  if (stderr) console.error(stderr);

  console.log(stdout);
}

main();
