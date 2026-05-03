import https from 'https';

export default async function handler(req, res) {
  const code = req.query.code;
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  const client_secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code || !client_id || !client_secret) {
    res.statusCode = 400;
    return res.end("Missing code, client_id, or client_secret");
  }

  try {
    const data = JSON.stringify({ client_id, client_secret, code });

    const options = {
      hostname: 'github.com',
      port: 443,
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': data.length
      }
    };

    const token = await new Promise((resolve, reject) => {
      const githubReq = https.request(options, (githubRes) => {
        let body = '';
        githubRes.on('data', (chunk) => body += chunk);
        githubRes.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.error) reject(new Error(parsed.error_description || parsed.error));
            else resolve(parsed.access_token);
          } catch (e) {
            reject(new Error("Failed to parse GitHub response"));
          }
        });
      });
      githubReq.on('error', reject);
      githubReq.write(data);
      githubReq.end();
    });

    const script = `<!DOCTYPE html>
<html>
<head><title>Authorizing</title></head>
<body>
  <div style="font-family:sans-serif;padding:20px;">
    <h3>Authentication Successful!</h3>
    <p>Sending token back to Decap CMS...</p>
  </div>
  <script>
    const authData = {
      token: "${token}",
      provider: "github"
    };
    try {
      window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify(authData),
        "*"
      );
      // Close the popup after a brief delay to ensure the message is received
      setTimeout(function() {
        window.close();
      }, 500);
    } catch (err) {
      document.body.innerHTML += '<p style="color:red">Error sending message: ' + err.message + '</p>';
    }
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(script);
  } catch (error) {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 500;
    res.end('<h3>OAuth Exchange Error</h3><p>' + error.message + '</p>');
  }
}
