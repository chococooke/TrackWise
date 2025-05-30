let user = null;
let twToken = null;

const reportDiv = document.getElementById("report-view");
const reportTable = document.getElementById("report-table");
const reportForm = document.getElementById("report-form");

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    console.error("User not found in localStorage.");
    return;
  }

  twToken = user.twToken;

  const report = JSON.parse(localStorage.getItem("twReport"));
  if (!report) {
    await getReport();
  }

  await renderReport();
});

const getReport = async () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  try {
    const response = await axios.post(
      `http://localhost:5000/api/report/month/${user.id}`,
      { month, year },
      {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("twReport", JSON.stringify(response.data));
  } catch (err) {
    console.error("Error fetching report:", err);
  }
};

const renderReport = async () => {
  const report = JSON.parse(localStorage.getItem("twReport")).report;
  reportTable.querySelectorAll("tr:not(:first-child)").forEach((row) => {
    row.remove();
  });

  let totalExpense = 0;

  report.forEach((entry) => {
    totalExpense += entry.amount;

    const entryDate = new Date(entry.createdAt);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.amount}</td>
      <td>${entry.description}</td>
      <td>${entry.category}</td>
      <td>${entryDate.getDate()}/${
      entryDate.getMonth() + 1
    }/${entryDate.getFullYear()}</td>
    `;
    reportTable.appendChild(tr);
  });

  // Add total row
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td colspan="4" style="text-align: right; font-weight: bold;">
        Total Spent: ${totalExpense}
      </td>
  `;
  reportTable.appendChild(tr);
};

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const duration = document.getElementById("report-duration-select").value;
  const month = document.getElementById("report-month").value;
  const year = document.getElementById("form-select-year").value;
  const reqBody = {};

  if (!month && month === "null" && !year) {
    alert("Please select a valid month and year.");
    return;
  }

  if (duration == 2) {
    reqBody.year = year;
  } else {
    reqBody.month = month;
    reqBody.year = year;
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/api/report/month/${user.id}`,
      reqBody,
      {
        headers: {
          Authorization: `Bearer ${twToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("twReport", JSON.stringify(response.data));
    await renderReport();
  } catch (err) {
    console.error("Error fetching report:", err);
  }
});
