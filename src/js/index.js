import '../scss/styles.scss';
import Inputmask from 'inputmask';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const formMessage = document.getElementById('formMessage');
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.close');

  Inputmask({ mask: '+375 (99) 999-9999' }).mask(document.querySelector('input[name="phone"]'));

  function validateForm() {
    let isValid = true;
    formMessage.innerText = '';

    document.querySelectorAll('.error-message').forEach(el => el.remove());

    form.querySelectorAll('input, textarea').forEach(input => {
      if (!input.value.trim()) {
        showError(input, 'Это поле обязательно для заполнения');
        isValid = false;
      } else if (input.name === 'email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input.value)) {
        showError(input, 'Некорректный адрес электронной почты');
        isValid = false;
      } else {
        input.classList.remove('error-border');
      }
    });

    return isValid;
  }

  function showError(input, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.innerText = message;
    input.classList.add('error-border');
    input.parentElement.appendChild(errorElement);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData(form);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const response = await fetch('http://localhost:9090/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      
      const result = await response.json();

      if (result.status === 'error') {
        formMessage.innerText = '';
        for (let [field, message] of Object.entries(result.fields)) {
          const fieldElement = document.querySelector(`[name="${field}"]`);
          if (fieldElement) {
            fieldElement.classList.add('error-border');
            formMessage.innerText += `${message}\n`;
          }
        }
      } else {
        form.reset();
        alert(result.msg);
      }
    } catch (error) {
      formMessage.innerText = 'Ошибка отправки формы';
    }
  });

  openModalBtn.addEventListener('click', () => {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  });

  closeModalBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
});
