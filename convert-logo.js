import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imagePath = path.join(__dirname, 'public/images/ciphervaultlogobig.png');
const imageBuffer = fs.readFileSync(imagePath);
const base64 = imageBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64}`;

console.log(dataUri);
