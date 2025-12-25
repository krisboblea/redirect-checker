import fetch from 'node-fetch';
import https from 'https';
import { TRANSLATION_MISSING_URL } from '@/configs/constant';

export default async function handler(req, res) {
  const url = TRANSLATION_MISSING_URL;

  const response = await fetch(url, {
    method: 'POST', // Change to POST request
    headers: {
      'Content-Type': 'application/json', // Set content type
    },
    body: JSON.stringify(req.body), // Include the request body
    agent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL certificate verification
  });
  const data = await response.json();

  res.status(response.status).json(data);
}
