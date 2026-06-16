const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = "47qg9DKj+Vr+Ns37Q7KBs7teDe6ns+nnE6N26gaVS0HLeru2sKfk0pRSjQ2uB5FFmMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w126ZAaFbKkikSbKZoY6So9Z2JuUdUCLClJ/X358aVytoRwdB04t89/1O/w1cDnyilFU=";

// 圖片
const IMAGE_URL =
  "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 防重複（避免重複觸發）
const handled = new Set();

// --------------------
// webhook
// --------------------
app.post("/webhook", (req, res) => {
  res.sendStatus(200);

  const events = req.body.events || [];

  for (const event of events) {
    handleEvent(event);
  }
});

// --------------------
// 事件處理
// --------------------
function handleEvent(event) {
  console.log("收到事件:", event.type);

  // 防重複 replyToken
  if (event.replyToken && handled.has(event.replyToken)) return;
  if (event.replyToken) handled.add(event.replyToken);

  // ❌ Bot 被加進群組：不要發圖
  if (event.type === "join") {
    console.log("bot加入群組，不發圖");
    return;
  }

  // ✅ 有人加入群組才發圖
  if (event.type === "memberJoined") {
    sendImage(event.replyToken);
  }
}

// --------------------
// 發圖
// --------------------
async function sendImage(replyToken) {
  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "image",
            originalContentUrl: IMAGE_URL,
            previewImageUrl: IMAGE_URL
          }
        ]
      })
    });
  } catch (err) {
    console.error("發送失敗:", err);
  }
}

// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("running on", PORT);
});