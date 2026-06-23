const router = require("express").Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const query = userId
      ? "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC"
      : "SELECT * FROM tasks ORDER BY created_at DESC";
    const values = userId ? [userId] : [];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description = "Task created successfully",
      status = "todo",
      priority = "Medium",
      due_date = null,
      user_id,
    } = req.body;

    const normalizedTitle = typeof title === "string" ? title.trim() : "";
    const normalizedDueDate = due_date === undefined || due_date === null || due_date === "" ? null : due_date;
    const normalizedUserId = user_id === undefined || user_id === null || user_id === "" ? null : user_id;

    if (!normalizedTitle) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [normalizedTitle, description, status, priority, normalizedDueDate, normalizedUserId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;