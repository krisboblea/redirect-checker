import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAllPagesForFooter } from "@/services/pageService";

const Home = ({ pages = [] }) => {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage pages={pages} />;
    case 'check':
    case 'redirect':
      return <RedirectCheckPage pages={pages} />;
    case 'block':
      // Block page is now managed by CMS at /block
      return <RedirectCheckPage pages={pages} />;
    default:
      return <UptimePage pages={pages} />;
  }
}

export async function getStaticProps({ locale }) {
  const pages = await fetchAllPagesForFooter(locale);

  return {
    props: {
        pages,
        ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 3600, // Revalidate every hour to pick up new pages
  };
}

export default Home;
