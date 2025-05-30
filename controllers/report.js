const { Op } = require("sequelize");
const { Expense } = require("../models/index.js");

module.exports.getReport = async (req, res) => {
  let { month, year } = req.body;

  if (!year) {
    return res.status(422).json({ error: "Wrong input" });
  }

  if (parseInt(month) < 1 || parseInt(year < 0)) {
    return res.status(422).json({ error: "Wrong input" });
  }

  let startDate = null;
  let endDate = null;
  let duration = null;

  if (!month) {
    startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    endDate = new Date(`${year}-12-31T00:00:00.000Z`);
    duration = "yearly";
  } else {
    startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);

    if (`${parseInt(month)}`.length === 1) {
      month = `0${parseInt(month) + 1}`;
    } else if (month == 12) {
      year++;
      month = "01";
    } else {
      month = `${parseInt(month) + 1}`;
    }

    endDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    duration = "monthly";
  }

  try {
    const report = await Expense.findAll({
      where: {
        UserId: req.params.id,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: "Not found" });
    }

    res.status(200).json({ duration, report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
