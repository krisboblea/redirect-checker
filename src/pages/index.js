import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import DomainBlockPage from "./block";

export default function Home() {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage />;
    case 'check':
      return <RedirectCheckPage />;
    case 'redirect':
      return <RedirectCheckPage />;
    case 'block':
      return <DomainBlockPage />;
    default:
      return <UptimePage />;
  }
}