const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;