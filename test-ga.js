const crypto = require('crypto');
async function run() {
  const email = 'dietzmann@dietzmann-analytics-api2.iam.gserviceaccount.com';
  const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDFQKLOPIJiw+TU\nEJgTSbkwnPlpqfSysow3CTSXKGBSp6gqsN/Qhr3eXkQxkfAI7HR03Ya/RD0TP87l\njL+3E99CGhb+6EoKU5uxTYj9FxLKvf1t13v8z4a+QKpVQUaD/HoqmCoCPgJhLPOj\nuhDWNhFUC2WaaTiD8Ol/YCqwB2PvqxthnsIMWIyTQQG1wCmBK46xvXCPKJmK3Jqw\nkWwiqUfXSB6UnfGgpJeFZzPq+RxAiB4x34Gkd18Ik/JnbAqNMe3AqcFd970EnS10\nosO0ltqnQhNO88zmxVOn6JjxtujjSF4AgTndADmvrv8FIQCBunSG4TonANtx5sMw\n8LKz7k5jAgMBAAECggEANyNHvy2j5tbKbssKr42Sojem8nXrLE6Dqli85ioHruMl\nu3VAwwn/JhskpdSdC+mI7igEZA+/oNNb0sfiyVrZNCGV3wBwve08HrZFPjYGbzzn\njB5JjtQ13pW152n9O6TGQ4TQbVsHEEHgAxreXPq1IlCjQKP8A8nCg3QOyrDuKw6j\nv/AviSjTLXgntQLllqxNLUgbfvWkUWzL2iFbJzV+fRLOpFMzX+SyWyXFKHgmn2QR\nCBTq1zxCSCRGjc/9SigmwuyQyvSpRYy+vhbO5r5e99dJSwfz0diFNvPFAoU75v6i\ngookuNaRhe+wi8h/J1tyx6L8UTY8iKb94gO60Wt6cQKBgQD3KrkNkGNhF3YgIaWv\n28zTN/zP4wVsUR5/LERBoMXet+z22NAeK8CQeY0Yye3Oz5jwujeNOxpR07mx9NNB\nk8Tdx+tcJZawk6kCOCfaB0ZQKZz9v7vtoJiEsiin69ncHoSzVb5pnxcQdCSeOb47\n+h+cwHM1dJRyjFLTEAegmYxxMwKBgQDMTUHCop6Eq27NhfP+8dhkxYmWIMHLMFKJ\nkIMPfMWPHD/qoTE/37x/gYNHtdnTXLQ6hjJpeJ1qmrIQ9k9SRML72Qggizf7d3Vi\nUVtaLOi3gzzrNpcvZd0c4yoRpgg5ZFeKmAbF8XCkhtZiSHmfk7gTL2ZsjOGPEZ39\n71l0Eu4OEQKBgQDpftrDDZxUpK1bPW4g7CxbfZC/c2A0K4375f21YgSLmoWpzLkP\nR5Xq5ml8+YZG0adSAxlnumXq13GdxAOu98ILIkoeCwSIW3ZWOmareiPapvVAYllO\n62AqO4Rc3lo5sDr8kAwKC9jmGlJdh39HectTchtkbHWwoQ+9hG8wMN6UMQKBgQCU\nCv+2DKUVuixmncS7X4DRNRuIQGBt3qxQpvlxxZZbJ7thSEEp6fTr6Gu7ERmxQaIQ\nLqJlL1PSphqWlAXStaUdXp23B2sfu+bBwfaSl6xjHqSMRVi0rfnWLv6TH18iR4Xw\nFk4CLfzUHClJuv73FdHzhQuRaV0hkUCNfF2z8Ou0IQKBgQCEEFAPy2IKswVMuupD\nujxd4tOVfRARFiXDdVHXEAuB3dfu1Ese7IjhBuMeSWGVEoPH0fnmp/fU1cawEJ/N\nA2wNKlcAKQ/7QVzDFnMzQ7DBKTjg2Kd38G3Hoh+B1kYiBVNy+b9SkO/MaRxRj0KF\nctoPHpHtXmjtnOTc1MKQ3Cuvcg==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n");
  
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodeB64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signatureInput = `${encodeB64Url(header)}.${encodeB64Url(payload)}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  sign.end();
  
  const signature = sign.sign(privateKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  
  const data = await res.json();
  console.log('Auth:', data);
  
  if (data.access_token) {
    const pId = '549574468';
    const repRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `7daysAgo`, endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
      })
    });
    console.log('Report Status:', repRes.status);
    console.log('Report Data:', await repRes.text());
  }
}
run();
