import { readJsonSync } from "fs-extra"
import path from "node:path";


export default function handler( req, res ) {
  // if data is not there
  // run fetchData
  
  const data = readJsonSync( path.join(__dirname, '/checks.json'));
  return res.json({ data: data })
}