import axios from "axios";
import corsMiddleware from "@/middleware/corsMiddleware";
import { UPTIME_API_BASE, UPTIME_API_KEY, UPTIME_CACHE_EXPIRES, UPTIME_SITES } from "@/configs/constant";

// Set axios instance defaults
axios.defaults.params = {
  [ "api-key" ]: UPTIME_API_KEY,
};
axios.defaults.baseURL = UPTIME_API_BASE;

let cachedData = null;
let cacheTimestamp = 0;

async function fetchData() {
  try {
    const sites = JSON.parse(UPTIME_SITES);
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
    let msg = "Data fetched from memory cache";

    if (!cachedData || Date.now() > cacheTimestamp + cacheExpirationTime) {
      cachedData = await fetchData();
      cacheTimestamp = Date.now();
      msg = "Data fetched from API";
    }

    res.setHeader("Cache-Control", `public, s-maxage=${UPTIME_CACHE_EXPIRES}`);
    return res.json({ data: cachedData, msg });
  } catch (error) {
    console.error("Request error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export default corsMiddleware(handler);