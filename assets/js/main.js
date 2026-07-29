const header = document.getElementById("header");

if (header) {
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* People counter */

const peopleCount = document.getElementById("peopleCount");
const peopleMinus = document.getElementById("peopleMinus");
const peoplePlus = document.getElementById("peoplePlus");

if (peopleCount && peopleMinus && peoplePlus) {
  peopleMinus.addEventListener("click", () => {
    const current = Number(peopleCount.value || 1);
    peopleCount.value = Math.max(1, current - 1);
  });

  peoplePlus.addEventListener("click", () => {
    const current = Number(peopleCount.value || 1);
    peopleCount.value = Math.min(30, current + 1);
  });

  peopleCount.addEventListener("change", () => {
    const current = Number(peopleCount.value || 1);
    peopleCount.value = Math.min(30, Math.max(1, current));
  });
}

/* Event date picker */

const eventDate = document.getElementById("eventDate");
const openDatePicker = document.getElementById("openDatePicker");

function showEventDatePicker() {
  if (!eventDate) {
    return;
  }

  try {
    if (typeof eventDate.showPicker === "function") {
      eventDate.showPicker();
    } else {
      eventDate.focus();
      eventDate.click();
    }
  } catch (error) {
    eventDate.focus();
    eventDate.click();
  }
}

openDatePicker?.addEventListener("click", showEventDatePicker);

eventDate?.addEventListener("click", () => {
  try {
    if (typeof eventDate.showPicker === "function") {
      eventDate.showPicker();
    }
  } catch (error) {
    /*
      На некоторых мобильных браузерах календарь
      откроется обычным нативным способом.
    */
  }
});



/* Custom service dropdown */

const serviceSelect = document.getElementById("serviceSelect");
const serviceLabel = document.getElementById("serviceLabel");
const serviceValue = document.getElementById("serviceValue");

let serviceTrigger = null;
let serviceOptions = [];

if (serviceSelect && serviceLabel && serviceValue) {
  serviceTrigger = serviceSelect.querySelector(".custom-select-trigger");
  serviceOptions = Array.from(
    serviceSelect.querySelectorAll(".custom-select-option")
  );

  serviceTrigger?.addEventListener("click", () => {
    const isOpen = serviceSelect.classList.toggle("open");
    serviceTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  serviceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      serviceOptions.forEach((item) => item.classList.remove("selected"));
      option.classList.add("selected");

      serviceLabel.textContent = option.dataset.value || option.textContent;
      serviceValue.value = option.dataset.value || option.textContent || "";

      serviceTrigger?.classList.add("has-value");
      serviceSelect.classList.remove("open");
      serviceTrigger?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!serviceSelect.contains(event.target)) {
      serviceSelect.classList.remove("open");
      serviceTrigger?.setAttribute("aria-expanded", "false");
    }
  });
}

/* Contact form */

const inquiryForm = document.getElementById("inquiryForm");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = document.getElementById("submitButton");
    const success = document.getElementById("success");
    const error = document.getElementById("formError");

    if (!serviceValue?.value) {
      serviceSelect?.classList.add("open");
      serviceTrigger?.setAttribute("aria-expanded", "true");
      serviceTrigger?.focus();
      return;
    }

    if (success) success.style.display = "none";
    if (error) error.style.display = "none";

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      const response = await fetch(inquiryForm.action, {
        method: "POST",
        body: new FormData(inquiryForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      inquiryForm.reset();

      if (serviceValue) serviceValue.value = "";
      if (serviceLabel) serviceLabel.textContent = "Service needed";

      serviceTrigger?.classList.remove("has-value");
      serviceOptions.forEach((item) => item.classList.remove("selected"));

      if (peopleCount) peopleCount.value = "1";

      if (success) {
        success.style.display = "block";
        success.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (submissionError) {
      if (error) {
        error.style.display = "block";
        error.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Send Inquiry";
      }
    }
  });
}

/* Portfolio fullscreen lightbox */

const portfolioButtons = document.querySelectorAll(".portfolio-open");
const portfolioLightbox = document.getElementById("portfolioLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

let lastFocusedPortfolioButton = null;

function openPortfolioLightbox(button) {
  if (!portfolioLightbox || !lightboxImage || !button) return;

  const fullImage = button.dataset.full;
  const previewImage = button.querySelector("img");

  if (!fullImage) return;

  lastFocusedPortfolioButton = button;
  lightboxImage.src = fullImage;
  lightboxImage.alt =
    previewImage?.alt || "Expanded bridal portfolio image";

  portfolioLightbox.classList.add("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");

  lightboxClose?.focus();
}

function closePortfolioLightbox() {
  if (!portfolioLightbox || !lightboxImage) return;

  portfolioLightbox.classList.remove("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  lightboxImage.src = "";

  lastFocusedPortfolioButton?.focus();
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
