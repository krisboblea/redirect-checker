// pages/api/block.js
import { DEBUG_MODE } from '@/configs/constant';
import corsMiddleware from '@/middleware/corsMiddleware';
import rateLimitMiddleware from '@/middleware/rateLimitMiddleware.js';
import { exec } from 'child_process';

async function handler(req, res) {
    const { domain, ip = '75.2.48.81' } = req.query; // Default IP

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' }); // Handle non-GET requests
    }

    if (!domain) {
        return res.status(400).json({ error: 'Missing domain' });
    }

    const proxy = '111.231.2.142:32180'; // Define your proxy URL here
    const httpsCmd = `curl --socks5 ${proxy} --proxy-user po:xyz --resolve "${domain}:443:${ip}" -o /dev/null -s -w "%{http_code} %{time_total}" -k "https://${domain}/" 2>&1`;
    const httpCmd = `curl --socks5 ${proxy} --proxy-user po:xyz --resolve "${domain}:80:${ip}" -o /dev/null -s -w "%{http_code} %{time_total}" "http://${domain}/" 2>&1`;

    const startTime = process.hrtime();

    exec(httpsCmd, (error, httpsStdout) => {
        const httpsOutput = httpsStdout.trim().split(' ');
        const httpsStatus = httpsOutput[ 0 ] || "000";
        const httpsTime = parseFloat(httpsOutput[ 1 ] || 0).toFixed(2);
        const httpsError = error ? error.message : null;

        const httpsDebugInfo = DEBUG_MODE ? httpsCmd : "";

        exec(httpCmd, (error, httpStdout) => {
            const httpOutput = httpStdout.trim().split(' ');
            const httpStatus = httpOutput[ 0 ] || "000";
            const httpTime = parseFloat(httpOutput[ 1 ] || 0).toFixed(2);
            const httpError = error ? error.message : null;

            const httpDebugInfo = DEBUG_MODE ? httpCmd : "";

            const endTime = process.hrtime(startTime);
            const totalTime = (endTime[ 0 ] * 1000 + endTime[ 1 ] / 1000000).toFixed(0);

            res.status(200).json({
                http_pass: httpStatus !== "000",
                https_pass: httpsStatus !== "000",
                http_result: httpStatus,
                http_time: httpTime,
                https_result: httpsStatus,
                https_time: httpsTime,
                total_time: totalTime,
                error: {
                    https: httpsError,
                    http: httpError
                },
                debug: {
                    https: httpsDebugInfo,
                    http: httpDebugInfo
                }
            });
        });
    });
}

export default rateLimitMiddleware(handler);