const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔑 換成你的 Channel Access Token
const TOKEN = "qL3EOBIM4T+WQdBW7rakYg2D4FLYe8hFI+LqWQCRNDSLwvv7N8pKWKUWLEsmCODumMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125JK11csYm2Ia/HkecHQK+kxqtWdnlYpltLldPr3jnDSwdB04t89/1O/w1cDnyilFU=";

// 🖼️ 圖片（你的 R2 圖）
const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 🚀 webhook
app.post("/webhook", (req, res) => {
  // ⚠️ 先回 200（避免 LINE timeout）
  res.sendStatus(200);

  const events = req.body.events || [];

  events.forEach(async (event) => {
    console.log("event type:", event.type);

    try {

      // ✅ Bot 被加入群組 / 朋友
      if (event.type === "join") {
        await sendImage(event.replyToken);
      }

      // ⚠️ 有些群組會用 memberJoined
      if (event.type === "memberJoined") {
        await sendImage(event.replyToken);
      }

    } catch (err) {
      console.log("error:", err.response?.data || err.message);
    }
  });
});

// 📦 發圖片函式
async function sendImage(replyToken) {
  return axios.post(
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
}

// 🟢 測試用
app.get("/", (req, res) => {
  res.send("LINE bot is running");
});

// 🔥 Render 必須這樣寫
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running on", port);
});