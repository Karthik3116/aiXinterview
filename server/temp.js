// temp.js
const axios = require("axios");
const tough = require("tough-cookie");

(async () => {
  // Dynamically import the ES‐module “wrapper” function
  const { wrapper } = await import("axios-cookiejar-support");

  // Create a cookie jar (tough-cookie)
  const cookieJar = new tough.CookieJar();

  // Wrap an axios instance so it uses our cookieJar
  const client = wrapper(
    axios.create({
      jar: cookieJar,
      withCredentials: true, // <— send cookies on cross‐domain redirects
    })
  );

  try {
    const response = await client.get("https://grokbot.streamlit.app/", {
      maxRedirects: 10,
      headers: {
        // Fake a desktop Chrome UA so Streamlit doesn’t block you
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/115.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9," +
          "image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://grokbot.streamlit.app/",
      },
      timeout: 15000,
    });

    console.log("Final Status:", response.status);
    console.log("Final URL:", response.request.res.responseUrl);
    console.log("\nHTML snippet (first 500 chars):\n");
    console.log(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        "Error Response:",
        err.response.status,
        err.response.headers.location || ""
      );
      console.error("Body:\n", err.response.data);
    } else {
      console.error("Error Message:", err.message);
    }
  }
})();
