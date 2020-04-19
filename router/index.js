const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Vyhovnyk } = require("../models/Vyhovnyk");
const { validateLogin, validateRegistration } = require("../plugins/validate");
const express = require("express");
const CHECK_LISTS = require("../static/emptyCheckLists");
const router = express.Router();

router.post("/", async (req, res) => {

  console.log(req.body);
  const { error } = validateLogin(req.body);
  if (error) return res.status(401).send(error.details[0].message);
  let app_user;
  //find an existing user
  if (req.body.is_vyhovnyk) {
    app_user = await User.findOne({ email: req.body.email });
  } else {
    app_user = await Vyhovnyk.findOne({ email: req.body.email });
  }
  console.log(app_user);
  if (app_user) {
    console.log(bcrypt.compareSync(req.body.password, app_user.password));
    if (bcrypt.compareSync(req.body.password, app_user.password)) {
      console.log("succes");
      const token = app_user.generateAuthToken();
      return res.header("x-auth-token", token).send({
        id: app_user._id,
        name: app_user.name,
        check_list_zero: app_user.check_list_zero,
        check_list_first: app_user.check_list_first,
        check_list_second: app_user.check_list_second
      });
    }
  }
  return res.status(400).send("user not found");
});




router.post("/registration", async (req, res) => {
  console.log(req.body);
  const { error } = validateRegistration(req.body);
  console.log(error);
  if (error) return res.status(401).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  if (req.body.is_vyhovnyk) {
    user = new Vyhovnyk({
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      gurtok: []
    });
  } else {
    user = new User({
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      check_list_zero: CHECK_LISTS.check_list_zero,
      check_list_first: CHECK_LISTS.check_list_first,
      check_list_second: CHECK_LISTS.check_list_second
    });
  }

  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    email: user.email
  });
});


router.post("/lol", async (req, res) => {
  // console.log(req.body);
  // res.send({
  //   lol: "lolololo"
  // });
  auth(req, res, () => {
    res.header().send({
      lol: "lol"
    });
  });
});




module.exports = router;
