(function () {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (items) => items[rand(0, items.length - 1)];

  function luhnCheckDigit(digits) {
    let sum = 0;
    let shouldDouble = true;
    for (let i = digits.length - 1; i >= 0; i -= 1) {
      let digit = Number.parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (10 - (sum % 10)) % 10;
  }

  function makeCardNumber(prefix, totalLength = 16) {
    let digits = prefix;
    while (digits.length < totalLength - 1) {
      digits += String(rand(0, 9));
    }
    digits += String(luhnCheckDigit(digits));
    return digits;
  }

  const names = ["سارة أحمد", "محمد علي", "فاطمة يوسف", "عبدالله خالد", "نور حسن"];
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const years = [2027, 2028, 2029, 2030, 2031];
  const cards = [
    { prefix: "4", brand: "visa" },
    { prefix: "51", brand: "mastercard" },
  ];
  const selectedCard = pick(cards);

  const values = {
    cardNumber: makeCardNumber(selectedCard.prefix),
    cardHolderName: pick(names),
    expiryMonth: pick(months),
    expiryYear: String(pick(years)),
    cvv: String(rand(100, 999)),
  };

  Object.entries(values).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  });

  const cardInput = document.getElementById("cardNumber");
  if (cardInput) {
    cardInput.value = cardInput.value.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
    cardInput.dispatchEvent(new Event("input", { bubbles: true }));
    cardInput.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  console.log("Payment test values inserted:", values, selectedCard.brand);
})();
