module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send({ error: "Cannot process empty fields" });
    }

    console.log(username, email, password);
    return res.send(`Signed up ${username}`);
  } catch (error) {
    console.error(error);
    return res.send({ error: "Something went wrong" });
  }
};
