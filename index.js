// index.js
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    const response = await axios.get(
      `https://short-link-py7b.onrender.com/${shortCode}`
    );

    // Dynamic data for OG tags
    const pageTitle = response.data.title || "";
    const pageDescription = response.data.desc || "";
    const pageImageURL = response.data.image || "";
    const pageUrl = response.data.longUrl || "";

    // Generate the HTML with dynamic OG tags
    const html = `
          <!DOCTYPE html>
          <html prefix="og: https://ogp.me/ns#">
          <head>
              <meta charset="UTF-8">
              <title>${pageTitle}</title>
              <meta name="description" content="${pageDescription}">
              
              <!-- Open Graph tags -->
              <meta property="og:title" content="${pageTitle}">
              <meta property="og:description" content="${pageDescription}">
              <meta property="og:image" content="${pageImageURL}">
              <script>
              var userAgent = navigator.userAgent.toLowerCase();
              if (userAgent.includes("android")) {
                // Redirect to the Play Store URL for your app
                window.location.href = 'https://play.google.com/store/apps/details?id=unicom.demotown';
              } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
                // Redirect to the Play Store URL for your app
                window.location.href = 'https://apps.apple.com/gb/app/demotown/id1548418952';
              } else {
                // Redirect to your desktop website or a different URL
                window.location.href = '${pageUrl}';
              }
            </script>
          </head>
          <body>
              Super Link Loading......
          </body>
          </html>
        `;

    // Send the HTML as a response
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and extract metadata" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
