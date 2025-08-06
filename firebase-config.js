// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

export { db };