const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/generate", async (req, res) => {
  const { html, width = 800, height = 1000 } = req.body;

  if (!html) return res.status(400).send("HTML content is required.");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const screenshot = await page.screenshot({ type: "png" });

  await browser.close();

  res.set("Content-Type", "image/png");
  res.send(screenshot);
});

app.get("/", (req, res) => {
  res.send("🟢 Puppeteer HTML to Image API is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
