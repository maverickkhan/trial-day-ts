import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envFile = {
    docker: '.env.docker',
    test: '.env.test',
    local: '.env.local'
  }[process.env.NODE_ENV ?? 'local'] || '.env.local';
  

const envPath = path.resolve(process.cwd(), envFile);

// Load only if file exists
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded environment from ${envFile}`);
} else {
  console.warn(`⚠️  Env file ${envFile} not found, skipping...`);
}
