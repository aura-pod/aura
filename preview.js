(function () {
  const SECRET_KEY = "2026"; // الرمز السري الخاص بك
  const STORAGE_KEY = "aura_owner_unlocked";

  const params = new URLSearchParams(window.location.search);
  if (params.get("aura") === SECRET_KEY) {
    localStorage.setItem(STORAGE_KEY, "true");
    // تنظيف الرابط من شريط العنوان بعد الفتح
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    return;
  }

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    return; // صاحب الموقع: افتح المتجر الكامل مباشرة
  }

  // إخفاء محتوى المتجر عن الزوار وعرض صفحة التجهيز
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
        background: #090C10;
        color: #F4F7F9;
        font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
        padding: 24px;
        overflow: hidden;
        direction: rtl;
      }
      #aura-coming-soon-lock .glow {
        position: absolute;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        filter: blur(105px);
        opacity: 0.24;
        pointer-events: none;
        animation: auraDrift 9s ease-in-out infinite alternate;
      }
      #aura-coming-soon-lock .teal { background: #05D1CE; top: -80px; right: -70px; }
      #aura-coming-soon-lock .orange { background: #FF6B01; bottom: -80px; left: -70px; animation-delay: -4.5s; }
      @keyframes auraDrift {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(22px, -16px) scale(1.08); }
      }
      #aura-coming-soon-lock .card {
        position: relative;
        z-index: 1;
        max-width: 520px;
        width: 100%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 24px;
        padding: 44px 28px;
        text-align: center;
        backdrop-filter: blur(12px);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      }
      #aura-coming-soon-lock .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(5, 209, 206, 0.08);
        border: 1px solid rgba(5, 209, 206, 0.28);
        margin-bottom: 22px;
      }
      #aura-coming-soon-lock .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #FF6B01;
        box-shadow: 0 0 12px #FF6B01;
        animation: auraPulse 1.8s ease-in-out infinite;
      }
      @keyframes auraPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.35); opacity: 0.65; }
      }
      #aura-coming-soon-lock .bar {
        width: 68px;
        height: 3px;
        margin: 0 auto 24px;
        border-radius: 999px;
        background: linear-gradient(90deg, #05D1CE, #FF6B01);
      }
      #aura-coming-soon-lock p {
        margin: 0;
        font-size: clamp(1.2rem, 3.6vw, 1.65rem);
        line-height: 1.75;
        font-weight: 600;
        color: #F4F7F9;
      }
    </style>
    <div class="glow teal"></div>
    <div class="glow orange"></div>
    <div class="card">
      <div class="badge"><span class="dot"></span></div>
      <div class="bar"></div>
      <p>نحن قيد التجهيز حالياً لنقدم لكم تجربة مميزة .. قريباً</p>
    </div>
  `;

  document.documentElement.appendChild(overlay);
  document.documentElement.style.overflow = "hidden";
})();
