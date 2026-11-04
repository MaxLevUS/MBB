(() => {
  "use strict";
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Portfolio filters (client-side only, no external dependencies).
  const filters = [...document.querySelectorAll(".filter")];
  const cards = [...document.querySelectorAll(".work-card")];
  const visibleCards = () => cards.filter(card => !card.hidden);
  filters.forEach(filter => filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;
    filters.forEach(button => {
      const isActive = button === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    cards.forEach(card => { card.hidden = selected !== "all" && card.dataset.category !== selected; });
  }));

  // Image viewer with keyboard controls and focus return.
  const modal = document.getElementById("lightbox");
  const modalImage = document.getElementById("lightboxImage");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeButton = modal.querySelector(".lightbox-close");
  let currentIndex = 0;
  let opener = null;
  const showImage = (index) => {
    const available = visibleCards();
    if (!available.length) return;
    currentIndex = (index + available.length) % available.length;
    const selected = available[currentIndex];
    modalImage.src = selected.querySelector(".work-open").dataset.full;
    modalImage.alt = selected.querySelector("img").alt;
    modalCaption.textContent = selected.querySelector("figcaption span").textContent;
  };
  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.removeAttribute("src");
    if (opener) opener.focus();
  };
  cards.forEach(card => {
    card.querySelector(".work-open").addEventListener("click", event => {
      opener = event.currentTarget;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      showImage(visibleCards().indexOf(card));
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", closeModal);
  modal.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentIndex - 1));
  modal.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentIndex + 1));
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => {
    if (modal.hidden) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
    if (event.key === "Tab") {
      const focusables = [...modal.querySelectorAll("button")];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Uses the same FormSubmit destination as the existing MBB homepage.
  const form = document.getElementById("anaInquiry");
  const status = document.getElementById("formStatus");
  const sendButton = document.getElementById("sendInquiry");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.hidden = true;
    status.classList.remove("is-error");
    sendButton.disabled = true;
    sendButton.textContent = "Sending…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("Request failed");
      // FormSubmit returns a JSON success flag; check when present.
      const result = await response.json().catch(() => null);
      if (result && (result.success === false || result.success === "false")) throw new Error("Not accepted");
      form.reset();
      status.textContent = "Thank you! Your inquiry has been sent. Our team will be in touch soon.";
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "We couldn't send your inquiry. Please try again, or email MakeupMinnesota@gmail.com.";
    } finally {
      status.hidden = false;
      sendButton.disabled = false;
      sendButton.innerHTML = 'Send inquiry <span aria-hidden="true">↗</span>';
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
})();
