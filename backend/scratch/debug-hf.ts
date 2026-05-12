
import * as dotenv from 'dotenv';
dotenv.config();

async function testHF() {
  const token = process.env.HUGGINGFACE_TOKEN;
  const modelId = 'facebook/detr-resnet-50';
  const url = `https://api-inference.huggingface.com/${modelId}`;
  const imageUrl = 'https://cdn.tuoitrethudo.vn/stores/news_dataimages/2023/082023/29/08/hoc-sinh-lop-1-thanh-tri220230829080600.jpg';

  console.log('Fetching image...');
  try {
    const imgRes = await fetch(imageUrl);
    console.log('Image fetch status:', imgRes.status);
    if (!imgRes.ok) {
      console.error('Failed to fetch image');
      return;
    }
    const buffer = await imgRes.arrayBuffer();

    console.log('Sending to HF...');
    const hfRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    const text = await hfRes.text();
    console.log('HF Status:', hfRes.status);
    console.log('HF Response:', text);
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

testHF();
