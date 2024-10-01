export async function checkBlocks({ urlList, setProgress, toast, setResults }) {
    const totalUrls = urlList.length;

    for (let i = 0; i < totalUrls; i++) {
        try {
            const response = await fetch("/api/block", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: urlList[ i ] }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch block data for ${urlList[ i ]}`);
            }

            const data = await response.json();
            const result = {
                url: urlList[ i ],
                http_pass: data.http_pass,
                https_pass: data.https_pass,
                total_time: data.total_time,
            };
            setResults((prevResults) => Array.isArray(prevResults) ? [ ...prevResults, result ] : [ result ]); // Ensure prevResults is an array
        } catch (error) {
            const result = {
                url: urlList[ i ],
                http_pass: false,
                https_pass: false,
                total_time: "N/A",
            };
            setResults((prevResults) => Array.isArray(prevResults) ? [ ...prevResults, result ] : [ result ]); // Ensure prevResults is an array

            toast({
                title: "Error",
                description: `Failed to check ${urlList[ i ]}: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setProgress(((i + 1) / totalUrls) * 100);
        }
    }

}