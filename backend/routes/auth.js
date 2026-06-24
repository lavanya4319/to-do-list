const router = require("express").Router();
const { addUser, verifyUser } = require("../utils/authStore");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const result = await addUser({ name, email, password });

    if (result.exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    res.json(result.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await verifyUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;