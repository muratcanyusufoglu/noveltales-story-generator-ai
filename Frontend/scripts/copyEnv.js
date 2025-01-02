const fs = require('fs');
const path = require('path');

module.exports = function(config) {
  const env = process.env.APP_ENV || 'development';
  const envFile = config[env];
  
  if (!envFile) {
    console.error(`No environment file configured for "${env}"`);
    return;
  }

  const source = path.resolve(__dirname, '..', envFile);
  const target = path.resolve(__dirname, '..', '.env');

  try {
    fs.copyFileSync(source, target);
    console.log(`Successfully copied ${envFile} to .env for ${env} environment`);
  } catch (error) {
    console.error(`Error copying environment file: ${error.message}`);
  }
}; 