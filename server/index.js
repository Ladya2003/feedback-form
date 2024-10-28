const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const isValidEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.post('/api/registration', (req, res) => {
  const { name, email, phone, message } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Это поле обязательно для заполнения';
  }
  if (!email || !email.trim()) {
    errors.email = 'Это поле обязательно для заполнения';
  } else if (!isValidEmail(email)) {
    errors.email = 'Некорректный адрес электронной почты';
  }
  if (!phone || !phone.trim()) {
    errors.phone = 'Это поле обязательно для заполнения';
  }
  if (!message || !message.trim()) {
    errors.message = 'Это поле обязательно для заполнения';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 'error', fields: errors });
  }

  res.status(200).json({ status: 'success', msg: 'Ваша заявка успешно отправлена' });
});

app.listen(9090, () => {
  console.log('Сервер запущен на http://localhost:9090');
});
