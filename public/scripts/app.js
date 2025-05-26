let user = null;
const expenseForm = document.getElementById("expense-form");
const logoutButton = document.getElementById("logout");
const expensesDiv = document.getElementById("expensesList");
const ldBoardDiv = document.getElementById("ldboard");

const viewMain = document.getElementById("main-view");
const viewLeaderboard = document.getElementById("leaderboard-view");

viewMain.addEventListener("click", (event) => {
  expensesDiv.style.display = "";
  ldBoardDiv.style.display = "none";
});

viewLeaderboard.addEventListener("click", (event) => {
  expensesDiv.style.display = "none";
  ldBoardDiv.style.display = "";
});

// Load all content when page loads.
document.addEventListener("DOMContentLoaded", async (event) => {
  ldBoardDiv.style.display = "none";
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

  const leaderboard = (
    await axios.get("http://localhost:5000/users/leaderboard")
  ).data;

  console.log(leaderboard);

  localStorage.setItem("ldboard", JSON.stringify(leaderboard));

  await getUserExpenses();
  await renderExpenses();
  await renderLeaderboard();
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
// async function renderExpenses() {
//   try {
//     const expenseList = JSON.parse(localStorage.getItem("expenseList"));
//     expensesDiv.innerHTML = "";

//     expenseList.forEach((expense) => {
//       const exp = document.createElement("div");
//       const expAmount = document.createElement("h3");
//       const expDescription = document.createElement("p");
//       const expCategory = document.createElement("small");

//       expAmount.innerHTML = `<span>$</span> ${expense.amount}`;
//       expDescription.innerText = expense.description;
//       expCategory.innerText = expense.category;

//       exp.className = "expense-card";
//       exp.appendChild(expAmount);
//       exp.appendChild(expDescription);
//       exp.appendChild(expCategory);
//       expensesDiv.appendChild(exp);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

async function renderExpenses() {
  try {
    // Parse expense list from localStorage with fallback
    const expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

    // Clear existing content
    expensesDiv.innerHTML = "";

    // Handle empty state
    if (!Array.isArray(expenseList) || expenseList.length === 0) {
      expensesDiv.innerHTML = '<p class="empty-state">No expenses yet.</p>';
      return;
    }

    // Render each expense
    expenseList.forEach((expense, index) => {
      // Create expense card container
      const expenseCard = document.createElement("div");
      expenseCard.className = "expense-card";
      expenseCard.dataset.id = expense.id || index; // Add data-id for future interactions

      // Create amount element
      const amount = document.createElement("h3");
      amount.className = "expense-amount";
      amount.innerHTML = `<span class="currency">₹</span>${Number(expense.amount).toFixed(2)}`;

      // Create description element
      const description = document.createElement("p");
      description.className = "expense-description";
      description.innerText = expense.description || "No description";

      // Create category element
      const category = document.createElement("small");
      category.className = "expense-category";
      category.innerText = expense.category || "Uncategorized";

      // Create action buttons (optional, consistent with prior script.js)
      const actions = document.createElement("div");
      actions.className = "expense-actions";

      const editButton = document.createElement("button");
      editButton.className = "action-button edit-button";
      editButton.innerText = "Edit";
      // Placeholder for edit functionality
      editButton.addEventListener("click", () => console.log(`Edit expense ${expense.id || index}`));

      const deleteButton = document.createElement("button");
      deleteButton.className = "action-button delete-button";
      deleteButton.innerText = "Delete";
      // Placeholder for delete functionality
      deleteButton.addEventListener("click", () => console.log(`Delete expense ${expense.id || index}`));

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);

      // Append elements to card
      expenseCard.appendChild(amount);
      expenseCard.appendChild(description);
      expenseCard.appendChild(category);
      expenseCard.appendChild(actions);

      // Append card to container
      expensesDiv.appendChild(expenseCard);
    });
  } catch (err) {
    console.error("Render expenses error:", err);
    expensesDiv.innerHTML = '<p class="error-state">Error loading expenses.</p>';
  }
}

// load leaderboard
// function renderLeaderBoard() {
//   try {
//     let ldboard = JSON.parse(localStorage.getItem("ldboard"));

//     ldboard = ldboard.sort((a, b) => a.exp - b.exp);

//     ldboard.forEach((entry, index) => {
//       const h5 = document.createElement("h5");
//       h5.innerText = `${index + 1}-${entry.username}-${entry.exp}`;
//       ldBoardDiv.appendChild(h5);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// -------------------------------------------------------------------
// -------------------------------------------------------------------
async function renderLeaderboard() {
  try {
    let ldboard = JSON.parse(localStorage.getItem("ldboard")) || [];

    // Ensure ldboard is an array of objects
    if (!Array.isArray(ldboard)) {
      ldboard = Object.entries(ldboard).map(([username, exp]) => ({
        username,
        exp: Number(exp),
      }));
    }

    // Sort by expense in descending order (highest first)
    ldboard.sort((a, b) => b.exp - a.exp);

    // Clear existing content
    ldBoardDiv.innerHTML = "<h3>Leaderboard</h3>";

    if (ldboard.length === 0) {
      ldBoardDiv.innerHTML += "<p>No entries yet.</p>";
      return;
    }

    ldboard.forEach((entry, index) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = `leaderboard-entry rank-${index + 1}`;

      const rankSpan = document.createElement("span");
      rankSpan.className = "rank";
      rankSpan.innerText = `${index + 1}.`;

      const usernameSpan = document.createElement("span");
      usernameSpan.className = "username";
      usernameSpan.innerText = entry.username;

      const expenseSpan = document.createElement("span");
      expenseSpan.className = "expense";
      expenseSpan.innerText = `₹${entry.exp.toFixed(2)}`;

      entryDiv.appendChild(rankSpan);
      entryDiv.appendChild(usernameSpan);
      entryDiv.appendChild(expenseSpan);

      ldBoardDiv.appendChild(entryDiv);
    });
  } catch (err) {
    console.error("Leaderboard render error:", err);
    ldBoardDiv.innerHTML = "<p>Error loading leaderboard.</p>";
  }
}

// Log out.
async function logOut(event) {
  await localStorage.removeItem("user");
  await localStorage.removeItem("expenseList");
  window.location.href = "http://localhost:5000/auth/login";
}

logoutButton.addEventListener("click", logOut);
