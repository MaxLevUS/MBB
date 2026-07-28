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
