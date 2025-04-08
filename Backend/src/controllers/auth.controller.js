const authService = require("../services/auth.service");
const handleRegister = async (req, res) => {
  const newUser = await authService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

const handleLogin = async (req, res) => {
  const token = await authService.loginUser(req.body.email, req.body.password);
  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
};
module.exports = { handleRegister, handleLogin };
