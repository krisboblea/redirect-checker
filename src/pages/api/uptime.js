import axios from "axios";
import corsMiddleware from "@/middleware/corsMiddleware";
import { UPTIME_API_BASE, UPTIME_API_KEY, UPTIME_CACHE_EXPIRES } from "@/configs/constant";

// Set axios instance defaults
axios.defaults.params = {
  [ "api-key" ]: UPTIME_API_KEY,
};
axios.defaults.baseURL = UPTIME_API_BASE;

// Service configuration mapping
// Maps page slugs to service token combinations
const SERVICE_CONFIGS = {
  // All services
  "uptime": [ "yy6y", "ps0k", "peet", "1z19", "nwxh" ],
  "link-shortener-uptime-comparison": [ "yy6y", "ps0k", "peet", "1z19", "nwxh" ],

  // Single service pages
  "redirhub-performance": [ "yy6y" ],
  "bitly-performance": [ "ps0k" ],
  "rebrandly-performance": [ "peet" ],
  "easyredir-performance": [ "1z19" ],
  "redirect-pizza-performance": [ "nwxh" ],

  // Head-to-head comparisons
  "bitly-vs-rebrandly": [ "ps0k", "peet" ],
  "redirhub-vs-bitly": [ "yy6y", "ps0k" ],
  "redirhub-vs-rebrandly": [ "yy6y", "peet" ],
  "bitly-vs-easyredir": [ "ps0k", "1z19" ],
  "rebrandly-vs-easyredir": [ "peet", "1z19" ],

  // Multi-service comparisons
  "top-link-shorteners": [ "yy6y", "ps0k", "peet" ],
  "redirect-service-comparison": [ "yy6y", "ps0k", "peet", "1z19" ],
};

let cachedData = null;
let cacheTimestamp = 0;

async function fetchData(serviceFilter = null) {
  try {

    // Filter services if specified, otherwise use all
    const sites = serviceFilter;

    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const formattedYesterday = yesterday.toISOString().replace('T', ' ').replace(/\..*$/, '') + ' UTC';

    const sitesData = await Promise.all(
      sites.map((token) => {
        return Promise.all([
          axios.get(`checks/${token}`),
          axios.get(`checks/${token}/metrics`, { params: { from: formattedYesterday } }),
        ]);
      })
    );
    const nodes = await axios.get(`/nodes`);

    return {
      sites: sitesData.map((check) => check.map((c) => c.data)),
      nodes: nodes.data,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function handler(req, res) {
  try {
    const cacheExpirationTime = parseInt(UPTIME_CACHE_EXPIRES) * 1000;

    let serviceFilter = null;

    // Priority 1: Get services from slug parameter
    if (req.query.slug && SERVICE_CONFIGS[ req.query.slug ]) {
      serviceFilter = SERVICE_CONFIGS[ req.query.slug ];
    }
    // Priority 2: Get services from services parameter (backward compatibility)
    else if (req.query.services) {
      serviceFilter = req.query.services.split(',').map(s => s.trim()).filter(Boolean);
    }

    let msg = "Data fetched from memory cache";

    // Note: Current implementation uses single-entry cache
    // For production with multiple comparison pages, consider implementing
    // multi-entry cache keyed by service combination
    if (!cachedData || Date.now() > cacheTimestamp + cacheExpirationTime) {
      cachedData = await fetchData(serviceFilter);
      cacheTimestamp = Date.now();
      msg = "Data fetched from API";
    }

    res.setHeader("Cache-Control", `public, s-maxage=${UPTIME_CACHE_EXPIRES}`);
    return res.json({ data: cachedData, msg, config: req.query.slug ? `slug:${req.query.slug}` : 'env' });
  } catch (error) {
    console.error("Request error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export default corsMiddleware(handler);