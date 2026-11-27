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

      /* بطاقة زجاجية شفافة حتى تظهر اللمعة بوضوح فوق كامل سطحها */
      #aura-coming-soon-lock .card {
        position: relative;
        z-index: 1;
        max-width: 520px;
        width: 100%;
        background: rgba(244, 245, 242, 0.36);
        border: 1px solid rgba(255, 255, 255, 0.65);
        border-radius: 24px;
        padding: 44px 28px;
        text-align: center;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 45px rgba(20, 24, 31, 0.08);
        overflow: hidden;
      }

      /* لمعة زجاجية واضحة تمر على كامل البطاقة */
      #aura-coming-soon-lock .card::before {
        content: "";
        position: absolute;
        top: 0;
        left: -135%;
        width: 58%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.55) 45%,
          rgba(255, 255, 255, 0.85) 50%,
          rgba(255, 255, 255, 0.55) 55%,
          rgba(255, 255, 255, 0) 100%
        );
        transform: skewX(-24deg);
        animation: auraGlassSweep 3.8s ease-in-out infinite;
        pointer-events: none;
        z-index: 2;
      }

      @keyframes auraGlassSweep {
        0% { left: -135%; }
        60% { left: 155%; }
        100% { left: 155%; }
      }

      /* شارة علوية بلون الفيروزي فقط */
      #aura-coming-soon-lock .pill-teal {
        position: relative;
        z-index: 1;
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
        position: relative;
        z-index: 1;
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
