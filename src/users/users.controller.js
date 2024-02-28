export const userRegister = async (req, res) => {
  res.redirect("/login");
};

export const userLogin = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales inválidas" });
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    age: req.user.age,
    cart: req.user.cart,
  };
  res.redirect(
    "/products?limit=10&page=1&category=bebida&sort=desc&availability="
  );
};

export const userLogout = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
