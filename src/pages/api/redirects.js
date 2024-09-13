import axios from 'axios';
import corsMiddleware from '@/middleware/corsMiddleware';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    url = url.trim();

    // fix url if it doesn't have a scheme
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
    }

    const results = [];
    let currentUrl = url;
    let redirectCount = 0;
    const maxRedirects = 5;
    let proceed = true;

    try {

        while (proceed && redirectCount < maxRedirects) {
            let start = new Date().getTime();
            const response = await axios({
                method: 'get',
                url: currentUrl,
                timeout: 5000, // 30 seconds timeout
                headers: {
                    'User-Agent': 'FindRedirect_Checker/1.0',
                },
                maxRedirects: 0,
                validateStatus: null, // Resolve only if the status code is less than 500
            });

            const result = {
                url: currentUrl,
                time: new Date().toISOString(),
                succeed: response.status < 400,
                http_code: response.status,
                redirect: response.headers[ 'location' ] || false,
                alltime: (new Date().getTime() - start) / 1000,
                header: response.headers,
                ip: response.request.socket.remoteAddress,
                scheme: currentUrl.split(':')[ 0 ].toUpperCase(),
                ssl_verify_result: response.request.socket.authorized ? 1 : 0,
            };

            results.push(result);

            if (response.headers[ 'location' ]) {
                // Handle both absolute and relative URLs
                const locationUrl = new URL(response.headers[ 'location' ], currentUrl);
                currentUrl = locationUrl.href;
                redirectCount += 1;
            } else {
                proceed = false;
            }
        }

    } catch (error) {
        results.push({
            url: url,
            time: new Date().toISOString(),
            succeed: false,
            error_no: error.response?.status || 0,
            error_msg: error.message,
        });
    }
    return res.status(200).json(results);
}

export default corsMiddleware(handler);
