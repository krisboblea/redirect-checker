import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./check";
import UptimePage from "./uptime";

export default function Home() {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage />;
    case 'check':
      return <RedirectCheckPage />;
    default:
      return <UptimePage />;
  }
}