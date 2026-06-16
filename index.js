const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.LINE_TOKEN;
const IMAGE_URL = "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 🚀 webhook
app.post("/webhook", (req, res) => {

  // ✔ 一定先回 200（避免 timeout）
  res.sendStatus(200);

  const events = req.body.events || [];

  for (const event of events) {

    console.log("event:", event.type);

    // ✅ 只在「加入群組」才發圖
    if (event.type === "join") {
      sendImage(event.replyToken);
    }

    if (event.type === "memberJoined") {
      sendImage(event.replyToken);
    }
  }
});

// 🚀 發圖
function sendImage(replyToken) {
  axios.post(
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
  ).catch(err => {
    console.log(err.response?.data || err.message);
  });
}

// 測試
app.get("/", (req, res) => {
  res.send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running");
});