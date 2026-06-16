const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "qL3EOBIM4T+WQdBW7rakYg2D4FLYe8hFI+LqWQCRNDSLwvv7N8pKWKUWLEsmCODumMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125JK11csYm2Ia/HkecHQK+kxqtWdnlYpltLldPr3jnDSwdB04t89/1O/w1cDnyilFU=";

const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg"; // 換成可公開圖片

app.post("/webhook", async (req, res) => {
  const events = req.body.events;

  for (const event of events) {

    // 👉 有人加入群組
    if (event.type === "memberJoined") {
      
      const replyToken = event.replyToken;

      await axios.post("https://api.line.me/v2/bot/message/reply", {
        replyToken: replyToken,
        messages: [
          {
            type: "image",
            originalContentUrl: IMAGE_URL,
            previewImageUrl: IMAGE_URL
          }
        ]
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        }
      });
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot running...");
});