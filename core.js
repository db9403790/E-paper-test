// ভোরের বাণী: Firebase সেটিং। নিচের ৪টা ঘরে আপনার Firebase প্রজেক্টের মান বসান।
// খালি রাখলে ডেমো মোড চলবে (ডেটা শুধু ওই ব্রাউজারে থাকে, পাসওয়ার্ড: admin123)
const FB = { apiKey: "AIzaSyAdAYyozUFupINNoISwL8nDj4jdUtOqxMc", authDomain: "e-paper-test.firebaseapp.com", projectId: "e-paper-test", appId: "1:46759552880:web:3448d915cf8d0197f391b5" };

const CATS = ["জাতীয়", "রাজনীতি", "আন্তর্জাতিক", "অর্থনীতি", "খেলা", "বিনোদন", "তথ্যপ্রযুক্তি", "শিক্ষা", "মতামত"];
const SLOTS = {
  top:  { name: "হেডার ব্যানার", size: "728×90", h: 90 },
  mid:  { name: "মাঝের ব্যানার", size: "970×90", h: 90 },
  side: { name: "সাইডবার", size: "300×250", h: 250 },
  art:  { name: "খবরের ভেতরের ব্যানার", size: "728×90", h: 90 }
};

const DEMO = !FB.apiKey;
let fs, au;
if (!DEMO) { firebase.initializeApp(FB); fs = firebase.firestore(); au = firebase.auth(); }
const LS = k => JSON.parse(localStorage.getItem("bb_" + k) || "{}");

const DB = {
  async all(c) {
    if (DEMO) return Object.entries(LS(c)).map(([id, v]) => ({ id, ...v }));
    const s = await fs.collection(c).get();
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async set(c, id, v) {
    if (DEMO) { const o = LS(c); o[id] = v; localStorage.setItem("bb_" + c, JSON.stringify(o)); return; }
    await fs.collection(c).doc(id).set(v);
  },
  async del(c, id) {
    if (DEMO) { const o = LS(c); delete o[id]; localStorage.setItem("bb_" + c, JSON.stringify(o)); return; }
    await fs.collection(c).doc(id).delete();
  },
  newId: () => Date.now().toString(36)
};

const Auth = {
  login(e, p) {
    if (DEMO) { if (p === "admin123") { sessionStorage.bb = 1; return Promise.resolve(); } return Promise.reject(); }
    return au.signInWithEmailAndPassword(e, p);
  },
  out() { DEMO ? sessionStorage.removeItem("bb") : au.signOut(); },
  watch(cb) { DEMO ? cb(!!sessionStorage.bb) : au.onAuthStateChanged(u => cb(!!u)); }
};

const E = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
