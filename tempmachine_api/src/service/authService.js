const { findOneByEmail } = require("./userService");

const sessionStore = {};

const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Returns
 * @route POST /login
 * @returns {Promise<object>} A promise that resolves to an object with user informations
 */
const login = async (req, res) => {
  let { email, password } = req.body;
  let existingUser;
  try {
    existingUser = findOneByEmail(email);
    const access = existingUser.access;
    if (!existingUser || existingUser.password != password) {
      console.log("Utilisateur non trouvé");
    } else {
      const sessionId = generateSessionId();
      sessionStore[sessionId] = { access };

      res.cookie("sessionId", sessionId);
      res.status(200).json({
        success: true,
        data: {
          userId: existingUser.id,
          email: existingUser.email,
          access: existingUser.access,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retreive user" });
  }
};

/**
 * Returns
 * @route POST /logout
 * @returns {Promise<object>} A promise that resolves to message
 */
const logout = async (req, res) => {
  res.clearCookie("sessionToken");
  res.status(200).send("Logged out");
};

module.exports = {
  login,
  logout,
};
