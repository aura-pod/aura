(function () {
  const SECRET_KEY = "2026";
  const STORAGE_KEY = "aura_owner_unlocked";

  const params = new URLSearchParams(window.location.search);
  if (params.get("aura") === SECRET_KEY) {
    localStorage.setItem(STORAGE_KEY, "true");
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    return;
  }

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    return;
  }

  // تحميل خط Cairo تلقائياً
  if (!document.getElementById("aura-cairo-font")) {
    const fontLink = document.createElement("link");
    fontLink.id = "aura-cairo-font";
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Cairo:wght@600;700&display=swap";
    document.head.appendChild(fontLink);
  }

  const overlay = document.createElement("div");
  overlay.id = "aura-coming-soon-lock";
  overlay.innerHTML = `
    <style>
      #aura-coming-soon-lock {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: grid;
        place-items: center;
        background: #F4F5F2;
        color: #14181F;
        font-family: "Cairo", system-ui, -apple-system, sans-serif;
        padding: 24px;
        overflow: hidden;
        direction: rtl;
      }

      /* بقعتان منفصلتان تماماً لكل لون بدون تدرج بينهما */
      #aura-coming-soon-lock .spot-teal {
        position: absolute;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        background: #05D1CE;
        opacity: 0.14;
        filter: blur(55px);
        top: -60px;
        right: -50px;
        pointer-events: none;
      }

      #aura-coming-soon-lock .spot-orange {
        position: absolute;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        background: #FF6B01;
        opacity: 0.14;
        filter: blur(55px);
        bottom: -60px;
        left: -50px;
        pointer-events: none;
      }

      /* البطاقة الزجاجية مع لمعة متحركة */
      #aura-coming-soon-lock .card {
        position: relative;
        z-index: 1;
        max-width: 520px;
        width: 100%;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(20, 24, 31, 0.1);
        border-radius: 24px;
        padding: 44px 28px;
        text-align: center;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 18px 45px rgba(20, 24, 31, 0.08);
        overflow: hidden;
      }

      /* لمعة زجاجية تمر عبر البطاقة */
      #aura-coming-soon-lock .card::before {
        content: "";
        position: absolute;
        top: 0;
        left: -130%;
        width: 65%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.75),
          transparent
        );
        transform: skewX(-22deg);
        animation: auraGlassSweep 4.2s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes auraGlassSweep {
        0% { left: -130%; }
        55% { left: 150%; }
        100% { left: 150%; }
      }

      /* شارة علوية بلون الفيروزي فقط */
      #aura-coming-soon-lock .pill-teal {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(5, 209, 206, 0.12);
        border: 1px solid rgba(5, 209, 206, 0.35);
        margin-bottom: 18px;
      }

      #aura-coming-soon-lock .dot-teal {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #05D1CE;
      }

      #aura-coming-soon-lock p {
        position: relative;
        z-index: 1;
        margin: 0;
        font-family: "Cairo", sans-serif;
        font-size: clamp(1.2rem, 3.8vw, 1.65rem);
        line-height: 1.75;
        font-weight: 700;
        color: #14181F;
      }

      /* خط فاصل صغير باللون البرتقالي فقط */
      #aura-coming-soon-lock .accent-orange {
        width: 64px;
        height: 4px;
        margin: 20px auto 0;
        border-radius: 999px;
        background: #FF6B01;
      }
    </style>

    <div class="spot-teal"></div>
    <div class="spot-orange"></div>

    <div class="card">
      <div class="pill-teal">
        <span class="dot-teal"></span>
      </div>
      <p>نحن قيد التجهيز حالياً لنقدم لكم تجربة مميزة .. قريباً</p>
      <div class="accent-orange"></div>
    </div>
  `;

  document.documentElement.appendChild(overlay);
  document.documentElement.style.overflow = "hidden";
})();
