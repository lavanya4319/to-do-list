const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_FILE = path.join(__dirname, "..", "data", "users.json");

const ensureDataFile = () => {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
};

const readUsers = () => {
  ensureDataFile();

  try {
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return content ? JSON.parse(content) : {};
  } catch {
    return {};
  }
};

const writeUsers = (users) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const addUser = async ({ name, email, password }) => {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users[normalizedEmail]) {
    return { exists: true };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    name: String(name || "").trim(),
    email: normalizedEmail,
    password: hashedPassword,
  };

  users[normalizedEmail] = user;
  writeUsers(users);

  return {
    exists: false,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

const verifyUser = async (email, password) => {
  const users = readUsers();
  const user = users[normalizeEmail(email)];

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email };
};

module.exports = { addUser, verifyUser }; 
