/**
 * Script test full luồng:
 * 1. Login lấy token
 * 2. Tạo room test (nếu chưa có)
 * 3. Gọi /api/camera/test/:roomId với ảnh lớp học
 * 4. In kết quả đếm người
 */

const BASE_URL = 'http://127.0.0.1:8083/api';

// Ảnh test
const TEST_IMAGE_URLS = [
  'https://huggingface.co/datasets/mishig/sample_images/resolve/main/savanna.jpg',
];

let token = '';

// =========================
// LOGIN
// =========================
async function login() {
  console.log('🔐 Login...');

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'Admin123@gmail.com',
      password: 'Admin123@',
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Login thất bại: ${JSON.stringify(data)}`);
  }

  token = data.data.access_token;

  console.log('✅ Login OK');
  console.log('🔑 Token:', token.slice(0, 30) + '...');

  return token;
}

// =========================
// CREATE / GET ROOM
// =========================
async function createTestRoom(): Promise<string> {
  const res = await fetch(`${BASE_URL}/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  const rooms = data.data ?? data;

  if (Array.isArray(rooms) && rooms.length > 0) {
    console.log(`📍 Room có sẵn: ${rooms[0].name}`);
    return rooms[0].id;
  }

  const createRes = await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Phòng Học A1',
      location: 'Tầng 2 - Khu A',
    }),
  });

  const created = await createRes.json();

  console.log('RAW CREATE ROOM RESPONSE:', created);

  // 👇 FIX QUAN TRỌNG NHẤT
  const room = created.data ?? created;

  if (!room?.id) {
    throw new Error('❌ Không lấy được room.id');
  }

  console.log(`✅ Room OK: ${room.id}`);

  return room.id;
}

// =========================
// TEST CAMERA
// =========================
async function testDetect(roomId: string, imageUrl: string) {
  console.log(`\n📸 Testing image:`);

  const res = await fetch(`${BASE_URL}/camera/test/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageUrl }),
  });

  const json = await res.json();
  console.log('DEBUG JSON:', JSON.stringify(json, null, 2));

  if (!res.ok || json.success === false || (json.data && json.data.success === false)) {
    console.error('❌ ERROR:', JSON.stringify(json, null, 2));
    return;
  }

  const data = json.data;

  console.log('\n========== RESULT ==========');
  console.log('🧑 People:', data.peopleCount);
  console.log('💯 Confidence:', (data.confidence * 100).toFixed(1) + '%');
  console.log('⏱️ Time:', data.processingMs + 'ms');

  console.log('\n📦 Objects:');
  const counts: Record<string, number> = {};
  (data.allDetectedObjects || []).forEach((o: any) => {
    counts[o.label] = (counts[o.label] || 0) + 1;
  });
  Object.entries(counts).forEach(([label, count]) => {
    console.log(` - ${label}: ${count}`);
  });

  console.log('\n💾 Log ID:', data.cameraLogId);
  console.log('===========================\n');
}

// =========================
// MAIN FLOW
// =========================
async function main() {
  try {
    console.log('🚀 START PIPELINE\n');

    await login();

    const roomId = await createTestRoom();

    for (const url of TEST_IMAGE_URLS) {
      await testDetect(roomId, url);
    }

    // logs
    console.log('📋 Fetch logs...');
    const logsRes = await fetch(`${BASE_URL}/camera/logs/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const logsJson = await logsRes.json();
    const logs = logsJson.data;

    console.log('📊 STATS:', logs.stats);
  } catch (err: any) {
    console.error('💥 ERROR:', err.message);
  }
}

main();