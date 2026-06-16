const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "qL3EOBIM4T+WQdBW7rakYg2D4FLYe8hFI+LqWQCRNDSLwvv7N8pKWKUWLEsmCODumMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125JK11csYm2Ia/HkecHQK+kxqtWdnlYpltLldPr3jnDSwdB04t89/1O/w1cDnyilFU=";

const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 🚀 webhook
app.post("/webhook", (req, res) => {

  // ✅ 1. 立刻回 LINE（最重要）
  res.sendStatus(200);

  const events = req.body.events || [];

  // ✅ 2. 不要 async / await 在 loop
  for (const event of events) {

    console.log("event:", event.type);

    // 👉 進群事件
    if (event.type === "join" || event.type === "memberJoined") {
      sendImage(event.replyToken);
    }

    // 👉 測試：任何訊息都回（建議你先用這個測）
    if (event.type === "message") {
      sendImage(event.replyToken);
    }
  }
});

// 🚀 發圖（獨立出去）
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        }
      }
    );
  } catch (err) {
    console.log("LINE error:", err.response?.data || err.message);
  }
}

// 測試頁
app.get("/", (req, res) => {
  res.send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running");
});