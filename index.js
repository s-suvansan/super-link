// index.js
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve the assetlinks.json file from a specific route
app.get("/.well-known/assetlinks.json", (req, res) => {
  console.log(path.join(__dirname, ".well-known/assetlinks.json"));
  res.sendFile(path.join(__dirname, ".well-known/assetlinks.json"));
});

app.get("/.well-known/apple-app-site-association", (req, res) => {
  console.log(path.join(__dirname, ".well-known/apple-app-site-association"));
  res.sendFile(path.join(__dirname, ".well-known/apple-app-site-association"));
});

app.get("/apple-app-site-association", (req, res) => {
  console.log(path.join(__dirname, "apple-app-site-association"));
  res.sendFile(path.join(__dirname, "apple-app-site-association"));
});

app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    const userAgent = req.headers["user-agent"].toLowerCase();
    const response = await axios.get(
      `https://short-link-py7b.onrender.com/${shortCode}`
      // `http://localhost:3500/${shortCode}`
    );

    // Dynamic data for OG tags
    const pageTitle = response.data.title || "";
    const pageDescription = response.data.desc || "";
    const pageImageURL = response.data.image || "";
    const pageUrl = response.data.longUrl || "";
    let redirectUrl = "";
    if (userAgent.includes("android")) {
      // Redirect to the Google Play Store URL for your app
      redirectUrl =
        "https://play.google.com/store/apps/details?id=unicom.demotown";
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      // Redirect to the App Store URL for your app
      redirectUrl = "https://apps.apple.com/gb/app/demotown/id1548418952";
    } else {
      // Redirect to a web page for other devices
      redirectUrl = pageUrl;
    }
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
              // var userAgent = navigator.userAgent.toLowerCase();
              // if (userAgent.includes("android")) {
              //   window.location.href = 'https://play.google.com/store/apps/details?id=unicom.demotown';
              // } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
              //   window.location.href = 'https://apps.apple.com/gb/app/demotown/id1548418952';
              // } else {
                // window.location.href = '${pageUrl}';
              // }
              window.location.href = '${redirectUrl}';
            </script>
          </head>
          <body>
              Super Link Loading......
          </body>
          </html>
        `;

    res.send(html);
    // Send the HTML as a response
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* if (
      userAgent.includes("mozilla") ||
      userAgent.includes("chrome") ||
      userAgent.includes("safari") ||
      userAgent.includes("applewebkit") ||
      userAgent.includes("edg")
    ) */
