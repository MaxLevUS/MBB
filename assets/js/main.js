const header=document.getElementById('header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30));

const peopleCount = document.getElementById('peopleCount');
document.getElementById('peopleMinus').addEventListener('click', () => {
  peopleCount.value = Math.max(1, Number(peopleCount.value || 1) - 1);
});
document.getElementById('peoplePlus').addEventListener('click', () => {
  peopleCount.value = Math.min(30, Number(peopleCount.value || 1) + 1);
});

const serviceSelect = document.getElementById('serviceSelect');
const serviceTrigger = serviceSelect.querySelector('.custom-select-trigger');
const serviceLabel = document.getElementById('serviceLabel');
const serviceValue = document.getElementById('serviceValue');
const serviceOptions = serviceSelect.querySelectorAll('.custom-select-option');

serviceTrigger.addEventListener('click', () => {
  const isOpen = serviceSelect.classList.toggle('open');
  serviceTrigger.setAttribute('aria-expanded', String(isOpen));
});

serviceOptions.forEach(option => {
  option.addEventListener('click', () => {
    serviceOptions.forEach(item => item.classList.remove('selected'));
    option.classList.add('selected');
    serviceLabel.textContent = option.dataset.value;
    serviceValue.value = option.dataset.value;
    serviceTrigger.classList.add('has-value');
    serviceSelect.classList.remove('open');
    serviceTrigger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  if (!serviceSelect.contains(event.target)) {
    serviceSelect.classList.remove('open');
    serviceTrigger.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('inquiryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const button = document.getElementById('submitButton');
  const success = document.getElementById('success');
  const error = document.getElementById('formError');

  success.style.display = 'none';
  error.style.display = 'none';
  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error('Form submission failed');

    form.reset();
    serviceValue.value = '';
    serviceLabel.textContent = 'Service needed';
    serviceTrigger.classList.remove('has-value');
    serviceOptions.forEach(item => item.classList.remove('selected'));
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    error.style.display = 'block';
  } finally {
    button.disabled = false;
    button.textContent = 'Send Inquiry';
  }
});


const portfolioButtons = document.querySelectorAll(".portfolio-open");
const portfolioLightbox = document.getElementById("portfolioLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

let lastFocusedPortfolioButton = null;

function openPortfolioLightbox(button) {
  const fullImage = button.dataset.full;
  const previewImage = button.querySelector("img");

  if (!fullImage || !portfolioLightbox || !lightboxImage) {
    return;
  }

  lastFocusedPortfolioButton = button;

  lightboxImage.src = fullImage;
  lightboxImage.alt =
    previewImage?.alt || "Expanded bridal portfolio image";

  portfolioLightbox.classList.add("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");

  lightboxClose.focus();
}

function closePortfolioLightbox() {
  if (!portfolioLightbox || !lightboxImage) {
    return;
  }

  portfolioLightbox.classList.remove("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  lightboxImage.src = "";

  if (lastFocusedPortfolioButton) {
    lastFocusedPortfolioButton.focus();
  }
}

portfolioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPortfolioLightbox(button);
  });
});

lightboxClose?.addEventListener("click", closePortfolioLightbox);

portfolioLightbox?.addEventListener("click", (event) => {
  if (event.target === portfolioLightbox) {
    closePortfolioLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    portfolioLightbox?.classList.contains("is-open")
  ) {
    closePortfolioLightbox();
  }
});
