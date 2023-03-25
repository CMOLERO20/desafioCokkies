const { Router } = require("express");
const { find } = require("../daos/model/user.model");
const userModel = require("../daos/model/user.model");
const productModel = require("../daos/model/products.model");
const adminMdw = require("../middleware/admin.middleware")

const router = Router();

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: `logout Error`, body: err });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = req.session;
  
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      const products = await productModel.find({}).lean();
      return res.render("products", { productos: products,
          first_name: "Admin" ,
          email: email || email,
          rol: "admin", 
          
        })};
        
    const findUser = await userModel.findOne({ email });
  

    if (!findUser) {
      return res.json({ message: `este usuario no esta registrado` });
    }

    if (findUser.password !== password) {
      return res.json({ message: `password incorrecto` });
    }

    req.session.user = {
      ...findUser,
    };
    const products = await productModel.find({}).lean();
    
    return res.render("products", { productos: products,
      first_name: req.session?.user?.first_name || findUser.first_name,
      email: req.session?.user?.email || email,
      rol: "usuario", 
      
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
      error
    );
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("BODY ****", req.body);
    const { first_name, last_name, email, age, password } = req.body;

    const userAdd = { email, password, first_name, last_name, age, password };
    const newUser = await userModel.create(userAdd);
    console.log(
      "🚀 ~ file: session.routes.js:61 ~ router.post ~ newUser:",
      newUser
    );

    req.session.user = { email, first_name, last_name, age };
    return res.render(`login`);
  } catch (error) {
    console.log(
      "🚀 ~ file: session.routes.js:36 ~ router.post ~ error:",
      error
    );
  }
});

module.exports = router;