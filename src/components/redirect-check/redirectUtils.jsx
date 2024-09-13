export async function checkRedirects(urlList, setProgress, toast) {
  const results = [];
  const totalUrls = urlList.length;

  for (let i = 0; i < totalUrls; i++) {
    try {
      const response = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlList[i] }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch redirect data for ${urlList[i]}`);
      }

      const data = await response.json();
      if (data[0].succeed) {
      results.push({
        url: urlList[i],
        chainNumber: data.filter(item => /^30\d/.test(item.http_code)).length,
        statusCode: data[0].http_code,
        finalUrl: data[data.length - 1].url,
        totalTime: data.slice(0, data.length > 1 ? data.length - 1 : 1).reduce((sum, item) => sum + (item.alltime || 0), 0),
          chain: data,
        });
      } else {
        results.push({
          url: urlList[i],
          chainNumber: 0,
          statusCode: data[0]?.error_no,
          totalTime: 0,
          error_no: data[0]?.error_no,
          error_msg: data[0]?.error_msg,
          chain: data,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProgress(((i + 1) / totalUrls) * 100);
    }
  }

  return results;
}