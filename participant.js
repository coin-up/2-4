import { db } from "./firebase-config.js";
import {
  ref,
  get,
  set,
  update
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const qrVideo = document.getElementById("qr-video");
const userIdSpan = document.getElementById("user-id");
const coinCountSpan = document.getElementById("coin-count");
const userInfo = document.getElementById("user-info");
const scanMessage = document.getElementById("scan-message");

let currentId = null;

const qrScanner = new Html5Qrcode("qr-video");
qrScanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async (decodedText) => {
    await qrScanner.stop();
    const id = decodedText.trim();
    currentId = id;
    loadUser(id);
  }
);

async function loadUser(id) {
  const userRef = ref(db, `players/${id}`);
  const snapshot = await get(userRef);
  let userData = snapshot.val();

  if (!userData) {
    userData = { coins: 10, nickname: id };
    await set(userRef, userData);
  }

  userIdSpan.textContent = id;
  coinCountSpan.textContent = userData.coins;
  userInfo.style.display = "block";
  scanMessage.style.display = "none";

  showNicknameEdit(userData.nickname);
}

function showNicknameEdit(nickname) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p>ニックネーム: <input type="text" id="nickname-input" value="${nickname}" /></p>
    <button id="save-nickname">保存</button>
  `;
  userInfo.appendChild(div);

  document.getElementById("save-nickname").addEventListener("click", async () => {
    const newName = document.getElementById("nickname-input").value;
    await update(ref(db, `players/${currentId}`), { nickname: newName });
    alert("ニックネームを変更しました！");
  });
}

// ランキングページに遷移
window.goToRanking = () => {
  localStorage.setItem("fromPage", "participant");
  location.href = "ranking.html";
};