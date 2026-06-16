const express = require("express");
const app = express();

app.use(express.json());

// ✔ 測試用
app.get("/", (req, res) => {
  res.send("OK");
});

// ✔ LINE webhook（關鍵）
app.post("/webhook", (req, res) => {
  console.log("收到LINE事件：", req.body);

  // ⚠️ 一定要回 200
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running on port", port);
});