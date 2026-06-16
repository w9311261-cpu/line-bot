const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "qL3EOBIM4T+WQdBW7rakYg2D4FLYe8hFI+LqWQCRNDSLwvv7N8pKWKUWLEsmCODumMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125JK11csYm2Ia/HkecHQK+kxqtWdnlYpltLldPr3jnDSwdB04t89/1O/w1cDnyilFU=";

const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// ✔ webhook
app.post("/webhook", async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {

    console.log("event type:", event.type);

    // ✔ 收訊息就回（先測成功）
    if (event.type === "message") {

      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken: event.replyToken,
          messages: [
            {
              type: "image",
              originalContentUrl: IMAGE_URL,
              previewImageUrl: IMAGE_URL
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
          }
        }
      );
    }
  }

  res.sendStatus(200);
});

// ✔ 測試網站
app.get("/", (req, res) => {
  res.send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running");
});