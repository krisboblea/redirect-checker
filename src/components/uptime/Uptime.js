import { Box, Button, Center } from "@chakra-ui/react";
import CardList from "@/components/uptime/CardList";
import DataSources from "@/components/uptime/DataSources";
import { useEffect, useState } from "react";
import axios from "axios";
import { styles } from "@/configs/uptime";

export default function Uptime() {
    const [ sitesData, setSitesData ] = useState({
        nodes: {},
        sites: []
    });

    async function fetchDataSources() {
        try {
            const apiRouteResponse = await axios.get("api/uptime");
            setSitesData(apiRouteResponse.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataSources();
    }, []);

    return (
        <>
            <Box my={12}>
                <CardList sitesData={sitesData?.sites} />
            </Box>
            <Center my={12}>
                <Button
                    href="https://www.redirhub.com"
                    {...styles.getStartedButton}
                >
                    Get started with RedirHub
                </Button>
            </Center>
            <DataSources sitesData={sitesData?.nodes} />
        </>
    );
}