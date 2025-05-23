let user = null;
const expenseForm = document.getElementById("expense-form");
const logoutButton = document.getElementById("logout");
const expensesDiv = document.getElementById("expensesList");

// Load all content when page loads.
document.addEventListener("DOMContentLoaded", async (event) => {
  const title = document.getElementById("title");
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    alert("You need to log in first.");
    window.location.href = "http://localhost:5000/auth/login";
  }
  user = JSON.parse(rawUser);
  title.innerHTML = `TrackWise - ${user.username}`;
  const userAvatar = document.getElementById("avatar");
  userAvatar.querySelector("p").innerHTML = user.username;

  await getUserExpenses();
  await renderExpenses();
});

// get current users's expenses
async function getUserExpenses() {
  try {
    const expenses = (await axios.get(`http://localhost:5000/exp/${user.id}`))
      .data.exp;
    localStorage.setItem("expenseList", JSON.stringify(expenses));
  } catch (err) {
    console.err(err);
  }
}

// Expense addition after form submission.
expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    let amount = expenseForm.querySelector('input[name="amount"]').value;
    let description = expenseForm.querySelector(
      "textarea[id='description']"
    ).value;
    let category = expenseForm.querySelector("select").value;

    const formData = {
      UserId: user.id,
      amount,
      description,
      category,
    };
    await axios.post("http://localhost:5000/exp", formData);

    amount = 0;
    description = "";
    category = "";

    await getUserExpenses();
    await renderExpenses();
  } catch (err) {
    console.error(err);
  }
});

// render all expenses of the current user.
async function renderExpenses() {
  try {
    const expenseList = JSON.parse(localStorage.getItem("expenseList"));
    expensesDiv.innerHTML = "";

    expenseList.forEach((expense) => {
      const exp = document.createElement("div");
      const expAmount = document.createElement("h3");
      const expDescription = document.createElement("p");
      const expCategory = document.createElement("small");

      expAmount.innerHTML = `<span>$</span> ${expense.amount}`;
      expDescription.innerText = expense.description;
      expCategory.innerText = expense.category;

      exp.className = "expense-card";
      exp.appendChild(expAmount);
      exp.appendChild(expDescription);
      exp.appendChild(expCategory);
      expensesDiv.appendChild(exp);
    });
  } catch (err) {
    console.error(err);
  }
}

// Log out.
async function logOut(event) {
  await localStorage.removeItem("user");
  await localStorage.removeItem("expenseList");
  window.location.href = "http://localhost:5000/auth/login";
}

logoutButton.addEventListener("click", logOut);
