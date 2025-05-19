// const axios = require('axios');

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("login-form");
  const body = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      body
    );

    if ("error" in response.data) {
      window.alert(response.data.error);
    } else {
      console.log(response.data);
      window.location.href = "http://localhost:3000";
    }
  } catch (err) {
    console.error(err);
  }
}
