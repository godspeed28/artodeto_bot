require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("❌ TELEGRAM_TOKEN belum diset di file .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log("✅ Bot sedang berjalan...");

// ==========================
// FUNGSI BANTUAN
// ==========================
function getUserInfo(msg) {
  const user = msg.from;
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name || "",
    username: user.username || "",
    languageCode: user.language_code || "tidak diketahui",
  };
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function sendAndLog(chatId, text, options = {}) {
  console.log(`Bot: ${text}`);
  bot.sendMessage(chatId, text, options);
}

// ==========================
// COMMANDS
// ==========================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  const text = "/start";
  console.log(`User (${user.firstName}): ${text}`);

  const response =
    `Halo ${user.firstName}! 👋\n` +
    "Saya adalah chatbot Telegram yang dibuat pakai Node.js\n\n" +
    "Ketik /help untuk melihat perintah yang tersedia";
  sendAndLog(chatId, response);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  const text = "/help";
  console.log(`User (${user.firstName}): ${text}`);

  const response =
    `📋 *Menu Bantuan untuk ${user.firstName}*\n\n` +
    "Berikut perintah yang tersedia:\n" +
    "/start - Memulai bot\n" +
    "/help - Menampilkan bantuan\n" +
    "/whoami - Info akun Anda\n" +
    "/info - Informasi tentang bot\n" +
    "/time - Waktu saat ini\n" +
    "/cuaca <nama kota> - Cek cuaca saat ini\n" +
    "/quote - Kutipan motivasi\n" +
    "/joke - Lelucon receh\n" +
    "/fact - Fakta menarik\n" +
    "/echo <teks> - Mengulang pesan\n\n" +
    "Ketik angka 1–5 untuk bermain tebak angka 🎲";
  sendAndLog(chatId, response, { parse_mode: "Markdown" });
});

bot.onText(/\/whoami/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  const text = "/whoami";
  console.log(`User (${user.firstName}): ${text}`);

  const response =
    `👤 Informasi Anda:\n` +
    `ID: ${user.id}\n` +
    `Nama: ${user.firstName} ${user.lastName}\n` +
    `Username: ${user.username}\n` +
    `Bahasa: ${user.languageCode}`;
  sendAndLog(chatId, response);
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const text = "/info";
  console.log(`User: ${text}`);
  sendAndLog(
    chatId,
    "🤖 Bot demo dibuat dengan Node.js + node-telegram-bot-api.\nVersi: 1.0.0\nDibuat oleh @abekolin"
  );
});

bot.onText(/\/time/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  const text = "/time";
  console.log(`User (${user.firstName}): ${text}`);

  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  sendAndLog(chatId, `🕒 Sekarang: ${now}`);
});

bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const user = getUserInfo(callbackQuery);

  console.log(`User (${user.firstName}) klik tombol: ${data}`);

  if (data === "info") {
    sendAndLog(
      msg.chat.id,
      "📄 Bot ini dibuat sebagai proyek belajar Node.js + Telegram Bot API."
    );
  } else if (data === "time") {
    const waktu = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    sendAndLog(msg.chat.id, `🕒 Sekarang: ${waktu}`);
  } else if (data === "whoami") {
    sendAndLog(
      msg.chat.id,
      `👤 Anda adalah ${user.firstName} ${user.lastName}`
    );
  }
});

// ==========================
// FITUR LAIN
// ==========================
const quotes = [
  "Jangan menyerah, awal yang sulit sering membawa hasil yang manis 🍯",
  "Setiap hari adalah kesempatan baru untuk menjadi lebih baik 💪",
];

bot.onText(/\/quote/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  console.log(`User (${user.firstName}): /quote`);
  const quote = getRandomResponse(quotes);
  sendAndLog(chatId, `💡 *Kutipan Hari Ini:*\n\n_${quote}_`, {
    parse_mode: "Markdown",
  });
});

const jokes = [
  "Kenapa ayam menyebrang jalan? Karena dia bosan di sisi yang itu. 🐔",
  "Apa bedanya kamu dan alarm? Alarm bisa bikin aku bangun, kamu cuma bikin aku baper. 😆",
];

bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  console.log(`User (${user.firstName}): /joke`);
  const joke = getRandomResponse(jokes);
  sendAndLog(chatId, `🤣 ${joke}`);
});

const facts = [
  "Lebah dapat mengenali wajah manusia 🐝",
  "Gajah tidak bisa melompat 🐘",
];

bot.onText(/\/fact/, (msg) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  console.log(`User (${user.firstName}): /fact`);
  const fact = getRandomResponse(facts);
  sendAndLog(chatId, `🧠 Fakta Menarik:\n\n${fact}`);
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const user = getUserInfo(msg);
  const echoMsg = match[1];
  console.log(`User (${user.firstName}): /echo ${echoMsg}`);
  sendAndLog(chatId, `🔁 Kamu bilang: ${echoMsg}`);
});

bot.onText(/^[1-5]$/, (msg) => {
  const chatId = msg.chat.id;
  const userNum = parseInt(msg.text);
  const botNum = Math.floor(Math.random() * 5) + 1;
  const user = getUserInfo(msg);

  console.log(`User (${user.firstName}) menebak angka: ${userNum}`);

  if (userNum === botNum) {
    sendAndLog(chatId, `🎉 Hebat! Kamu menebak angka ${botNum} dengan benar!`);
  } else {
    sendAndLog(chatId, `🙃 Salah tebak! Aku memilih angka ${botNum}`);
  }
});

bot.onText(/apakah namaku (.+)/i, (msg, match) => {
  const chatId = msg.chat.id;
  const nameGuess = match[1];
  const user = getUserInfo(msg);
  const realName = `${user.firstName} ${user.lastName}`.toLowerCase();

  console.log(`User (${user.firstName}): apakah namaku ${nameGuess}`);

  if (realName.includes(nameGuess.toLowerCase())) {
    sendAndLog(chatId, `✅ Betul! Nama kamu memang ada unsur '${nameGuess}'`);
  } else {
    sendAndLog(chatId, `❌ Sepertinya bukan. Namamu bukan '${nameGuess}'`);
  }
});
bot.onText(/\/cuaca (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const kota = match[1];
  const user = getUserInfo(msg);

  console.log(`User (${user.firstName}): /cuaca ${kota}`);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    kota
  )}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    const cuaca = data.weather[0].description;
    const suhu = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    const pesan =
      `🌦️ Cuaca di *${data.name}*\n\n` +
      `• Cuaca: *${cuaca}*\n` +
      `• Suhu: *${suhu}°C* (terasa seperti ${feelsLike}°C)\n` +
      `• Kelembapan: ${humidity}%\n` +
      `• Angin: ${wind} m/s`;

    sendAndLog(chatId, pesan, { parse_mode: "Markdown" });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      sendAndLog(
        chatId,
        `⚠️ Kota *"${kota}"* tidak ditemukan. Periksa kembali penulisan namanya.`,
        { parse_mode: "Markdown" }
      );
    } else {
      sendAndLog(chatId, `❌ Gagal mengambil data cuaca. Coba lagi nanti.`);
    }
    console.error("Gagal ambil cuaca:", error.message);
  }
});

// ==========================
// RESPON UMUM
// ==========================
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const user = getUserInfo(msg);

  // Hindari perintah (command)
  if (text.startsWith("/")) return;

  console.log(`User (${user.firstName}): ${text}`);

  const responses = {
    capek: "😥 Semangat ya! Jangan lupa istirahat sebentar.",
    bosan: "📚 Coba cari hal baru yang seru! Atau ketik /joke buat hiburan.",
    sedih: "😔 Sedih itu manusiawi. Kamu hebat karena tetap bertahan.",
    galau: "💔 Tenang... semua akan baik-baik saja. Fokus ke dirimu dulu ya.",
    bingung:
      "🤔 Kalau bingung, coba tulis apa yang kamu rasakan. Mungkin bisa membantu.",
    "terima kasih": "Sama-sama! 😊",
    makasih: "Sama-sama! 😊",
    "siapa kamu": "Saya adalah bot Telegram yang dibuat untuk menemani kamu 😄",
    "siapa saya": `Anda adalah ${user.firstName} ${user.lastName}`,
  };

  for (const keyword in responses) {
    if (text.toLowerCase().includes(keyword)) {
      sendAndLog(chatId, responses[keyword]);
      return;
    }
  }

  if (
    text.toLowerCase().includes("halo") ||
    text.includes("hai") ||
    text.includes("woy")
  ) {
    const greetings = [
      `Halo ${user.firstName}! 👋`,
      `Hai ${user.firstName}! Gimana kabarmu hari ini?`,
      `Hi ${user.firstName}! Ada yang bisa saya bantu? 😊`,
    ];
    sendAndLog(chatId, getRandomResponse(greetings));
  } else if (text.toLowerCase().includes("haha")) {
    sendAndLog(chatId, getRandomResponse(["😂😂", "hahaha", "awokawokawok"]));
  }
});
