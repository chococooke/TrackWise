let user = null;
let twToken = null;
const premiumCta = document.getElementById("premium-cta-button");
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
  const rawUser = await localStorage.getItem("user");

  if (!rawUser && !twToken) {
    alert("You need to log in first.");
    window.location.href = "http://localhost:5000/auth/login";
  }

  user = await JSON.parse(rawUser);
  twToken = user.twToken;
  title.innerHTML = `TrackWise - ${user.username}`;
  const userAvatar = document.getElementById("avatar");
  userAvatar.querySelector("p").innerHTML = user.username;

  if (user.premium === false) {
    viewLeaderboard.style.display = "none";
    ldBoardDiv.style.display = "none";
  } else {
    document.getElementById("premium-cta-wrapper").style.display = "none";
  }
  const leaderboard = (
    await axios.get("http://localhost:5000/users/leaderboard", {
      headers: {
        Authorization: `Bearer ${twToken}`,
        "Content-Type": "application/json",
      },
    })
  ).data;


  localStorage.setItem("ldboard", JSON.stringify(leaderboard));

  await getUserExpenses();
  await renderExpenses();
  await renderLeaderboard();
});

// get current users's expenses
async function getUserExpenses() {
  try {
    const expenses = (
      await axios.get(`http://localhost:5000/exp/${user.id}`, {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      })
    ).data.exp;
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
    await axios.post("http://localhost:5000/exp", formData, {
      headers: {
        Authorization: `Bearer ${twToken}`,
        "Content-Type": "application/json",
      },
    });

    expenseForm.reset();

    await getUserExpenses();
    await renderExpenses();
  } catch (err) {
    console.error(err);
  }
});

async function renderExpenses() {
  try {
    const expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

    expensesDiv.innerHTML = "";

    if (!Array.isArray(expenseList) || expenseList.length === 0) {
      expensesDiv.innerHTML = '<p class="empty-state">No expenses yet.</p>';
      return;
    }

    expenseList.forEach((expense, index) => {
      const expenseCard = document.createElement("div");
      expenseCard.className = "expense-card";
      expenseCard.dataset.id = expense.id || index; // Add data-id for future interactions

      const amount = document.createElement("h3");
      amount.className = "expense-amount";
      amount.innerHTML = `<span class="currency">₹</span>${Number(
        expense.amount
      ).toFixed(2)}`;

      const description = document.createElement("p");
      description.className = "expense-description";
      description.innerText = expense.description || "No description";

      const category = document.createElement("small");
      category.className = "expense-category";
      category.innerText = expense.category || "Uncategorized";

      const actions = document.createElement("div");
      actions.className = "expense-actions";

      const editButton = document.createElement("button");
      editButton.className = "action-button edit-button";
      editButton.innerText = "Edit";
      editButton.addEventListener("click", () =>
        console.log(`Edit expense ${expense.id || index}`)
      );

      const deleteButton = document.createElement("button");
      deleteButton.className = "action-button delete-button";
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", async (event) => {
        try {
          const response = await axios.delete(
            `http://localhost:5000/exp/delete/${expense.id}`,
            {
              headers: {
                Authorization: `Bearer ${twToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.data.success) {
            window.alert("Error while deleting expense");
          }

          await getUserExpenses();
          await renderExpenses();
        } catch (err) {
          console.error(err);
          window.alert("Error while deleting expense");
        }
      });

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);

      expenseCard.appendChild(amount);
      expenseCard.appendChild(description);
      expenseCard.appendChild(category);
      expenseCard.appendChild(actions);

      expensesDiv.appendChild(expenseCard);
    });
  } catch (err) {
    console.error("Render expenses error:", err);
    expensesDiv.innerHTML =
      '<p class="error-state">Error loading expenses.</p>';
  }
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------

async function renderLeaderboard() {
  try {
    let ldboard = JSON.parse(localStorage.getItem("ldboard")) || [];

    if (!Array.isArray(ldboard)) {
      ldboard = Object.entries(ldboard).map(([username, exp]) => ({
        username,
        exp: Number(exp),
      }));
    }

    ldboard.sort((a, b) => b.exp - a.exp);

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

// Payment
const cashFree = Cashfree({ mode: "sandbox" });

premiumCta.addEventListener("click", async (event) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/payment/create-order`,
      {
        amount: 100.5,
        name: user.username,
        email: user.email,
      },
      {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      alert("Failed to create order");
      return;
    }

    const checkoutOptions = {
      paymentSessionId: response.data.payment_session_id,
      redirectTarget: `_self`,
    };

    cashFree.checkout(checkoutOptions);
  } catch (err) {
    console.error(`Error:`, err);
    alert(`Payment initiation failed`);
  }
});

// Log out.
async function logOut(event) {
  await localStorage.removeItem("user");
  await localStorage.removeItem("expenseList");
  await localStorage.removeItem("ldboard");
  window.location.href = "http://localhost:5000/auth/login";
}

logoutButton.addEventListener("click", logOut);
