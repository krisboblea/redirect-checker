import { Box } from "@chakra-ui/react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FooterWithLinks from "@/components/common/FooterWithLinks";

export default function MainLayout({ children, toolPages = [], companyPages = [] }) {
  // Use enhanced footer if tool pages or company pages are provided, otherwise use simple footer
  const FooterComponent = (toolPages.length > 0 || companyPages.length > 0) ? FooterWithLinks : Footer;

  return (
    <Box>
      <Header />
      <main>{children}</main>
      <FooterComponent toolPages={toolPages} companyPages={companyPages} />
    </Box>
  );
}