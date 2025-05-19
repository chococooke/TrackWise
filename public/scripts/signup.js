// const axios = require('axios');

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("signup-form");
  const body = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/signup",
      body
    );

    if ("error" in response.data) {
      window.alert(response.data.error);
    } else {
      console.log(response.data);
    }
  } catch (err) {
    console.error(err);
  }
}
