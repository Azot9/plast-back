const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Vyhovnyk } = require("../models/Vyhovnyk");
const { validateLogin, validateRegistration, validateEmail } = require("../plugins/validate");
const express = require("express");
const CHECK_LISTS = require("../static/emptyCheckLists");
const router = express.Router();
const util = require('util')




async function getGurtok(app_user) {
  let gurtok = [];
  console.log(app_user.gurtok.length);

  if (app_user.gurtok.length > 0) {
    for (const child of app_user.gurtok) {
      const one_child = await User.findOne({ _id: child });
      gurtok.push({
        id: one_child._id,
        name: one_child.name,
        check_lists: one_child.check_lists,
      })
    }
  }
  return gurtok;
}

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

        let gurtok = await getGurtok(app_user);

        console.log(gurtok);
        return res.header("x-auth-token", token).send({
          user: {
            id: app_user._id,
            name: app_user.name,
            is_vyhovnyk: req.body.is_vyhovnyk
          },
          gurtok
        });
      } else {
        return res.header("x-auth-token", token).send({
          user: {
            id: app_user._id,
            name: app_user.name,
            check_lists: app_user.check_lists,
            is_vyhovnyk: req.body.is_vyhovnyk
          }
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
  let user;

  if (req.body.is_vyhovnyk) {
    user = await Vyhovnyk.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
    user = new Vyhovnyk({
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      gurtok: []
    });
  } else {
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
    user = new User({
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      check_lists: CHECK_LISTS
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




router.post("/add_child", async (req, res) => {
  auth(req, res, async () => {

    const { error } = validateEmail(req.body);
    if (error) return res.status(401).send(error.details[0].message);
    let new_child = await User.findOne({ email: req.body.email });
    let app_user = await Vyhovnyk.findOne({ _id: req.body.id });

    if (new_child) {
      if (app_user.email === new_child.email || app_user.gurtok.indexOf(new_child.id) !== -1) {
        return res.status(400).send();
      } else {
        app_user.gurtok.push(new_child.id);
        app_user.save();
      }
    } else {
      return res.status(400).send();
    }
    let gurtok = await getGurtok(app_user);

    res.header().send({
      gurtok
    });
  });
});

router.post("/toggle_point", async (req, res) => {
  auth(req, res, async () => {
    let child = await User.findOne({ _id: req.body.child_id });

    for (let check_list of child.check_lists) {
      if (check_list.id === req.body.checklist_id) {
        for (let section of check_list.list) {
          if (section.section_id === req.body.section_id) {
            for (let point of section.section_list) {
              if (point.id === req.body.point_id ) {
                console.log("req.body.point_checked");
                console.log(req.body.point_checked);
                point.checked = req.body.point_checked;
              }
            }
          }
        }
      }
    }
  
    child.markModified('check_lists');
    await child.save();

    let app_user = await Vyhovnyk.findOne({ _id: req.body.id });
    let gurtok = await getGurtok(app_user);

    console.log(gurtok);

    res.header().send({
      gurtok
    });
  });
});






module.exports = router;
