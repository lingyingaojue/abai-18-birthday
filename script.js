(() => {
  "use strict";

  const BIRTH_MONTH = 7; // 0-based: 7 = August
  const BIRTH_DAY = 28;

  const countdownPanel = document.getElementById("countdown-panel");
  const birthdayPanel = document.getElementById("birthday-panel");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const celebrateBtn = document.getElementById("celebrate-btn");
    const previewMode = new URLSearchParams(window.location.search).has("preview");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function isBirthdayToday() {
    if (previewMode) return true;
    const now = new Date();
    return now.getMonth() === BIRTH_MONTH && now.getDate() === BIRTH_DAY;
    }
  function nextBirthday() {
    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(year, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    if (now >= target && now.getMonth() === BIRTH_MONTH && now.getDate() === BIRTH_DAY) {
      // 今天就是生日，不再倒计时，显示庆祝面板
      return target;
    }
    if (now > new Date(year, BIRTH_MONTH, BIRTH_DAY, 23, 59, 59, 999)) {
      target = new Date(year + 1, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    }
    return target;
  }

  function updateCountdown() {
    if (isBirthdayToday()) {
      countdownPanel.classList.add("hidden");
      birthdayPanel.classList.remove("hidden");
      return;
    }

    const target = nextBirthday();
    const diff = Math.max(0, target.getTime() - Date.now());

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    // 生日前最后一小时，让页面更有气氛
    if (diff <= 3600000) {
      document.body.classList.add("almost-birthday");
    }
  }

  function createBalloons() {
    const container = document.getElementById("balloons");
    const colors = ["#ff8fab", "#ffd166", "#7ec8e3", "#b8a9ff", "#90e0ef", "#ffb3c6"];
    const count = window.innerWidth < 600 ? 7 : 12;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement("div");
      balloon.className = "balloon";
      const size = 35 + Math.random() * 35;
      const color = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.left = Math.random() * 100 + "%";
      balloon.style.width = size + "px";
      balloon.style.height = size * 1.18 + "px";
      balloon.style.setProperty('--balloon-color', color);
      balloon.style.background = `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.8), ${color} 65%)`;
      balloon.style.animationDuration = (11 + Math.random() * 10).toFixed(2) + "s";
      balloon.style.animationDelay = (-Math.random() * 20).toFixed(2) + "s";
      balloon.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
      fragment.appendChild(balloon);
    }

    container.appendChild(fragment);
  }

  function launchConfetti() {
    const container = document.getElementById("confetti-container");
    const colors = ["#ff8fab", "#ffd166", "#7ec8e3", "#b8a9ff", "#90e0ef", "#ffb3c6", "#c8b6ff"];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      const size = 6 + Math.random() * 8;
      piece.style.left = Math.random() * 100 + "%";
      piece.style.width = size + "px";
      piece.style.height = size * (0.6 + Math.random()) + "px";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + "s";
      piece.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
      container.appendChild(piece);

      setTimeout(() => piece.remove(), 6000);
    }
  }

  function init() {
    createBalloons();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    if (isBirthdayToday()) {
      setTimeout(launchConfetti, 500);
    }

    celebrateBtn.addEventListener("click", launchConfetti);

    // 点击屏幕任意处也能制造小惊喜
    document.addEventListener("click", (e) => {
      if (e.target === celebrateBtn) return;
      launchConfetti();
    });
  }

  init();
})();

