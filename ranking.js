// ranking.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAweBQJ17LYvPsfYUCBLygwdehoTEOrsiQ",
  authDomain: "project-7411251555753678403.firebaseapp.com",
  databaseURL: "https://project-7411251555753678403-default-rtdb.firebaseio.com",
  projectId: "project-7411251555753678403",
  storageBucket: "project-7411251555753678403.appspot.com",
  messagingSenderId: "172462885590",
  appId: "1:172462885590:web:bf2ca6b6e7e668f1445777"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const rankingList = document.getElementById("rankingList");
const backButton = document.getElementById("backButton");

function switchRanking(type) {
  const path = type === "session" ? "sessionRanking" : "totalRanking";
  const rankingRef = ref(db, path);

  onValue(rankingRef, (snapshot) => {
    const data = snapshot.val();
    const sorted = [];

    for (const id in data) {
      sorted.push({ id, coins: data[id].coins, nickname: data[id].nickname || id, retired: data[id].retired });
    }

    sorted.sort((a, b) => b.coins - a.coins);

    rankingList.innerHTML = "";
    for (const entry of sorted) {
      const li = document.createElement("li");
      li.textContent = `${entry.nickname}：${entry.coins}枚${entry.retired ? "（確定）" : ""}`;
      rankingList.appendChild(li);
    }
  });
}

window.switchRanking = switchRanking;

// 初期状態はセッションランキング
switchRanking("session");

// 戻るボタンの動作
window.addEventListener("DOMContentLoaded", () => {
  const fromPage = localStorage.getItem("fromPage");
  if (fromPage === "admin") {
    backButton.href = "admin.html";
  } else if (fromPage === "admin_reset") {
    backButton.href = "admin_reset.html";
  } else if (fromPage === "participant") {
    backButton.href = "participant.html";
  } else {
    backButton.href = "index.html";
  }
});