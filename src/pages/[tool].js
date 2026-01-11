import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import BlockChecker from "@/components/block-check/BlockChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaBan, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { fetchToolPagesForFooter, fetchToolPageBySlug, fetchAllToolPageSlugs } from "@/services/toolPageService";

// Map widget types to components
const WIDGET_COMPONENTS = {
  redirect: RedirectChecker,
  block: BlockChecker,
};

// Map icon names to icon components
const ICON_MAP = {
  FaLink,
  FaBan,
  FaSearch,
  FaExternalLinkAlt,
};

export default function ToolPage({ toolData, allToolPages = [] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, asPath } = router;

  if (!toolData) {
    return (
      <MainLayout toolPages={allToolPages}>
        <Head>
          <title>{`Tool Not Found | ${APP_NAME}`}</title>
        </Head>
        <AppContainer>
          <Box my={12} textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Tool not found
            </Heading>
            <Text fontSize="xl" color="gray.600">
              The tool you&apos;re looking for doesn&apos;t exist.
            </Text>
          </Box>
        </AppContainer>
      </MainLayout>
    );
  }

  const WidgetComponent = WIDGET_COMPONENTS[toolData.widget];
  const IconComponent = ICON_MAP[toolData.heroIcon] || FaLink;

  const pageTitle = toolData.metaTitle || `${toolData.title} | ${APP_NAME}`;
  const pageDescription = toolData.metaDescription || toolData.heroDescription;

  // Prepare FAQ data for schema
  const faqData = toolData.faqs || [];

  return (
    <MainLayout toolPages={allToolPages}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* hreflangs and canonical tag */}
        {generateHrefLangsAndCanonicalTag(locale, asPath)}

        {/* FAQ Schema */}
        {faqData.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqData.map(({ question, answer }) => ({
                  "@type": "Question",
                  "name": question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer
                  }
                }))
              })
            }}
          />
        )}

        {/* Custom Structured Data if provided */}
        {toolData.customStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: toolData.customStructuredData
            }}
          />
        )}
      </Head>

      <AppContainer>
        <Box my={12}>
          {/* Content Before Widget */}
          {toolData.contentBeforeWidget && toolData.contentBeforeWidget.length > 0 && (
            <Box mb={8}>
              <PortableText value={toolData.contentBeforeWidget} />
            </Box>
          )}

          {/* Widget Section */}
          <WidgetComponent
            icon={IconComponent}
            buttonText={toolData.buttonText || t('tool.check-button', 'Check')}
            examples={toolData.exampleUrls || []}
          >
            <Flex direction="column" align="center" textAlign="center">
              <Box {...styles.checkPage.heroBox}>
                <Icon as={IconComponent} {...styles.checkPage.heroIcon} />
              </Box>
              <Heading as="h1" {...styles.checkPage.heading}>
                {toolData.heroHeading}
              </Heading>
              {toolData.heroDescription && (
                <Text {...styles.checkPage.description}>
                  {toolData.heroDescription}
                </Text>
              )}
            </Flex>
          </WidgetComponent>

          {/* Content After Widget */}
          {toolData.contentAfterWidget && toolData.contentAfterWidget.length > 0 && (
            <Box
              mt={8}
              sx={{
                "& p": {
                  fontSize: { base: "md", md: "lg" },
                  lineHeight: "1.8",
                  color: "gray.700",
                  mb: 4,
                },
                "& h2": {
                  fontSize: { base: "2xl", md: "3xl" },
                  fontWeight: "bold",
                  mt: 8,
                  mb: 4,
                  color: "gray.900",
                },
                "& h3": {
                  fontSize: { base: "xl", md: "2xl" },
                  fontWeight: "bold",
                  mt: 6,
                  mb: 3,
                  color: "gray.900",
                },
                "& ul, & ol": {
                  pl: 6,
                  mb: 4,
                },
                "& li": {
                  fontSize: { base: "md", md: "lg" },
                  color: "gray.700",
                  mb: 2,
                },
              }}
            >
              <PortableText value={toolData.contentAfterWidget} />
            </Box>
          )}

          {/* FAQ Section */}
          {faqData.length > 0 && <FAQSection data={faqData} />}
        </Box>
      </AppContainer>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const tools = await fetchAllToolPageSlugs();

  const paths = tools.map((tool) => ({
    params: { tool: tool.slug },
    locale: tool.locale || "en",
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale }) {
  const slug = params.tool;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const toolData = await fetchToolPageBySlug(slug, locale || 'en');

  if (!toolData) {
    return {
      notFound: true,
    };
  }

  // Fetch all published tool pages for footer links
  const allToolPages = await fetchToolPagesForFooter(locale || 'en');

  return {
    props: {
      toolData,
      allToolPages,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 3600, // Revalidate every hour
  };
}
