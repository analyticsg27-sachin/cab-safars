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

const BACKEND_DIR = path.join(__dirname, '..', '..', 'backend');
const REMOTE_BASE = '/cabsafars';

// Directories to upload (relative to backend/)
const DIRS_TO_UPLOAD = [
  'api',
  'config',
  'core',
  'controllers',
  'middleware',
  'services',
  'helpers',
  'routes',
];

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access(CONFIG);
    console.log('Connected to FTP server');

    // Upload each backend directory
    for (const dir of DIRS_TO_UPLOAD) {
      const localDir = path.join(BACKEND_DIR, dir);
      const remoteDir = `${REMOTE_BASE}/${dir}`;
      if (fs.existsSync(localDir)) {
        console.log(`Uploading ${dir}/ ...`);
        await client.ensureDir(remoteDir);
        await client.uploadFromDir(localDir, remoteDir);
      }
    }

    // Upload .htaccess
    console.log('Uploading .htaccess ...');
    await client.uploadFrom(
      path.join(BACKEND_DIR, '.htaccess'),
      `${REMOTE_BASE}/.htaccess`
    );

    // Upload .env
    console.log('Uploading .env ...');
    await client.uploadFrom(
      path.join(BACKEND_DIR, '.env'),
      `${REMOTE_BASE}/.env`
    );

    // Create storage directories
    console.log('Creating storage directories ...');
    await client.ensureDir(`${REMOTE_BASE}/storage/logs`);
    await client.ensureDir(`${REMOTE_BASE}/storage/uploads/profiles`);
    await client.ensureDir(`${REMOTE_BASE}/storage/uploads/documents`);

    console.log('\nBackend deploy complete!');
    console.log('API available at: https://pg.gnikhil.in/cabsafars/api/v1/');
  } catch (err) {
    console.error('FTP error:', err.message);
  } finally {
    client.close();
  }
}

deploy();
