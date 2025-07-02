require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { userInfo } = require("os");

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("Bot sedang berjalan...");

// Fungsi untuk mendapatkan informasi user
function getUserInfo(msg) {
  const user = msg.from;
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name || "",
    languageCode: user.language_code || "tidak diketahui",
  };
}

// ==========================
// COMMANDS
// ==========================

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userInfo = getUserInfo(msg);

  bot.sendMessage(
    chatId,
    `Halo ${userInfo.firstName}! 👋\n` +
      "Saya adalah chatbot Telegram yang dibuat pakai Node.js 😎\n\n" +
      "Ketik /help untuk melihat perintah yang tersedia"
  );
});

// /whoami
bot.onText(/\/whoami/, (msg) => {
  const chatId = msg.chat.id;
  const userInfo = getUserInfo(msg);

  bot.sendMessage(
    chatId,
    `🤖 Informasi Akun Anda:\n\n` +
      `ID: ${userInfo.id}\n` +
      `Nama: ${userInfo.firstName} ${userInfo.lastName}\n` +
      `Bahasa: ${userInfo.languageCode}`
  );
});

// /time
bot.onText(/\/time/, (msg) => {
  const chatId = msg.chat.id;
  const now = new Date();
  const waktu = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  bot.sendMessage(chatId, `🕒 Hari ini: ${waktu}`);
});

// /info
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `🤖 Saya adalah bot demo yang dibuat dengan Node.js dan library node-telegram-bot-api. Versi: 1.0.0\n\nDibuat oleh @abekolin`
  );
});

// /menu (inline keyboard)
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📄 Info", callback_data: "info" }],
        [{ text: "⏰ Cek Waktu", callback_data: "time" }],
        [{ text: "👤 Siapa Saya", callback_data: "whoami" }],
      ],
    },
  };

  bot.sendMessage(chatId, "Silakan pilih menu:", opts);
});

// Inline button handler
bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === "info") {
    bot.sendMessage(
      msg.chat.id,
      "Bot ini dibuat sebagai proyek belajar Node.js + Telegram Bot API."
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
    bot.sendMessage(msg.chat.id, `🕒 Sekarang: ${waktu}`);
  } else if (data === "whoami") {
    const userInfo = getUserInfo(callbackQuery);
    bot.sendMessage(
      msg.chat.id,
      `👤 Anda adalah ${userInfo.firstName} ${userInfo.lastName}`
    );
  }
});

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const userInfo = getUserInfo(msg);

  bot.sendMessage(
    chatId,
    `Hai ${userInfo.firstName}, berikut perintah yang tersedia:\n\n` +
      "/start - Memulai bot\n" +
      "/help - Menampilkan bantuan\n" +
      "/whoami - Info akun Anda\n" +
      "/info - Informasi tentang bot\n" +
      "/time - Waktu saat ini\n" +
      "/quote - Kutipan motivasi\n" +
      "/joke - Lelucon receh\n" +
      "/fact - Fakta menarik\n" +
      "/menu - Menampilkan menu pilihan\n\n"
  );
});

// ==========================
// FITUR LAINNYA
// ==========================

const quotes = [
  "Jangan menyerah, awal yang sulit sering membawa hasil yang manis 🍯",
  "Setiap hari adalah kesempatan baru untuk menjadi lebih baik 💪",
  "Kesuksesan bukan milik orang pintar, tapi milik mereka yang gigih 🧠",
  "Impian tidak akan bekerja, kecuali kamu bekerja untuknya 🌠",
  "Satu langkah kecil setiap hari akan membawa perubahan besar 🚶‍♂️",
  "Kegagalan adalah bumbu yang membuat kesuksesan lebih berharga 🍲",
  "Kamu lebih kuat dari apa yang kamu pikirkan 💥",
  "Orang yang tidak pernah gagal adalah orang yang tidak pernah mencoba 🚫",
  "Bermimpilah setinggi langit, tapi tetap melangkah di bumi ☁️👣",
  "Waktu terbaik untuk memulai adalah sekarang ⏰",
  "Lelah boleh, menyerah jangan 🛑",
  "Jangan takut berjalan lambat, takutlah jika kamu berhenti 💡",
  "Kesempatan besar sering kali tersembunyi di balik kerja keras 🧱",
  "Hidup tidak harus sempurna untuk menjadi indah 🌻",
  "Jangan bandingkan dirimu dengan orang lain, fokus pada progresmu 🔍",
  "Jadilah versi terbaik dari dirimu sendiri setiap hari 🌈",
  "Jika kamu lelah, istirahatlah. Tapi jangan berhenti 💨",
  "Setiap kesulitan adalah latihan menuju kedewasaan 💎",
  "Kamu bisa, kamu mampu, kamu hanya perlu percaya 💬",
  "Hidup bukan tentang menunggu badai reda, tapi belajar menari dalam hujan ☔",
  "Jangan menyerah hanya karena hari ini sulit. Besok bisa lebih baik 🌅",
  "Tantangan adalah pintu menuju potensi terbaikmu 🚪",
  "Kita tidak harus hebat untuk memulai, tapi kita harus memulai untuk jadi hebat 🎯",
  "Jika ragu, tetap melangkah. Diam tak akan mengubah apa pun ⏳",
  "Setiap detik adalah kesempatan untuk berubah menjadi lebih baik 🕰️",
  "Bangun pagi bukan cuma soal waktu, tapi semangat untuk berubah 🌞",
  "Patah hati bukan akhir dunia, tapi awal mencintai diri sendiri 💔❤️",
  "Percaya diri adalah kunci membuka semua peluang 🔑",
  "Ketakutan hanyalah bayangan dari hal yang belum terjadi 🌑",
  "Langkah kecil tetaplah langkah, terus maju meski pelan 🐢",
  "Kamu sudah sejauh ini, jangan berhenti sekarang 🛤️",
  "Kebaikan kecil hari ini bisa jadi kekuatan besar esok hari 🌱",
  "Mimpi besar dimulai dari tindakan kecil 💭➡️🛠️",
  "Cahaya selalu ada, bahkan di sudut tergelap 🕯️",
  "Berani gagal berarti berani sukses 🔁",
  "Kamu tidak harus sempurna untuk dicintai 💕",
  "Tersenyumlah meski hari ini berat, itu kekuatanmu 😊",
  "Lebih baik mencoba dan gagal daripada tidak mencoba sama sekali 🔄",
  "Orang sukses bukan yang selalu menang, tapi yang tak pernah menyerah 🥇",
  "Bersyukur bukan karena hidup mudah, tapi karena kamu kuat 💗",
  "Tidak ada kesuksesan tanpa rasa sakit dan pengorbanan 💧",
  "Satu-satunya batasmu adalah dirimu sendiri 🪞",
  "Selalu ada pelangi setelah hujan 🌈",
  "Keajaiban terjadi pada mereka yang percaya ✨",
  "Jangan tunggu semangat datang, ciptakan sendiri 🔥",
  "Kamu tidak pernah tahu seberapa dekat kamu dengan keberhasilan ⛳",
  "Jangan menunggu motivasi, bangunlah disiplin 🧱",
  "Gagal itu pelajaran, bukan hukuman 📚",
  "Percayalah pada proses, meski hasilnya belum terlihat 🌀",
  "Setiap orang punya waktu masing-masing. Fokuslah pada waktumu 🕰️",
  "Semua hal besar dimulai dari mimpi kecil 🌱",
  "Ketika satu pintu tertutup, pintu lain akan terbuka 🚪",
  "Jangan biarkan opini orang lain mengendalikan hidupmu 🔇",
  "Sukses itu bukan keberuntungan, tapi hasil kerja keras 💼",
  "Kebahagiaan tidak ditemukan, tapi diciptakan 🛠️",
  "Hari yang buruk tidak membuatmu menjadi orang yang buruk 🌧️",
  "Keberanian bukan tanpa rasa takut, tapi tetap melangkah meski takut 🦁",
  "Jangan tunggu momen sempurna, buatlah momen itu sendiri 🎬",
  "Setiap luka adalah pelajaran yang membuatmu tumbuh 🌿",
  "Percaya bahwa kamu bisa adalah langkah pertama menuju keberhasilan 🚀",
  "Jika kamu terus menunda, mimpimu akan terus tertunda juga ⏳",
  "Tak apa berjalan sendiri, selama kamu tahu ke mana arahmu 🧭",
  "Ketika kamu lelah, ingat kenapa kamu memulai 💡",
  "Hidup bukan tentang siapa yang tercepat, tapi siapa yang paling konsisten 🐢",
  "Jangan biarkan kesalahan hari kemarin merusak hari ini 📆",
  "Bersabarlah, proses tidak pernah mengkhianati hasil 🧘‍♀️",
  "Terkadang, yang kamu butuhkan hanya percaya pada dirimu sendiri 🌟",
  "Setiap orang hebat pernah merasa gagal 💔➡️💪",
  "Jika kamu ingin hasil yang berbeda, lakukan hal yang berbeda 🔄",
  "Kamu tidak bisa mengontrol segalanya, tapi kamu bisa mengontrol reaksimu 🧠",
  "Kegagalan hanya akan menang jika kamu menyerah 🎭",
  "Saat kamu merasa tak berharga, ingat ada yang sedang mengagumimu diam-diam 🌸",
  "Jangan takut mulai dari nol, bahkan langit pun dimulai dari titik kecil 🌌",
  "Jangan sia-siakan hari ini hanya karena masa lalu yang berat 🧱",
  "Memaafkan dirimu sendiri adalah bentuk tertinggi cinta diri ❤️",
  "Tersandung bukan berarti gagal, tapi tanda bahwa kamu sedang bergerak 👣",
  "Kamu tidak harus punya semua jawaban hari ini 🧩",
  "Kadang jalan memutar adalah jalan terbaik menuju tujuan 🛤️",
  "Setiap hari adalah peluang untuk menulis cerita baru 📖",
  "Keberhasilan bukan soal siapa yang tercepat, tapi siapa yang tak berhenti 🏃‍♂️",
  "Hidup bukan tentang menunggu badai reda, tapi belajar berteduh dengan bijak ☔",
  "Jadilah cahaya, meskipun kamu berada di tempat tergelap 🕯️",
  "Kamu berharga, bahkan ketika kamu tidak merasa demikian 💎",
  "Hidup punya caranya sendiri untuk membentukmu, tetaplah kuat 💪",
  "Jangan ragukan potensi dirimu hanya karena kamu sedang terjatuh 🔄",
  "Apa pun yang kamu mulai hari ini, bisa menjadi sesuatu yang luar biasa besok ✍️",
  "Berani bermimpi besar, karena kamu layak mendapatkannya 🌠",
  "Lebih baik mencoba lalu gagal, daripada menyesal karena tak pernah mencoba 🚫",
  "Kamu tidak sendirian. Banyak orang juga sedang berjuang seperti kamu 🌍",
  "Percayalah, kamu sedang menuju versi terbaik dari dirimu sendiri 🔜✨",
  "Hal-hal baik datang kepada mereka yang tidak menyerah 🎁",
  "Keajaiban datang ketika kamu terus berjalan meski tak terlihat hasilnya 🌈",
  "Tenang, kamu sedang tumbuh. Mungkin belum terlihat 🌱",
  "Apa yang kamu tabur hari ini akan tumbuh esok hari 🌾",
  "Jangan takut bermimpi besar hanya karena kamu berasal dari tempat kecil 🏡",
  "Jangan biarkan ketakutanmu lebih besar dari mimpimu 🎯",
  "Kadang gagal adalah jalan menuju hal yang lebih baik dari yang kamu rencanakan 📉➡️📈",
  "Kamu cukup. Kamu mampu. Kamu berharga. 💬💗",
];

bot.onText(/\/quote/, (msg) => {
  const chatId = msg.chat.id;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  bot.sendMessage(chatId, `💡 *Kutipan Hari Ini:*\n\n_${randomQuote}_`, {
    parse_mode: "Markdown",
  });
});

// Lelucon
const jokes = [
  "Kenapa ayam menyebrang jalan? Karena dia bosan di sisi yang itu. 🐔",
  "Apa bedanya kamu dan alarm? Alarm bisa bikin aku bangun, kamu cuma bikin aku baper. 😆",
  "Kenapa kucing nggak bisa main HP? Karena nggak punya jempol. 🐱",
  "Kenapa nasi padang enak? Karena dia tahu cara menyentuh hati. 🍛",
  "Apa yang lebih menyakitkan dari putus cinta? Listrik prabayar habis pas masak mie. ⚡",
  "Kenapa sandal selalu hilang satu? Karena dia sedang mencari jodohnya. 👣",
  "Kenapa kucing suka masuk kardus? Karena dia introvert. 📦",
  "Kenapa kopi pahit? Karena dia tidak bisa manis seperti kamu. ☕",
  "Kenapa langit biru? Karena kalau merah, itu namanya atap. 🌌",
  "Apa yang selalu datang tapi tak pernah sampai? Besok. ⏳",
  "Kenapa anak kos pinter? Karena hidupnya penuh perhitungan. 📉",
  "Kenapa bulan sabit nggak pernah kenyang? Karena selalu puasa. 🌙",
  "Kenapa tisu gak bisa jadi penyanyi? Karena dia selalu patah di tengah lagu. 🎤",
  "Kenapa gorengan bikin bahagia? Karena dia tidak pernah menghakimi bentukmu. 🍩",
  "Kenapa air putih nggak pernah galau? Karena dia selalu jernih. 💧",
  "Kenapa hujan turun? Karena dia nggak bisa naik. 🌧️",
  "Kenapa pisang sering dipanggil? Karena dia suka ngebelah diri. 🍌",
  "Kenapa dompet sering kosong? Karena uangnya introvert. 💸",
  "Kenapa kertas malu? Karena suka dilipat-lipat. 📄",
  "Kenapa awan sedih? Karena dia sering digantung. ☁️",
  "Kenapa komputer sering ngambek? Karena sering crash 😅",
  "Kenapa programmer suka ngopi? Karena tanpa kopi, mereka error! ☕",
  "Apa bedanya kamu dan bug? Bug bisa di-fix, kamu enggak. 😆",
  "Kenapa pacar programmer jarang marah? Karena mereka selalu dalam 'try-catch'.",
  "Apa yang dilakukan debugger saat galau? Breakpoint dulu.",
  "Kenapa developer jomblo? Karena mereka belum commit. 😅",
  "Apa yang programmer lakukan saat libur? Push ke remote island. 🏝️",
  "Kenapa JavaScript suka PHP? Karena dia suka 'loose type' juga. 🤭",
  "Bagaimana cara move on dari bug? Refactor perasaan. 🧠",
  "Kenapa programmer suka malam? Karena error-nya lebih terang. 🌙",
  "Apa yang dikatakan database ke server? Aku butuh relasi. ❤️",
  "Kenapa algoritma susah move on? Karena stuck di loop. 🔁",
  "Apa yang dilakukan kucing programmer? Meow-nitoring. 🐱",
  "Kenapa komputer demam? Terkena virus. 🤒",
  "Apa pekerjaan favorit bug? Bikin drama di production. 🎭",
  "Kenapa laptop suka dipeluk? Karena RAM-nya hangat. 🖥️",
  "Apa minuman favorit software engineer? Java. ☕",
  "Kenapa WiFi putus? Karena sinyalnya insecure. 🔒",
  "Apa bedanya error dan mantan? Error bisa diperbaiki.",
  "Kenapa software update bikin galau? Karena takut broken. 😭",
  "Apa yang dilakukan programmer saat bos marah? Try-catch-move on.",
  "Kenapa monitor lelah? Terlalu banyak yang ditampilkan.",
  "Kenapa hacker selalu tenang? Karena dia punya kontrol penuh. 😎",
  "Kenapa komputer tidak bisa tidur? Karena dia harus standby.",
  "Apa nama band favorit programmer? Linkin Stack Overflow.",
  "Kenapa coding mirip cinta? Sama-sama butuh logika dan kesabaran. 💔",
  "Kenapa developer PHP sensitif? Karena suka 'notice' kecil. 🐘",
  "Apa makanan favorit komputer? Byte goreng.",
  "Apa hobinya server? Nge-host. 🏠",
  "Kenapa hard disk trauma? Pernah di format mantan.",
  "Apa cita-cita CPU? Jadi otak dunia digital.",
  "Kenapa koneksi lambat bikin sedih? Karena loading terus kayak harapan.",
  "Kenapa debug itu susah? Karena harus ngertiin masalah orang lain.",
  "Apa nama hewan favorit backend dev? Python. 🐍",
  "Kenapa software engineer susah bangun pagi? Karena semalam deploy. 😴",
  "Kenapa frontend sering overthinking? Karena mikirin user experience. 💡",
  "Apa yang dikatakan kode ke error? Kenapa kamu muncul lagi?",
  "Apa yang dilakukan bug saat weekend? Hide di production. 🕵️‍♂️",
  "Kenapa cinta programmer itu dalam? Karena pakai recursive.",
  "Kenapa React mirip cinta? Butuh state yang stabil.",
  "Apa yang dikatakan function ke variable? Aku butuh kamu sebagai parameter.",
  "Kenapa Git suka ngajak ribut? Karena sering konflik.",
  "Apa yang bikin developer bahagia? Code jalan tanpa bug.",
  "Kenapa UI designer suka peluk? Karena mereka butuh margin.",
  "Apa yang dilakukan AI kalau galau? Training ulang perasaan.",
  "Kenapa laptop sedih? Karena disuruh shutdown.",
  "Kenapa file .exe disalahpahami? Karena sering bikin rusak.",
  "Kenapa HTML gak bisa jadi pacar? Karena cuma struktur, gak punya perasaan.",
  "Apa yang dilakukan CPU kalau bosan? Multitasking.",
  "Kenapa programmer susah LDR? Karena takut koneksi timeout.",
  "Apa makanan favorit bug? Stack overflow. 🍽️",
  "Kenapa programmer susah peka? Karena dia cuma ngerti true atau false.",
  "Kenapa array kesepian? Karena tidak ada index yang menemani.",
  "Apa obat galau programmer? Console.log('semangat');",
  "Kenapa mantan seperti bug? Susah dihapus dari memory.",
  "Kenapa DevOps tenang terus? Karena semua udah di-automate.",
  "Kenapa software kadang ngambek? Karena ada missing semicolon.",
  "Apa yang dilakukan server kalau baper? Down.",
  "Kenapa coder suka debugging? Karena itu seperti mencari diri sendiri.",
  "Apa kesamaan developer dan seniman? Sama-sama suka bikin karya abstrak.",
  "Kenapa CSS susah dimengerti? Karena selalu styled tapi ga jelas.",
  "Kenapa IDE cemburu? Karena kamu buka file lain.",
  "Apa yang dilakukan kode toxic? Didelete dari hidup.",
  "Kenapa kode kamu galau? Karena banyak warning dari linting.",
  "Kenapa dia nggak mau balikan? Karena udah di-push ke branch lain.",
  "Kenapa kamu susah tidur? Karena hati masih running process.",
  "Apa kesamaan antara kode dan cinta? Keduanya bisa crash tiba-tiba.",
  "Kenapa API suka marah? Karena ada yang akses tanpa izin.",
  "Kenapa developer harus jujur? Karena code tidak bisa bohong.",
  "Kenapa pacaran seperti software? Butuh maintenance rutin.",
  "Kenapa Java selalu semangat? Karena punya class motivasi.",
  "Apa game favorit hacker? Hide and exploit.",
  "Kenapa developer takut production? Karena di situ kenyataan terjadi.",
  "Apa yang dilakukan error saat weekend? Timeout.",
  "Apa nasihat cinta dari database? Jangan join yang nggak ada relasinya.",
  "Apa yang terjadi saat kamu stuck? Mungkin butuh 'restart'.",
  "Kenapa cinta bertepuk sebelah tangan? Karena async tanpa await.",
  "Kenapa backend itu setia? Karena selalu support dari belakang.",
  "Kenapa internet suka ngambek? Karena paketannya abis.",
  "Kenapa CPU nggak pernah curhat? Karena dia punya banyak core. 🧠",
  "Apa kesamaan antara cinta dan bug? Sama-sama bikin pusing.",
  "Kenapa developer harus olahraga? Biar nggak terlalu static.",
  "Apa makanan favorit front-end dev? Responsive layout.",
  "Kenapa keyboard sedih? Karena sering dipukul saat salah.",
  "Kenapa kabel suka jalan sendiri? Karena dia fleksibel.",
  "Kenapa string butuh spasi? Biar nggak terlalu ketat.",
  "Kenapa AI susah tidur? Karena terus training diri.",
  "Kenapa kamu gagal login ke hati dia? Karena password-nya salah.",
  "Kenapa programmer jarang move on? Karena terlalu 'depend'.",
  "Kenapa aplikasi kamu lambat? Karena masih mikirin mantan.",
  "Kenapa web kamu jelek? Karena belum diberi style.",
  "Apa yang dilakukan developer saat stress? Reset mental state.",
  "Kenapa router sering bingung? Karena banyak yang minta koneksi.",
  "Apa yang dikatakan code ke error? Sudahlah, kita beda dunia.",
  "Kenapa kamu susah deploy cinta? Karena belum punya domain.",
  "Kenapa update gagal? Karena kamu belum ready.",
  "Kenapa dia ghosting? Karena dia async function tanpa callback.",
  "Kenapa server kamu dingin? Karena pakai cloud.",
  "Apa kesamaan antara bug dan mantan? Keduanya suka muncul tiba-tiba.",
];

bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  bot.sendMessage(chatId, `🤣 ${randomJoke}`);
});

// Fakta menarik
const facts = [
  "Lebah dapat mengenali wajah manusia 🐝",
  "Gajah tidak bisa melompat 🐘",
  "Otak manusia lebih aktif saat tidur dibanding saat menonton TV 🧠",
  "Air laut terasa asin karena mengandung mineral dan garam dari batuan di daratan 🌊",
  "Kucing bisa bermimpi saat tidur 😴🐱",
  "Ada lebih banyak bintang di alam semesta daripada butir pasir di seluruh Bumi 🌌",
  "Jerapah tidur hanya sekitar 30 menit sehari 🦒",
  "Manusia memiliki lebih dari 600 otot 💪",
  "Kentang pernah digunakan sebagai alat pembayaran di Prusia pada abad ke-18 🥔",
  "Lumba-lumba memiliki nama panggilan untuk saling memanggil 🐬",
  "Kelinci tidak bisa muntah 🐰",
  "Indonesia memiliki lebih dari 17.000 pulau 🏝️",
  "Air terjun tertinggi di dunia adalah Angel Falls di Venezuela (979 m) 🌊",
  "Madu tidak pernah basi 🍯",
  "Pisang secara botani adalah buah beri, tapi stroberi bukan 🍌🍓",
  "Jantung paus biru seukuran mobil kecil 🐋",
  "Ayam bisa mengingat wajah lebih dari 100 individu 🐔",
  "Tumbuhan juga bisa ‘berkomunikasi’ lewat sinyal kimia 🌿",
  "Orang kidal cenderung lebih kreatif 🎨",
  "Rata-rata manusia berkedip sekitar 20.000 kali sehari 👁️",
  "Bahasa pemrograman Python dinamai dari acara komedi Monty Python, bukan ular 🐍",
  "Keyboard QWERTY dibuat untuk memperlambat pengetikan di mesin ketik awal ⌨️",
  "Emoji pertama kali digunakan di Jepang pada akhir 1990-an 🇯🇵",
  "Telegram memiliki fitur Secret Chat dengan enkripsi end-to-end 🔒",
  "Email pertama dikirim oleh Ray Tomlinson pada tahun 1971 📧",
  "Logo Apple terinspirasi dari Isaac Newton dan apel yang jatuh 🍎",
  "HTML bukan bahasa pemrograman, tapi bahasa markup 📄",
  "Mark Zuckerberg buta warna merah-hijau, itulah sebabnya Facebook berwarna biru 🔵",
  "Nama Wi-Fi tidak memiliki arti khusus, hanya branding 📶",
  "Steve Jobs diberhentikan dari perusahaannya sendiri, Apple, pada 1985 👔",
  "Google awalnya bernama BackRub 🔍",
  "Istilah 'bug' dalam komputer berasal dari serangga nyata di dalam mesin komputer pertama 🐛",
  "Komputer pertama seukuran ruangan dan beratnya mencapai 30 ton 💻",
  "Linux diciptakan oleh Linus Torvalds sebagai proyek hobi 🐧",
  "Windows 1.0 dirilis pada tahun 1985 🪟",
  "Java awalnya dirancang untuk perangkat TV interaktif 📺",
  "YouTube awalnya dibuat sebagai situs kencan video ❤️",
  "Nama 'robot' pertama kali digunakan dalam drama Ceko berjudul 'R.U.R.' 🤖",
  "Domain pertama di dunia adalah symbolics.com (1985) 🌐",
  "Tesla menggunakan bahasa pemrograman Python untuk beberapa sistemnya ⚡",
  "Emoji 😂 dinobatkan sebagai Word of the Year oleh Oxford Dictionary pada 2015 🏆",
  "Algoritma pertama ditulis oleh Ada Lovelace pada abad ke-19 👩‍💻",
  "Superkomputer tercepat di dunia dapat melakukan kuadriliun kalkulasi per detik ⚙️",
  "Istilah 'cloud' di cloud computing berasal dari diagram jaringan ☁️",
  "TikTok awalnya bernama Douyin di Tiongkok 🎵",
  "Google mengindeks lebih dari 100 miliar halaman web 🌍",
  "Istilah spam berasal dari sketsa Monty Python tentang daging kalengan 🍖",
  "Ada lebih dari 700 bahasa pemrograman yang dikenal 💬",
  "Bitcoin diciptakan oleh seseorang (atau sekelompok orang) dengan nama samaran Satoshi Nakamoto ₿",
  "QR Code pertama kali dibuat di Jepang oleh Denso Wave pada tahun 1994 🔲",
  "iPhone pertama dirilis tahun 2007 📱",
  "Google Maps menggunakan data dari berbagai sumber termasuk pengguna sendiri 🗺️",
  "Sistem operasi Android berbasis kernel Linux 🤖",
  "Facebook dibuat di kamar asrama Harvard oleh Mark Zuckerberg 👨‍🎓",
  "Spotify menggunakan machine learning untuk rekomendasi lagu 🎧",
  "Nama Java dipilih karena pengembang suka kopi asal pulau Jawa ☕",
  "NASA masih menggunakan bahasa pemrograman Fortran dalam beberapa sistem 🚀",
  "Kecepatan internet tercepat di dunia pernah mencapai 319 Terabit per detik ⚡",
  "YouTube adalah situs kedua yang paling sering dikunjungi setelah Google 📹",
  "Dark web adalah bagian dari internet yang tidak terindeks oleh mesin pencari 🌑",
  "Ctrl+Alt+Del diperkenalkan oleh IBM untuk reboot cepat 🔁",
  "Hacker etis disebut juga white hat 🧑‍💻",
  "Font Comic Sans sering dianggap kontroversial karena desainnya 📚",
  "Salah satu situs web pertama adalah info.cern.ch 🧪",
  "Netflix menggunakan AI untuk menentukan gambar sampul tiap pengguna 📼",
  "Istilah meme berasal dari Richard Dawkins dalam buku 'The Selfish Gene' 🧠",
  "Captcha diciptakan untuk membedakan manusia dari bot 🤖",
  "Algoritma Google terus diubah setiap tahun untuk meningkatkan hasil pencarian 🔍",
  "Smartphone modern memiliki lebih banyak kekuatan komputasi dibanding komputer Apollo 11 🚀",
  "Nintendo awalnya adalah perusahaan kartu permainan 🎴",
  "Bahasa pemrograman C dikembangkan pada tahun 1972 oleh Dennis Ritchie 🧑‍💻",
  "Emoji telah menjadi standar Unicode sejak 2010 💬",
  "OpenAI membuat model bahasa AI yang bisa menulis kode seperti manusia 🧠",
  "Mata uang digital pertama kali dikembangkan pada tahun 1980-an 💸",
  "Adobe Photoshop pertama kali dirilis pada tahun 1990 🖼️",
  "Wikipedia diluncurkan pada tahun 2001 📚",
  "Hingga kini, 90% data dunia diciptakan dalam 2 tahun terakhir 💾",
  "Google Earth menggabungkan citra satelit dan data geografis 3D 🌍",
  "Game Tetris diciptakan oleh seorang ilmuwan komputer dari Rusia 🎮",
  "Bahasa Swift dikembangkan oleh Apple untuk menggantikan Objective-C 🍏",
  "RAM (Random Access Memory) bersifat volatile, artinya datanya hilang saat mati daya ⚡",
  "SSL/TLS digunakan untuk mengamankan komunikasi web 🔐",
  "Perusahaan Yahoo! dulunya bernama 'Jerry and David’s Guide to the World Wide Web' 🌐",
  "Browser pertama di dunia adalah WorldWideWeb (kemudian disebut Nexus) 🧭",
  "Nama 'Bluetooth' berasal dari raja Viking, Harald Bluetooth 🦷",
  "AI DeepFake dapat menciptakan video palsu yang sulit dibedakan dari nyata 🎭",
  "Steve Wozniak adalah salah satu pendiri Apple dan pencipta komputer Apple I 👨‍💻",
  "Kamera pertama di ponsel muncul tahun 2000 di Jepang 📸",
  "Captcha adalah singkatan dari 'Completely Automated Public Turing test to tell Computers and Humans Apart' 🤯",
  "Ada lebih dari 5 miliar pengguna internet di dunia 🌎",
  "ASCII art adalah seni yang dibuat dengan karakter teks saja 🎨",
  "Data center besar bisa mengonsumsi energi setara ribuan rumah 🏭",
  "Robot AI bisa menulis puisi, lukisan, bahkan menggubah musik 🎶",
  "Amazon Web Services (AWS) adalah salah satu layanan cloud terbesar di dunia ☁️",
  "GIF ditemukan pada tahun 1987 oleh Steve Wilhite 🖼️",
  "Google pernah menyimpan lebih dari 10.000 sepatu karet di kantor pertamanya 👟",
  "Bahasa Assembly sangat dekat dengan bahasa mesin dan sulit dibaca manusia ⚙️",
  "Kamera pengenal wajah kini digunakan di banyak bandara besar 🛫",
  "Ada komputer di dalam mobil modern lebih dari 50 modul ECU 🚗",
  "Bendera merah di kode biasanya berarti potensi masalah atau 'code smell' 🚩",
  "Bahasa pemrograman R banyak digunakan dalam data science 📊",
  "Instagram awalnya bernama Burbn dan hanya untuk check-in tempat 📷",
  "Dark mode mengurangi ketegangan mata dan menghemat baterai ⚫",
  "Website pertama dibuat oleh Tim Berners-Lee pada tahun 1991 👨‍💻",
  "Layar sentuh kapasitif bereaksi terhadap konduksi listrik dari kulit manusia ✋",
  "Modem berasal dari kata 'modulator-demodulator' 📡",
  "Nama 'Linux' berasal dari gabungan nama Linus dan Unix 🐧",
  "Mobile game pertama yang populer secara global adalah Snake di Nokia 📱",
  "Bill Gates mulai belajar pemrograman sejak umur 13 tahun 👦",
  "URL pertama kali digunakan pada awal 1990-an 🌐",
  "Bahasa pemrograman Ruby dikenal karena sintaks yang mirip bahasa manusia 💎",
  "Laptop pertama kali diperkenalkan pada tahun 1981 oleh Osborne Computer Corporation 💼",
  "Ilmu kriptografi sudah digunakan sejak zaman Romawi 🏺",
  "Emoji punya makna berbeda di tiap platform (Android, iOS, dll.) 😅",
  "Data pribadi kita bisa disimpan di server di negara lain tanpa kita tahu 🌐",
  "Bug bounty program memberi hadiah uang bagi penemu celah keamanan 💰",
  "HTML5 memperkenalkan elemen <video> dan <audio> 🎬",
  "Ada algoritma khusus yang mengatur urutan postingan media sosialmu 📲",
  "Keyboard mekanik banyak disukai gamer karena respon dan suara khasnya 🎮",
  "Digital detox adalah tren untuk mengurangi ketergantungan pada gadget 📵",
];

bot.onText(/\/fact/, (msg) => {
  const chatId = msg.chat.id;
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  bot.sendMessage(chatId, `🧠 Fakta Menarik:\n\n${randomFact}`);
});

// Echo
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, `🔁 Kamu bilang: ${resp}`);
});

// Tebak angka
bot.onText(/^[1-5]$/, (msg) => {
  const chatId = msg.chat.id;
  const userNumber = parseInt(msg.text);
  const botNumber = Math.floor(Math.random() * 5) + 1;

  if (userNumber === botNumber) {
    bot.sendMessage(
      chatId,
      `🎉 Hebat! Kamu menebak angka ${botNumber} dengan benar!`
    );
  } else {
    bot.sendMessage(chatId, `🙃 Salah tebak! Aku memilih angka ${botNumber}`);
  }
});

// Respon: apakah namaku ...
bot.onText(/apakah namaku (.+)/i, (msg, match) => {
  const chatId = msg.chat.id;
  const nameGuess = match[1];
  const userInfo = getUserInfo(msg);
  const realName = `${userInfo.firstName} ${userInfo.lastName}`.trim();

  if (realName.toLowerCase().includes(nameGuess.toLowerCase())) {
    bot.sendMessage(
      chatId,
      `✅ Betul! Nama kamu memang ada unsur '${nameGuess}'`
    );
  } else {
    bot.sendMessage(chatId, `❌ Sepertinya bukan. Namamu bukan '${nameGuess}'`);
  }
});

// ==========================
// PESAN UMUM DAN EMOSI
// ==========================

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();
  const userInfo = getUserInfo(msg);
  console.log(`${userInfo.firstName}: ${text}`);

  if (msg.text.startsWith("/")) return;

  let balasan = "";

  if (text.includes("capek")) {
    balasan = "😥 Semangat ya! Jangan lupa istirahat sebentar.";
  } else if (text.includes("bosan")) {
    balasan = "📚 Coba cari hal baru yang seru! Atau ketik /joke buat hiburan.";
  } else if (text.includes("sedih")) {
    balasan = "😔 Sedih itu manusiawi. Kamu hebat karena tetap bertahan.";
  } else if (text.includes("galau")) {
    balasan =
      "💔 Tenang... semua akan baik-baik saja. Fokus ke dirimu dulu ya.";
  } else if (text.includes("bingung")) {
    balasan =
      "🤔 Kalau bingung, coba tulis apa yang kamu rasakan. Mungkin bisa membantu.";
  } else if (text.startsWith("/joke")) {
    balasan =
      "🤣 Kenapa ayam nyebrang jalan? Karena dia pengen kabur dari tagihan listrik!";
  } else if (text.startsWith("/motivasi")) {
    balasan =
      "💡 Jangan bandingkan dirimu dengan orang lain. Bandingkan dengan dirimu yang kemarin.";
  }
  if (balasan != "") {
    bot.sendMessage(chatId, balasan);
    console.log(`Bot: ${balasan}`);
  }
  // Kirim balasan ke user

  // Cetak balasan bot ke console

  // Helper function for random responses
  function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Ucapan umum
  if (text.includes("halo") || text.includes("hai")) {
    const greetings = [
      `Halo juga ${userInfo.firstName}! Ada yang bisa saya bantu? 😊`,
      `Hi ${userInfo.firstName}! Senang bertemu denganmu!`,
      `Hai ${userInfo.firstName}! Bagaimana kabarmu hari ini?`,
      `Hello ${userInfo.firstName}! Apa kabar?`,
      `Halo ${userInfo.firstName} ${
        userInfo.lastName || ""
      }! Senang mendengar darimu!`,
      `Hai ${userInfo.firstName}! Ketik /help jika butuh bantuan.`,
      `Halo! Hari yang indah ya? 😄`,
      `Hai ${userInfo.firstName}! Siap membantumu hari ini!`,
      `Halo! Saya bot Telegram siap membantu.`,
      `Hai ${userInfo.firstName}! Kamu terlihat baik hari ini! 😊`,
      `Halo! Semoga harimu menyenangkan!`,
      `Hai ${userInfo.firstName}! Sudah makan belum? 😋`,
      `Halo! Siap melayani! 💪`,
      `Hai ${userInfo.firstName}! Ada yang bisa saya bantu?`,
      `Halo! Semangat pagi/siang/malam! 🌞`,
      `Hai ${userInfo.username}! Username keren! 😎`,
      `Halo! Senang berkenalan denganmu!`,
      `Hai! Kamu berasal dari ${
        userInfo.languageCode === "id" ? "Indonesia" : "negara lain"
      } ya?`,
      `Halo ${userInfo.firstName}! Sudah minum air hari ini? 💧`,
      `Hai! Jangan lupa tersenyum hari ini! 😊`,
    ];
    gRandom = getRandomResponse(greetings);
    bot.sendMessage(chatId, gRandom);
    console.log("Bot: " + gRandom);
    return;
  } else if (text.includes("terima kasih") || text.includes("makasih")) {
    bot.sendMessage(chatId, "Sama-sama! 😊");
  } else if (text.includes("siapa kamu")) {
    bot.sendMessage(
      chatId,
      "Saya adalah bot Telegram yang dibuat untuk menemani kamu 😄"
    );
  } else if (text.includes("siapa saya")) {
    bot.sendMessage(
      chatId,
      `Anda adalah ${userInfo.firstName} ${userInfo.lastName}`
    );
  }
});
