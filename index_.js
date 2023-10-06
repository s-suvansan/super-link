// index.mjs (use the .mjs file extension for ES6 modules)
import clipboard from "clipboardy";

import express from "express";
import axios from "axios";
import path from "path";
import requestIP from "request-ip";

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
  const xclientIP = req.header("x-forwarded-for");
  const clientIP = req.socket.remoteAddress;
  const ip = req.ip;
  const ipAddress = requestIP.getClientIp(req);
  try {
    const userAgent = req.headers["user-agent"].toLowerCase();

    const ipv6 = await axios.get(`https://api64.ipify.org/`);
    const response = await axios.get(
      `https://short-link-py7b.onrender.com/${shortCode}`
      //   `http://localhost:3500/${shortCode}`
    );
    var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    // clipboard.writeSync(`${fullUrl} ${shortCode}`);
    // Dynamic data for OG tags
    const pageTitle = response.data.title || "";
    const pageDescription = response.data.desc || "";
    const pageImageURL = response.data.image || "";
    const pageUrl = response.data.longUrl || "";
    let redirectUrl = "";
    if (userAgent.includes("android")) {
      // Redirect to the Google Play Store URL for your app
      // redirectUrl =
      //   "https://play.google.com/store/apps/details?id=unicom.demotown";
      // redirectUrl = `quizsl://open/${shortCode}`;
      redirectUrl =
        "https://play.google.com/store/apps/details?id=com.letslearn.quizsl&hl=en&gl=US";
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
              // window.location.href = '${redirectUrl}';
              // document.getElementById("p1").innerHTML = '${ipv6.data}';
            </script>
          </head>
          <body>
           <input type="text" value="Hello World" id="myInput" />

           <!-- The button used to copy the text -->
           <button onclick="myFunction()">Copy text</button>
           <script>
             myFunction();
             function myFunction() {
               // Get the text field
               var copyText = document.getElementById("myInput");
               copyText.value = "dasnfciasdfiasudf asdoifboisa asidfiuoa";
               // Select the text field
               copyText.select();
               copyText.setSelectionRange(0, 99999); // For mobile devices
       
               // Copy the text inside the text field
               navigator.clipboard.writeText(copyText.value);
       
               // Alert the copied text
               // alert("Copied the text: " + copyText.value);
             }
           </script>
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
