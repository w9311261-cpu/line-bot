const express = require("express");

const app = express();
app.use(express.json());

// Render 環境變數
const TOKEN = "RUMfr7ceblcmyCJrpkjDScRR4Qr64RGfSgjYz/XZcNJpxFXl5T1Dfhp+MZaf2SU3mMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w125Xc51g/IApMGVGYRkNRn0owpXB0CWvv+5CfCgd5guTBgdB04t89/1O/w1cDnyilFU=";

// 歡迎圖片
const IMAGE_URL =
  "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 首頁測試
app.get("/", (req, res) => {
  res.send("LINE Bot Running");
});

// LINE Webhook
app.post("/webhook", async (req, res) => {

  // 一定要先回 200，避免 timeout
  res.sendStatus(200);

  const events = req.body.events || [];

  for (const event of events) {

    console.log("收到事件:", event.type);

    // Bot 被加入群組
    if (event.type === "join") {
      sendWelcomeImage(event.replyToken);
    }

    // 有人加入群組（若 LINE 有送此事件）
    if (event.type === "memberJoined") {
      sendWelcomeImage(event.replyToken);
    }
  }
});

// 發送歡迎圖片
async function sendWelcomeImage(replyToken) {
  try {

    const response = await fetch(
      "https://api.line.me/v2/bot/message/reply",
      {
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
      }
    );

    const result = await response.text();
    console.log("LINE 回應:", result);

  } catch (error) {
    console.error("發送失敗:", error);
  }
}

// Render Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});