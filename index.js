const express = require("express");
const app = express();

app.use(express.json());

const TOKEN = "47qg9DKj+Vr+Ns37Q7KBs7teDe6ns+nnE6N26gaVS0HLeru2sKfk0pRSjQ2uB5FFmMQyK5JS/bE8nq55IBOJ9ZRvWI8fUofjzPh4pf0w126ZAaFbKkikSbKZoY6So9Z2JuUdUCLClJ/X358aVytoRwdB04t89/1O/w1cDnyilFU=";

const IMAGE_URL =
  "https://pub-6dd82b21024644948b7876ea8084873a.r2.dev/IMG_7409.jpeg";

// 🧠 防重複
const usedReply = new Set();

// 🧠 群組冷卻（防刷）
const groupCooldown = new Map();

// --------------------
app.post("/webhook", (req, res) => {
  res.sendStatus(200);

  const events = req.body.events || [];

  for (const event of events) {
    handleEvent(event);
  }
});

// --------------------
function handleEvent(event) {
  if (!event.replyToken) return;

  // 防重複 event
  if (usedReply.has(event.replyToken)) return;
  usedReply.add(event.replyToken);

  // =========================
  // 🤖 bot 被加入群組：不做事
  // =========================
  if (event.type === "join") {
    console.log("bot join group -> ignore");
    return;
  }

  // =========================
  // 👤 人加入群組：發圖
  // =========================
  if (event.type === "memberJoined") {
    const groupId = event.source?.groupId;

    safeSendImage(event.replyToken, groupId);
  }
}

// --------------------
// 🛡️ 發圖（防風控版）
// --------------------
function safeSendImage(replyToken, groupId) {
  const now = Date.now();

  // 🧠 群組限速（10 秒內只允許一次）
  if (groupId) {
    const last = groupCooldown.get(groupId) || 0;
    if (now - last < 10000) {
      console.log("cooldown skip");
      return;
    }
    groupCooldown.set(groupId, now);
  }

  // 🧠 隨機延遲（避免機器行為）
  const delay = Math.floor(Math.random() * 2000) + 1000;

  setTimeout(async () => {
    try {
      const res = await fetch("https://api.line.me/v2/bot/message/reply", {
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

      const text = await res.text();
      console.log("LINE 回應:", text);

    } catch (err) {
      console.error("send image error:", err);
    }
  }, delay);
}

// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("bot running on", PORT);
});