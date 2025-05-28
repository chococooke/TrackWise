async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("auth-form");
  const body = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      body
    );

    if ("error" in response.data) {
      window.alert(response.data.error);
    } else {
      console.log(response.data);
      await localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "http://localhost:5000/app";
    }
  } catch (err) {
    console.error(err);
  }
}
