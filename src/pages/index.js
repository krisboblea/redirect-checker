import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import DomainBlockPage from "./block";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchTranslationsFromApi, mergeI18nProps } from "@/utils";

const Home = () => {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage />;
    case 'check':
    case 'redirect':
      return <RedirectCheckPage />;
    case 'block':
      return <DomainBlockPage />;
    default:
      return <UptimePage />;
  }
}

export async function getStaticProps({ locale }) {
  const resources = await fetchTranslationsFromApi(locale);
  const baseTranslations = await serverSideTranslations(locale, ['common']);
  
  const data = mergeI18nProps(baseTranslations, resources, locale, 'common')
  
  return {
    props: data
  }
}

export default Home;
