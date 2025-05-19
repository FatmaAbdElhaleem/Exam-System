const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "123456"; // the password you want to use
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);
}

hashPassword();
