import { db } from "./firebase-config.js";
import {
  ref,
  get,
  update
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const adminQrVideo = document.getElementById("admin-qr-video");
const userQrVideo = document.getElementById("user-qr-video");
const userInfo = document.getElementById("user-info");
const scanMessage = document.getElementById("user-scan-message");

const userIdSpan = document.getElementById("target-user-id");
const coinCountSpan = document.getElementById("target-user-coins");

let currentTargetId = null;

// 管理者QRログイン（IDが "admin" の場合のみ許可）
const adminScanner = new Html5Qrcode("admin-qr-video");
adminScanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async (decodedText) => {
    const adminId = decodedText.trim();
    if (adminId !== "admin") {
      alert("無効な管理者IDです");
      return;
    }
    await adminScanner.stop();
    document.getElementById("admin-auth").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    startUserScanner();
  }
);

// 参加者QRスキャナー開始
function startUserScanner() {
  const userScanner = new Html5Qrcode("user-qr-video");
  userScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      await userScanner.stop();
      const id = decodedText.trim();
      currentTargetId = id;
      loadUser(id);
    }
  );
}

// ユーザー情報読み込み
async function loadUser(id) {
  const userRef = ref(db, `players/${id}`);
  const snapshot = await get(userRef);
  let data = snapshot.val();

  if (!data) {
    data = { coins: 10, nickname: id };
    await update(userRef, data);
  }

  userIdSpan.textContent = id;
  coinCountSpan.textContent = data.coins;
  userInfo.style.display = "block";
  scanMessage.style.display = "none";
}

// コイン加算・減算・乗算
window.adjustCoins = async (delta) => {
  if (!currentTargetId) return;
  const userRef = ref(db, `players/${currentTargetId}`);
  const snapshot = await get(userRef);
  const data = snapshot.val();
  const newCoins = data.coins + delta;
  await update(userRef, { coins: newCoins });
  coinCountSpan.textContent = newCoins;
};

window.multiplyCoins = async (multiplier) => {
  if (!currentTargetId) return;
  const userRef = ref(db, `players/${currentTargetId}`);
  const snapshot = await get(userRef);
  const data = snapshot.val();
  const newCoins = data.coins * multiplier;
  await update(userRef, { coins: newCoins });
  coinCountSpan.textContent = newCoins;
};

// ランキングページへ
window.goToRanking = () => {
  localStorage.setItem("fromPage", "admin");
  location.href = "ranking.html";
};