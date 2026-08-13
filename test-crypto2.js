const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');
const crypto = require('crypto');
const pk = process.env.GA_PRIVATE_KEY;
console.log("Starts with quotes?", pk.startsWith('"'));
console.log("Has real newlines?", pk.includes('\n'));
console.log("Has literal slash n?", pk.includes('\\n'));
try {
  let keyToUse = pk.replace(/^"|"$/g, '').trim().replace(/\\n/g, '\n');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update('test');
  sign.end();
  sign.sign(keyToUse, 'base64url');
  console.log('success with replacement!');
} catch(e) {
  console.error("Replacement failed:", e.message);
}
try {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update('test');
  sign.end();
  sign.sign(pk, 'base64url');
  console.log('success with raw pk!');
} catch(e) {
  console.error("Raw pk failed:", e.message);
}
