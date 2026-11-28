(function () {
  // ==========================================
  // متغيرات التحكم السريعة بشريط التثبيت
  // ==========================================
  const AURA_PWA_CONFIG = {
    enabled: true,
    iconUrl: '/aura-192.png',
    title: 'ثبّت تطبيق متجر أورا',
    subtitle: 'وصول أسرع وتجربة أوضح من شاشتك',
    installBtnText: 'تثبيت',
    iosSubtitle: 'اضغط المشاركة ⍗ ثم "إضافة إلى الشاشة الرئيسية"',
    showDelayMs: 2000,
    iosShowDelayMs: 2500,
    extraBottomPaddingPx: 88,
    // الألوان المتناسقة مع هوية أورا
    colors: {
      surface: '#ffffff',
      border: 'rgba(5, 209, 205, 0.35)',
      accentTeal: '#05D1CE',
      accentOrange: '#FF6B01',
      titleText: '#222222',
      descText: '#4a4a4a',
      closeBg: 'rgba(74, 74, 74, 0.08)',
      closeText: '#4a4a4a'
    }
  };

  if (!AURA_PWA_CONFIG.enabled) return;

  // عدم الإظهار إذا كان التطبيق يعمل فعلياً كـ PWA مثبت أو داخل تيليغرام
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isTelegram = !!(
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.initData &&
    window.Telegram.WebApp.initData.length > 0
  );

  if (isStandalone || isTelegram) return;

  // عدم الإزعاج إذا تم إغلاق الشريط في نفس جلسة التصفح الحالية
  const SESSION_DISMISS_KEY = 'aura_pwa_banner_dismissed_session';
  if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;

  let deferredPrompt = null;
  let bannerEl = null;
  let showTimer = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const c = AURA_PWA_CONFIG.colors;

  // حقن التنسيقات الخاصة بالشريط
  const styleEl = document.createElement('style');
  styleEl.id = 'aura-pwa-install-styles';
  styleEl.textContent = `
    #aura-pwa-install-banner {
      position: fixed;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%) translateY(130%);
      width: calc(100% - 28px);
      max-width: 422px;
      background: ${c.surface};
      border: 1.5px solid ${c.border};
      border-radius: 18px;
      padding: 10px 12px;
      box-shadow: 0 10px 26px rgba(5, 209, 205, 0.14), 0 4px 12px rgba(0, 0, 0, 0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      z-index: 9999;
      direction: rtl;
      font-family: 'Cairo', sans-serif;
      box-sizing: border-box;
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
      opacity: 0;
    }

    #aura-pwa-install-banner.aura-pwa-visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .aura-pwa-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .aura-pwa-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      object-fit: cover;
      border: 1px solid rgba(5, 209, 205, 0.25);
      background: #fcfafc;
      flex-shrink: 0;
    }

    .aura-pwa-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .aura-pwa-title {
      margin: 0;
      font-size: 13.5px;
      font-weight: 700;
      color: ${c.titleText};
      line-height: 1.25;
    }

    .aura-pwa-subtitle {
      margin: 0;
      font-size: 11px;
      font-weight: 500;
      color: ${c.descText};
      line-height: 1.3;
    }

    .aura-pwa-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    #aura-pwa-install-btn {
      background: linear-gradient(135deg, ${c.accentTeal}, #03b5b2);
      color: #ffffff;
      border: none;
      border-radius: 11px;
      padding: 7px 13px;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(5, 209, 205, 0.28);
      transition: transform 0.15s ease, opacity 0.2s ease;
    }

    #aura-pwa-install-btn:active {
      transform: scale(0.95);
      opacity: 0.9;
    }

    #aura-pwa-close-btn {
      width: 28px;
      height: 28px;
      border-radius: 9px;
      border: none;
      background: ${c.closeBg};
      color: ${c.closeText};
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 0.2s ease, transform 0.15s ease;
    }

    #aura-pwa-close-btn:active {
      transform: scale(0.92);
      background: rgba(255, 107, 1, 0.14);
      color: ${c.accentOrange};
    }
  `;
  document.head.appendChild(styleEl);

  function addBottomSafeSpace() {
    if (document.body.dataset.auraPwaPaddingApplied === '1') return;
    const computedPx = parseFloat(window.getComputedStyle(document.body).paddingBottom) || 0;
    document.body.dataset.auraPwaOrigPadding = String(computedPx);
    document.body.dataset.auraPwaPaddingApplied = '1';
    document.body.style.paddingBottom = `${computedPx + AURA_PWA_CONFIG.extraBottomPaddingPx}px`;
  }

  function restoreBottomSafeSpace() {
    if (document.body.dataset.auraPwaPaddingApplied !== '1') return;
    const orig = document.body.dataset.auraPwaOrigPadding || '0';
    document.body.style.paddingBottom = `${orig}px`;
    delete document.body.dataset.auraPwaPaddingApplied;
    delete document.body.dataset.auraPwaOrigPadding;
  }

  function buildBanner(type) {
    if (bannerEl) return;

    bannerEl = document.createElement('div');
    bannerEl.id = 'aura-pwa-install-banner';
    bannerEl.setAttribute('role', 'region');
    bannerEl.setAttribute('aria-label', 'تثبيت تطبيق متجر أورا');

    const actionHtml =
      type === 'android'
        ? `<button type="button" id="aura-pwa-install-btn">${AURA_PWA_CONFIG.installBtnText}</button>
           <button type="button" id="aura-pwa-close-btn" aria-label="إغلاق">✕</button>`
        : `<button type="button" id="aura-pwa-close-btn" aria-label="إغلاق">✕</button>`;

    const subtitleText =
      type === 'ios' ? AURA_PWA_CONFIG.iosSubtitle : AURA_PWA_CONFIG.subtitle;

    bannerEl.innerHTML = `
      <div class="aura-pwa-left">
        <img src="${AURA_PWA_CONFIG.iconUrl}" alt="متجر أورا" class="aura-pwa-icon" />
        <div class="aura-pwa-copy">
          <p class="aura-pwa-title">${AURA_PWA_CONFIG.title}</p>
          <p class="aura-pwa-subtitle">${subtitleText}</p>
        </div>
      </div>
      <div class="aura-pwa-actions">
        ${actionHtml}
      </div>
    `;

    document.body.appendChild(bannerEl);
    addBottomSafeSpace();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (bannerEl) bannerEl.classList.add('aura-pwa-visible');
      });
    });

    const closeBtn = document.getElementById('aura-pwa-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
        hideBanner();
      });
    }

    const installBtn = document.getElementById('aura-pwa-install-btn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome === 'accepted') {
          hideBanner();
        }
      });
    }
  }

  function hideBanner() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    restoreBottomSafeSpace();
    if (!bannerEl) return;

    const current = bannerEl;
    bannerEl = null;
    current.classList.remove('aura-pwa-visible');

    setTimeout(() => {
      current.remove();
    }, 360);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => buildBanner('android'), AURA_PWA_CONFIG.showDelayMs);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBanner();
  });

  if (isIOS && !isStandalone) {
    window.addEventListener('load', () => {
      if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;
      showTimer = setTimeout(() => buildBanner('ios'), AURA_PWA_CONFIG.iosShowDelayMs);
    });
  }
})();
