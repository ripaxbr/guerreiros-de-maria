// Número do WhatsApp com DDI e DDD, só números. Ex.: "5534999999999"
const WHATSAPP = "";

document.getElementById("ano").textContent = new Date().getFullYear();

const btn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
btn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  btn.setAttribute("aria-expanded", aberto);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => menu.classList.remove("aberto"))
);

if (WHATSAPP) {
  document.getElementById("whatsapp").href = `https://wa.me/${WHATSAPP}`;
}
