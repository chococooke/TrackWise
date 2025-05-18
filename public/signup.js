// const axios = require('axios');

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("signup-form");
  const body = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  };

  const response = await axios.post('http://localhost:3000/api/auth/signup', body);
  window.alert(response.data);
}
