const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  host: '145.79.213.70',
  user: 'u655013075.sachin',
  password: 'CoffeeBeforeSunrise9!',
  secure: false,
  port: 21,
};

const LOCAL_DIR = path.join(__dirname, '..', 'out');
const REMOTE_DIR = '/cabsafars';

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access(CONFIG);
    console.log('Connected to FTP server');

    await client.ensureDir(REMOTE_DIR);
    console.log(`Uploading from ${LOCAL_DIR} to ${REMOTE_DIR} ...`);

    await client.uploadFromDir(LOCAL_DIR, REMOTE_DIR);
    console.log('Deploy complete!');
  } catch (err) {
    console.error('FTP error:', err.message);
    process.exit(1);
  }

  client.close();
}

deploy();
