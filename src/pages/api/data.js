import { fetchData } from "./fetch";

export default async function handler(req, res) {
  try {
    const data = await fetchData();

    res.setHeader("Cache-Control", `max-age=${process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600}`);

    return res.json({ data, msg: "Data fetched from API!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
