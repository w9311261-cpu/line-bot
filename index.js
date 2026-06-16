const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "qL3EOBIM4T+WQdBW7rakYg2D4FLYe8hFI+LqWQCRNDSLwvv7N8pKWKUWLEsmCODumMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125JK11csYm2Ia/HkecHQK+kxqtWdnlYpltLldPr3jnDSwdB04t89/1O/w1cDnyilFU=";

const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

app.post("/webhook", (req, res) => {
  // ✅ 1. 一定先回 200（避免 timeout）
  res.sendStatus(200);

  const events = req.body.events || [];

  // ❗ 不用 forEach async（改 for...of）
  for (const event of events) {

    console.log("event:", event.type);

    if (event.type === "join" || event.type === "memberJoined") {
      sendImage(event.replyToken);
    }
  }
});

// 🚀 發圖函式（獨立出去）
async function sendImage(replyToken) {
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken,
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
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.log("LINE reply error:", err.response?.data || err.message);
  }
}

// 測試
app.get("/", (req, res) => {
  res.send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running on", port);
});