const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 750);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("mousemove", (event) => {
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
  cursorRing.animate(
    { left: `${event.clientX}px`, top: `${event.clientY}px` },
    { duration: 350, fill: "forwards" }
  );
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 70));
    const tick = () => {
      current = Math.min(target, current + increment);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    observer.unobserve(el);
  });
}, { threshold: 0.7 });
counters.forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filters button.active").classList.remove("active");
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

let testimonialIndex = 0;
const testimonialTrack = document.getElementById("testimonialTrack");
setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % 3;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * (100 / 3)}%)`;
}, 4200);

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

const contactForm = document.querySelector('.contact-form');
const nameInput = contactForm.querySelector('input[name="name"]');
const emailInput = contactForm.querySelector('input[name="email"]');
const phoneInput = contactForm.querySelector('input[name="phone"]');
const serviceSelect = contactForm.querySelector('select[name="service"]');
const budgetSelect = contactForm.querySelector('select[name="budget"]');
const messageInput = contactForm.querySelector('textarea[name="message"]');
const submitButton = contactForm.querySelector('button[type="submit"]');

const sanitizeName = (value) => value.replace(/[^A-Za-z ]+/g, '').replace(/\s{2,}/g, ' ').trimStart();
const sanitizePhone = (value) => value.replace(/\D/g, '').slice(0, 10);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9][0-9]{9}$/;
const namePattern = /^[A-Za-z ]+$/;

nameInput.addEventListener('input', (event) => {
  const sanitized = sanitizeName(event.target.value);
  if (sanitized !== event.target.value) {
    event.target.value = sanitized;
  }
});

phoneInput.addEventListener('input', (event) => {
  const sanitized = sanitizePhone(event.target.value);
  if (sanitized !== event.target.value) {
    event.target.value = sanitized;
  }
});

phoneInput.addEventListener('paste', (event) => {
  event.preventDefault();
  const paste = (event.clipboardData || window.clipboardData).getData('text');
  const sanitized = sanitizePhone(paste);
  event.target.value = sanitized;
});

const showFieldValidity = (input) => {
  if (!input.checkValidity()) {
    input.reportValidity();
    return false;
  }
  return true;
};

const validateField = (input, value, pattern, message) => {
  if (!value) {
    input.setCustomValidity(message.empty);
    return false;
  }
  if (!pattern.test(value)) {
    input.setCustomValidity(message.invalid);
    return false;
  }
  input.setCustomValidity('');
  return true;
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameValue = nameInput.value.trim().replace(/\s{2,}/g, ' ');
  const emailValue = emailInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const serviceValue = serviceSelect.value;
  const budgetValue = budgetSelect.value;
  const messageValue = messageInput.value.trim();

  const isNameValid = validateField(nameInput, nameValue, namePattern, {
    empty: 'Please enter your name.',
    invalid: 'Name should contain letters and spaces only.'
  });

  const isEmailValid = validateField(emailInput, emailValue, emailPattern, {
    empty: 'Please enter your email address.',
    invalid: 'Please enter a valid email address.'
  });

  const isPhoneValid = validateField(phoneInput, phoneValue, phonePattern, {
    empty: 'Please enter your mobile number.',
    invalid: 'Please enter a valid 10-digit Indian mobile number.'
  });

  const isServiceValid = Boolean(serviceValue);
  const isBudgetValid = Boolean(budgetValue);
  const isMessageValid = Boolean(messageValue);

  if (!isServiceValid) {
    serviceSelect.setCustomValidity('Please select a service.');
  } else {
    serviceSelect.setCustomValidity('');
  }

  if (!isBudgetValid) {
    budgetSelect.setCustomValidity('Please select a budget range.');
  } else {
    budgetSelect.setCustomValidity('');
  }

  if (!messageValue) {
    messageInput.setCustomValidity('Please tell us briefly about your project.');
  } else if (messageValue.length > 500) {
    messageInput.setCustomValidity('Message must be 500 characters or less.');
  } else {
    messageInput.setCustomValidity('');
  }

  const isServiceOk = showFieldValidity(serviceSelect);
  const isBudgetOk = showFieldValidity(budgetSelect);
  const isMessageOk = showFieldValidity(messageInput);

  if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceOk || !isBudgetOk || !isMessageOk) {
    const firstInvalid = [nameInput, emailInput, phoneInput, serviceSelect, budgetSelect, messageInput].find((input) => !input.checkValidity());
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.reportValidity();
    }
    return;
  }

  nameInput.value = nameValue;
  messageInput.value = messageValue;

  const whatsappMessage = `Hello ARC Stack Web Studio,\n\nI would like to enquire about your services.\n\n━━━━━━━━━━━━━━━━━━\n📋 ENQUIRY DETAILS\n━━━━━━━━━━━━━━━━━━\n\n👤 Name: ${nameValue}\n📧 Email: ${emailValue}\n📱 Phone: ${phoneValue}\n\n💼 Service:\n${serviceValue}\n\n💰 Which Business:\n${budgetValue}\n\n📝 Message:\n${messageValue}\n\n━━━━━━━━━━━━━━━━━━\n\nI look forward to hearing from you.\n\nThank you.`;
  const whatsappUrl = `https://wa.me/919324453478?text=${encodeURIComponent(whatsappMessage)}`;

  submitButton.disabled = true;
  submitButton.textContent = 'Opening WhatsApp...';
  window.open(whatsappUrl, '_blank');

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Enquiry';
    contactForm.reset();
  }, 1200);
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.min(110, Math.floor(window.innerWidth / 12));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 1.8 + 0.6
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? "rgba(123,47,255,.75)" : "rgba(0,229,255,.72)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 118) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,170,255,${(1 - distance / 118) * 0.16})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawParticles();
