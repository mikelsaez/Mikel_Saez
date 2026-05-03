export default function handler(req, res) {
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!client_id) {
    res.statusCode = 500;
    return res.end('OAUTH_GITHUB_CLIENT_ID is missing in Vercel environment variables');
  }
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`;
  res.statusCode = 302;
  res.setHeader('Location', authUrl);
  res.end();
}
