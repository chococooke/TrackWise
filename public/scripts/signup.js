// const axios = require('axios');

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("auth-form");
  const body = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      body
    );

    if ("error" in response.data) {
      window.alert(response.data.error);
    } else {
      await localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "http://localhost:5000/app";
    }
  } catch (err) {
    console.error(err);
  }
}
