import { HfInference } from '@huggingface/inference';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const image = fs.readFileSync('test-image.jpg');
dotenv.config();

async function run() {
    const token = process.env.HUGGINGFACE_TOKEN;
    console.log('Token exists:', !!token);
    if (!token) return;

    const hf = new HfInference(token.trim());
    console.log('HfInference created');

    try {
        console.log('Testing with simple classification to check API connectivity...');
        // Thử model phân loại ảnh đơn giản

        const result = await hf.request({
            model: 'google/vit-base-patch16-224',
            data: image,
            headers: { 'Content-Type': 'image/jpeg' },
        });
        console.log('Success:', JSON.stringify(result, null, 2));
    } catch (err: any) {
        console.error('Error in standalone test:', err.message);
        console.error('Stack:', err.stack);
    }
}

run();
