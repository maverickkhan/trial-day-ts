"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = {
    docker: '.env.docker',
    test: '.env.test',
    local: '.env.local'
}[process.env.NODE_ENV ?? 'local'] || '.env.local';
const envPath = path_1.default.resolve(process.cwd(), envFile);
// Load only if file exists
if (fs_1.default.existsSync(envPath)) {
    dotenv_1.default.config({ path: envPath });
    console.log(`✅ Loaded environment from ${envFile}`);
}
else {
    console.warn(`⚠️  Env file ${envFile} not found, skipping...`);
}
