import { Box, Button, Center, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import CardList from "@/components/uptime/CardList";
import DataSources from "@/components/uptime/DataSources";
import { styles } from "@/configs/uptime";

export default function UptimeWidget({
  children,           // Hero content from [tool].js
  services,           // Comma-separated service IDs from widgetConfig (e.g., "yy6y,ps0k,peet")
  showDataSources = "true",  // From widgetConfig
  ctaUrl = "https://www.redirhub.com",  // From widgetConfig
  ctaText,            // From widgetConfig (optional)
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [sitesData, setSitesData] = useState({ nodes: {}, sites: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse services string into array
  const serviceIds = services
    ? services.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    async function fetchDataSources() {
      try {
        setIsLoading(true);
        setError(null);

        // Build API params
        const params = {};

        // Priority 1: Use page slug for service configuration
        if (router.query.tool) {
          params.slug = router.query.tool;
        }
        // Priority 2: Use services from widgetConfig (backward compatibility)
        else if (serviceIds.length > 0) {
          params.services = serviceIds.join(',');
        }

        const apiResponse = await axios.get("/api/uptime", { params });
        setSitesData(apiResponse.data.data);
      } catch (error) {
        console.error("Error fetching uptime data:", error);
        setError(t('tool.uptime-error', 'Failed to load uptime data. Please try again later.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDataSources();
  }, [router.query.tool, services, serviceIds, t]);

  // Filter sites based on serviceIds if API doesn't filter
  // (This is a safety fallback in case API filtering isn't working)
  const filteredSites = serviceIds.length > 0 && sitesData.sites
    ? sitesData.sites.filter(site => serviceIds.includes(site[0]?.token))
    : sitesData.sites;

  return (
    <>
      {/* Hero section passed from [tool].js */}
      {children}

      {/* Error message */}
      {error && (
        <Alert status="error" borderRadius="md" my={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Uptime comparison cards */}
      <Box my={12}>
        <CardList sitesData={filteredSites} isLoading={isLoading} />
      </Box>

      {/* Optional CTA button */}
      {ctaUrl && (
        <Center my={12}>
          <Button
            as="a"
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...styles.getStartedButton}
          >
            {ctaText || t('tool.get-started', 'Get started with RedirHub')}
          </Button>
        </Center>
      )}

      {/* Optional data sources section */}
      {showDataSources === "true" && (
        <DataSources sitesData={sitesData.nodes} />
      )}
    </>
  );
}
