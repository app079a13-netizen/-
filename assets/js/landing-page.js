const CTA_URL = "https://example.com/fazaa-offer";
const COUNTDOWN_END = Date.now() + 30 * 60 * 1000;

const cta = document.getElementById("cta");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const expiryNoteEl = document.getElementById("expiry-note");

cta.href = CTA_URL;

function format2(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const distance = COUNTDOWN_END - now;

  if (distance <= 0) {
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    expiryNoteEl.textContent = "انتهى العرض حالياً.";
    cta.textContent = "انتهى العرض";
    cta.setAttribute("aria-disabled", "true");
    cta.removeAttribute("href");
    return true;
  }

  const minutes = Math.floor(distance / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  minutesEl.textContent = format2(minutes);
  secondsEl.textContent = format2(seconds);

  return false;
}

if (!updateCountdown()) {
  const timer = window.setInterval(() => {
    const isExpired = updateCountdown();
    if (isExpired) {
      window.clearInterval(timer);
    }
  }, 1000);
}
