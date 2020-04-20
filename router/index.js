const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Vyhovnyk } = require("../models/Vyhovnyk");
const { validateLogin, validateRegistration, validateEmail } = require("../plugins/validate");
const express = require("express");
const CHECK_LISTS = require("../static/emptyCheckLists");
const router = express.Router();

router.post("/", async (req, res) => {


  const { error } = validateLogin(req.body);
  if (error) return res.status(401).send(error.details[0].message);
  let app_user;
  if (req.body.is_vyhovnyk) {
    app_user = await Vyhovnyk.findOne({ email: req.body.email });
  } else {
    app_user = await User.findOne({ email: req.body.email });
  }
  if (app_user) {
    if (bcrypt.compareSync(req.body.password, app_user.password)) {
      const token = app_user.generateAuthToken();
      if (req.body.is_vyhovnyk) {

        let gurtok = [];
        console.log(app_user.gurtok.length);

        if (app_user.gurtok.length > 0) {
          for (const child of app_user.gurtok) {
            const one_child = await User.findOne({ _id: child });
            gurtok.push({
              id: one_child._id,
              name: one_child.name,
              check_list_zero: one_child.check_list_zero,
              check_list_first: one_child.check_list_first,
              check_list_second: one_child.check_list_second
            })
          }
        }


        console.log(gurtok);
        return res.header("x-auth-token", token).send({
          id: app_user._id,
          name: app_user.name,
          gurtok,
          is_vyhovnyk: req.body.is_vyhovnyk
        });
      } else {
        return res.header("x-auth-token", token).send({
          id: app_user._id,
          name: app_user.name,
          check_list_zero: app_user.check_list_zero,
          check_list_first: app_user.check_list_first,
          check_list_second: app_user.check_list_second,
          is_vyhovnyk: req.body.is_vyhovnyk
        });
      }
    }
  }
  return res.status(400).send("user not found");
});




router.post("/registration", async (req, res) => {
  const { error } = validateRegistration(req.body);
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

router.post("/add_child", async (req, res) => {
  auth(req, res, async () => {

    const { error } = validateEmail(req.body);
    if (error) return res.status(401).send(error.details[0].message);
    let new_child = await User.findOne({ email: req.body.email });

    if (new_child) {
      app_user = await Vyhovnyk.findOne({ _id: req.body.id });
      app_user.gurtok.push(new_child.id);
      app_user.save();
    }

    res.header().send({
      lol: req.body
    });
  });
});




module.exports = router;
