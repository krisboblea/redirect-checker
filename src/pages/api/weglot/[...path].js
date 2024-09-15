import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

// Export the config object
export const config = {
  api: {
    bodyParser: true,
  },
};

// Export the request handler function
export default async function handler(req, res) {
  const { path } = req.query;
  const fullPath = path.join('/');
  const targetUrl = `https://www.redirhub.test/api/weglot/${fullPath}`;

  console.log('Incoming request:', req.method, fullPath);
  console.log('Forwarding to:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: 'www.redirhub.test',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      agent: agent, // Use the agent with disabled SSL verification
    });

    const data = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    res.status(response.status).setHeader('Content-Type', headers[ 'content-type' ] || 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
