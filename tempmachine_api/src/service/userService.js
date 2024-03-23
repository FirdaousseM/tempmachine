const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../model/users.json");
const findOneByEmail = (email) => {
  try {
    const usersData = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(usersData);
    const user = users.find((user) => user.email === email);
    return user;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  findOneByEmail,
};
