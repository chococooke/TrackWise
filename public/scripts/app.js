let user = null;
let twToken = null;
const premiumCta = document.getElementById("premium-cta-button");
const expenseForm = document.getElementById("expense-form");
const logoutButton = document.getElementById("logout");
const expensesDiv = document.getElementById("expensesList");
const ldBoardDiv = document.getElementById("ldboard");
const viewMain = document.getElementById("main-view");
const viewLeaderboard = document.getElementById("leaderboard-view");
const reportBtn = document.getElementById("report-btn");

let currentExpensesPage = 1;
let currentLeaderboardPage = 1;
const expensesPerPage = 10;
const leaderboardPerPage = 15;

reportBtn.addEventListener("click", (event) => {
  window.location.href = "http://localhost:5000/app/report";
});

viewLeaderboard.style.backgroundColor = "lightgrey";
viewLeaderboard.style.color = "black";

viewMain.addEventListener("click", (event) => {
  viewLeaderboard.style.backgroundColor = "lightgrey";
  viewLeaderboard.style.color = "black";
  viewMain.style.backgroundColor = "#333";
  viewMain.style.color = "white";
  expensesDiv.style.display = "";
  ldBoardDiv.style.display = "none";
});

viewLeaderboard.addEventListener("click", (event) => {
  viewLeaderboard.style.backgroundColor = "#333";
  viewLeaderboard.style.color = "white";
  viewMain.style.backgroundColor = "lightgrey";
  viewMain.style.color = "black";
  expensesDiv.style.display = "none";
  ldBoardDiv.style.display = "";
});

document.addEventListener("DOMContentLoaded", async (event) => {
  ldBoardDiv.style.display = "none";
  const title = document.getElementById("title");
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    alert("You need to log in first.");
    window.location.href = "http://localhost:5000/auth/login";
    return;
  }

  user = JSON.parse(rawUser);
  twToken = user.twToken;
  if (!twToken) {
    alert("Invalid session. Please log in again.");
    window.location.href = "http://localhost:5000/auth/login";
    return;
  }

  title.innerHTML = `TrackWise - ${user.username}`;
  const userAvatar = document.getElementById("avatar");
  userAvatar.querySelector("p").innerHTML = user.username;

  if (user.premium === false) {
    viewLeaderboard.style.display = "none";
    ldBoardDiv.style.display = "none";
    reportBtn.style.display = "none";
  } else {
    document.getElementById("premium-cta-wrapper").style.display = "none";
    reportBtn.style.display = "";
    await fetchLeaderboard(currentLeaderboardPage);
  }

  await getUserExpenses(currentExpensesPage);
  await renderExpenses();
});

async function getUserExpenses(page = 1) {
  try {
    const response = await axios.get(
      `http://localhost:5000/exp/${user.id}?page=${page}&limit=${expensesPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("expenseList", JSON.stringify(response.data.data));
    localStorage.setItem(
      "expensesPagination",
      JSON.stringify(response.data.pagination)
    );
    currentExpensesPage = page;
  } catch (err) {
    console.error("Fetch expenses error:", err);
    expensesDiv.innerHTML =
      '<p class="error-state">Error loading expenses.</p>';
  }
}

async function fetchLeaderboard(page = 1) {
  try {
    const response = await axios.get(
      `http://localhost:5000/users/leaderboard?page=${page}&limit=${leaderboardPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("ldboard", JSON.stringify(response.data.data));
    localStorage.setItem(
      "leaderboardPagination",
      JSON.stringify(response.data.pagination)
    );
    currentLeaderboardPage = page;
    await renderLeaderboard();
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    ldBoardDiv.innerHTML =
      '<p class="error-state">Error loading leaderboard.</p>';
  }
}

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    let amount = expenseForm.querySelector('input[name="amount"]').value;
    let description = expenseForm.querySelector(
      "textarea[id='description']"
    ).value;
    let category = expenseForm.querySelector("select").value;

    const formData = { UserId: user.id, amount, description, category };
    await axios.post("http://localhost:5000/exp", formData, {
      headers: {
        Authorization: `Bearer ${twToken}`,
        "Content-Type": "application/json",
      },
    });

    expenseForm.reset();
    await getUserExpenses(currentExpensesPage);
    await renderExpenses();
  } catch (err) {
    console.error("Expense submission error:", err);
    alert("Failed to add expense.");
  }
});

async function renderExpenses() {
  console.log("hello");
  try {
    const expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];
    console.log(expenseList[0]);
    const pagination = JSON.parse(
      localStorage.getItem("expensesPagination")
    ) || {
      page: 1,
      totalPages: 1,
    };

    expensesDiv.innerHTML = "";

    if (!Array.isArray(expenseList) || expenseList.length === 0) {
      expensesDiv.innerHTML = '<p class="empty-state">No expenses yet.</p>';
    } else {
      expenseList.forEach((expense, index) => {
        const expenseCard = document.createElement("div");
        expenseCard.className = "expense-card";
        expenseCard.dataset.id = expense.id || index;

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
        editButton.setAttribute("key", index);
        editButton.innerText = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.className = "action-button delete-button";
        deleteButton.innerText = "Delete";

        const editExpDiv = document.getElementById("edit-exp-div");
        const editExpForm = document.getElementById("edit-exp-div-form");

        const cancelEditButton = document.getElementById("cancel-edit-btn");
        cancelEditButton.addEventListener(
          "click",
          () => (editExpDiv.style.display = "none")
        );

        editButton.addEventListener("click", async () => {
          const formData = {
            amount: "",
            description: "",
          };

          const key = editButton.attributes["key"].value;
          const expense = expenseList[parseInt(key, 10)];
          const amountInput = document.getElementById("edit-form-amount");
          amountInput.value = expense.amount;

          const descriptionInput = document.getElementById(
            "edit-form-description"
          );
          descriptionInput.value = expense.description;

          amountInput.onchange = (event) =>
            (formData.amount = event.target.value);

          descriptionInput.onchange = (event) =>
            (formData.description = event.target.value);

          if (formData.amount === "") {
            formData.amount = expense.amount;
          }

          if (formData.description === "") {
            formData.description = expense.description;
          }

          editExpDiv.style.display = "flex";

          editExpForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log(formData);
            try {
              const response = await axios.put(
                `http://localhost:5000/exp/update/${expense.id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${twToken}`,
                    "Content-Type": `application/json`,
                  },
                }
              );

              if (response.status !== 200) {
                window.alert("Error while deleting expense");
              } else {
                window.alert("Updated successfully");
                editExpDiv.style.display = "none";
              }

              console.log(response);

              await getUserExpenses(currentExpensesPage);
              await renderExpenses();
            } catch (err) {
              console.error(err);
            }
          });

          console.log(expense);
        });

        deleteButton.addEventListener("click", async () => {
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
              alert("Error while deleting expense");
            }

            await getUserExpenses(currentExpensesPage);
            await renderExpenses();
          } catch (err) {
            console.error("Delete expense error:", err);
            alert("Error while deleting expense");
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
    }

    renderPagination("expensesList", pagination, getUserExpenses);
  } catch (err) {
    console.error("Render expenses error:", err);
    expensesDiv.innerHTML =
      '<p class="error-state">Error loading expenses.</p>';
  }
}

async function renderLeaderboard() {
  try {
    const ldboard = JSON.parse(localStorage.getItem("ldboard")) || [];
    const pagination = JSON.parse(
      localStorage.getItem("leaderboardPagination")
    ) || {
      page: 1,
      totalPages: 1,
    };

    ldBoardDiv.innerHTML = "<h3>Leaderboard</h3>";

    if (!Array.isArray(ldboard) || ldboard.length === 0) {
      ldBoardDiv.innerHTML += '<p class="empty-state">No entries yet.</p>';
    } else {
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
    }

    renderPagination("ldboard", pagination, fetchLeaderboard);
  } catch (err) {
    console.error("Leaderboard render error:", err);
    ldBoardDiv.innerHTML =
      '<p class="error-state">Error loading leaderboard.</p>';
  }
}

function renderPagination(containerId, pagination, fetchFunction) {
  const container = document.getElementById(containerId);
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination-controls";

  const prevButton = document.createElement("button");
  prevButton.innerText = "Previous";
  prevButton.disabled = pagination.page === 1;
  prevButton.addEventListener("click", async (event) => {
    console.log(event);
    if (pagination.page > 1) {
      await fetchFunction(pagination.page - 1);
      renderExpenses();
    }
  });

  const pageInfo = document.createElement("span");
  pageInfo.innerText = `Page ${pagination.page} of ${pagination.totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.disabled = pagination.page === pagination.totalPages;
  nextButton.addEventListener("click", async (event) => {
    console.log(event);
    if (pagination.page < pagination.totalPages) {
      await fetchFunction(pagination.page + 1);
      renderExpenses();
    }
  });

  paginationDiv.appendChild(prevButton);
  paginationDiv.appendChild(pageInfo);
  paginationDiv.appendChild(nextButton);

  const existingPagination = container.querySelector(".pagination-controls");
  if (existingPagination) existingPagination.remove();

  container.appendChild(paginationDiv);
}

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
    console.error("Payment error:", err);
    alert("Payment initiation failed");
  }
});

async function logOut(event) {
  localStorage.removeItem("user");
  localStorage.removeItem("expenseList");
  localStorage.removeItem("ldboard");
  localStorage.removeItem("expensesPagination");
  localStorage.removeItem("leaderboardPagination");
  localStorage.removeItem("twReport");
  window.location.href = "http://localhost:5000/auth/login";
}

logoutButton.addEventListener("click", logOut);
