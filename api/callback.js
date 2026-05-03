export default async function handler(req, res) {
  const { code } = req.query;
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  const client_secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code || !client_id || !client_secret) {
    return res.status(400).send("Missing code, client_id, or client_secret");
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const data = await response.json();
    const token = data.access_token;
    
    // The specific postMessage format Decap CMS expects to close the popup securely
    const script = `
      <script>
        const authData = {
          token: "${token}",
          provider: "github"
        };
        
        // Show success message in the popup for debugging
        document.body.innerHTML = '<div style="font-family:sans-serif;padding:20px;">' +
          '<h3>Authentication Successful!</h3>' +
          '<p>Token received ending in: ...' + "${token}".slice(-4) + '</p>' +
          '<p>Sending back to Decap CMS...</p></div>';

        // Send the token back to Decap CMS
        try {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(authData),
            "*"
          );
        } catch (err) {
          document.body.innerHTML += '<p style="color:red">Error sending message: ' + err.message + '</p>';
        }
        
        // Delay closing so we can see the result, or close immediately if everything is perfect
        setTimeout(function() {
          window.close();
        }, 1500);
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(script);
  } catch (error) {
    res.status(500).send('<h3>OAuth Exchange Error</h3><p>' + error.message + '</p>');
  }
}
