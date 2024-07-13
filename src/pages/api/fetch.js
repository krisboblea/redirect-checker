import axios from "axios";

let cachedData = null;
let cacheTimestamp = 0;

// Set axios instance defaults
axios.defaults.params = {
  [ "api-key" ]: process.env.API_KEY,
};
axios.defaults.baseURL = process.env.API_BASE;

// Function to fetch data from external API
export async function fetchData() {
  try {
    const { SITES } = process.env;
    const sites = JSON.parse(SITES);

    // Fetch data for each site and metrics asynchronously
    const sitesData = await Promise.all(
      sites.map((token) => {
        return Promise.all([
          axios.get(`checks/${token}`),
          axios.get(`checks/${token}/metrics`),
        ]);
      })
    );

    // Fetch nodes data
    const nodes = await axios.get(`/nodes`);

    // Construct data object with fetched data and timestamp
    const data = {
      sites: sitesData.map((check) => check.map((c) => c.data)),
      nodes: nodes.data,
      timestamp: Date.now(),
    };

    // Update cached data and timestamp
    cachedData = data;
    cacheTimestamp = Date.now();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw error to be handled by caller
  }
}

// Request handler function
export default async function handler(req, res) {
  try {
    // Check if cached data exists and is not expired
    if (!cachedData || Date.now() > cacheTimestamp + parseInt(process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600) * 1000) {
      // Fetch fresh data if cache is expired or doesn't exist
      cachedData = await fetchData();
      cacheTimestamp = Date.now();
    }

    // Set Cache-Control header with max-age based on environment variable
    res.setHeader("Cache-Control", `max-age=${process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600}`);

    // Respond with cached data
    return res.json({ data: cachedData, msg: "Data fetched from cache!" });
  } catch (error) {
    console.error("Request error:", error);
    return res.status(500).json({ error: error.message });
  }
}
