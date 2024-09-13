import { Box } from "@chakra-ui/react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }) {
  return (
    <Box>
      <Header />
      <main>{children}</main>
      <Footer />
    </Box>
  );
}