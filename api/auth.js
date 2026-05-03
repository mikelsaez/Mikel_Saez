export default function handler(req, res) {
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!client_id) {
    return res.status(500).send('OAUTH_GITHUB_CLIENT_ID is missing in Vercel environment variables');
  }
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`;
  res.redirect(302, authUrl);
}
