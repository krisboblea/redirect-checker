import fetch from 'node-fetch';
import https from 'https';
import { TRANSLATION_URL } from '@/configs/constant';

export default async function handler(req, res) {
    const { slug } = req.query;
    const url = TRANSLATION_URL.replace('{{lng}}', slug);

    const response = await fetch(url, {
        agent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL certificate verification
    });
    const data = await response.json();

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(response.status).json(data);
}
