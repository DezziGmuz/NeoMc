const $ = s => document.querySelector(s);
const CHANNEL = "https://www.youtube.com/@Titanuzmc";

/* ===== MA'LUMOTLAR — shu yerdan tahrirlang ===== */

// YouTube Shorts ID lari (youtube.com/shorts/ID). Bo'sh qoldirsangiz kanalga olib boradi.
const SHORTS = ["", "", ""];

const PACKS = [
  { img: "img/gamma.jpg", name: "GammaPack", tag: "Ultra silliq PvP",
    desc: "PvP janglarni silliq va tiniq qiluvchi pack: maxsus Crystal Mace teksturasi, toza audio hit-effektlar va minimalist GUI.",
    chips: ["⚔️ Crystal Mace", "🔊 Custom Audio", "✨ Minimalist UI", "🎯 Combat & GUI"],
    url: "https://modrinth.com/resourcepack/gamma-pack" },
  { img: "img/waguri.jpg", name: "Waguri Pack", tag: "Eng ko'p yuklangan",
    desc: "Ko'plab o'yinchilar sevgan, estetik va nafis resourcepack.",
    chips: ["🌸 Anime Vibe", "💎 Custom Items", "⭐ Top Rated"],
    url: "https://modrinth.com/resourcepack/waguripack" },
  { img: "img/alya.jpg", name: "Alya Pack", tag: "Mavjud",
    desc: "Alya anime ishqibozlari uchun yaratilgan, yoqimli va maxsus uslubdagi resourcepack.",
    chips: ["❄️ Alya Theme", "🎨 Unique Textures", "🎮 Modrinth Release"],
    url: "https://modrinth.com/resourcepack/alyapack" },
  { img: "img/phonk.png", name: "Phonk Disk", tag: "Mavjud",
    desc: "O'yindagi musiqiy disklarni agressiv va ritmik Phonk treklarga almashtiruvchi audio pack.",
    chips: ["🎵 Phonk Music", "🔥 Custom Discs", "🎧 High Bitrate"],
    url: "https://modrinth.com/resourcepack/phonk-disk" }
];

const SERVERS = [
  { img: "img/nurlicraft.jpg", name: "Nurlicraft", online: true,
    desc: "SMP • BoxPvP • Anarchy • Doimiy eventlar va faol o'yinchilar hamjamiyati.",
    url: "https://minecraft-mp.com/server-s347455", ip: "SERVER_IP" }, // <- haqiqiy IP ni yozing
  { img: "img/crownsmp.jpg", name: "CrownSMP", online: false,
    desc: "SMP • PvP • Do'stona jamoa va turnirlar uchun yaratilgan maxsus SMP server." },
  { img: "img/warbox.png", name: "WarBox", online: false,
    desc: "Oldingi mashhur loyiha: Anarchy • BoxPvP • PvP janglariga yo'naltirilgan server." }
];

/* ===== Render ===== */
const thumb = (src, alt) =>
  `<div class="thumb"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()"></div>`;

$("#shorts").innerHTML = SHORTS.map(id => id
  ? `<button class="short" data-id="${id}" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)" aria-label="Videoni ijro etish"><i>▶</i></button>`
  : `<a class="short" href="${CHANNEL}" target="_blank" rel="noopener" aria-label="YouTube kanalini ochish"><i>▶</i></a>`
).join("");

$("#shorts").addEventListener("click", e => {
  const b = e.target.closest("button.short");
  if (b) b.outerHTML = `<iframe class="short" src="https://www.youtube.com/embed/${b.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
});

$("#packs-grid").innerHTML = PACKS.map(p => `
  <article class="card pack">
    ${thumb(p.img, p.name)}
    <h3>${p.name}</h3>
    <div class="tag">${p.tag}</div>
    <p>${p.desc}</p>
    <div class="chips">${p.chips.map(c => `<span>${c}</span>`).join("")}</div>
    <a class="btn fill" href="${p.url}" target="_blank" rel="noopener">Modrinth'dan yuklash</a>
  </article>`).join("");

$("#servers-grid").innerHTML = SERVERS.map(s => `
  <article class="card pack${s.online ? "" : " off"}">
    ${thumb(s.img, s.name)}
    <h3>${s.name}</h3>
    <div class="tag"><span class="dot${s.online ? " on" : ""}"></span>${s.online ? "Online server" : "Offline server"}</div>
    <p>${s.desc}</p>
    ${s.online
      ? `<div class="btns"><a class="btn" href="${s.url}" target="_blank" rel="noopener">Serverni ko'rish</a><button class="btn fill" data-ip="${s.ip}">IP nusxalash</button></div>`
      : `<div class="closed">Loyiha yopilgan</div>`}
  </article>`).join("");

/* ===== IP nusxalash + toast ===== */
let timer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove("show"), 2000);
}
$("#servers-grid").addEventListener("click", e => {
  const b = e.target.closest("[data-ip]");
  if (!b) return;
  navigator.clipboard.writeText(b.dataset.ip)
    .then(() => toast("✓ Nusxalandi!"))
    .catch(() => toast("Nusxalab bo'lmadi: " + b.dataset.ip));
});

/* ===== Dark / Light mavzu ===== */
const root = document.documentElement;
function setTheme(t) {
  root.dataset.theme = t;
  $("#theme").textContent = t === "dark" ? "🌙" : "☀️";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || "dark");
$("#theme").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

/* ===== Mobil menyu ===== */
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$("#menu").onclick = e => { if (e.target.tagName === "A") $("#menu").classList.remove("open"); };

/* ===== Aktiv menyu linki ===== */
const links = [...document.querySelectorAll("#menu a")];
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => io.observe(s));
