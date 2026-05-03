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
        // Send the token back to Decap CMS
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify(authData),
          "*"
        );
        // Close the popup
        window.close();
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(script);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
