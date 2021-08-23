const express = require("express")
const controller = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/users");

controller.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

controller.post("/signup", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await User.create({username: req.body.username, password: hashedPassword, usertype: 'customer'})
        res.redirect("/?action=success&signup=true")
    } catch (err) {
        res.send(" Unable to create a new account: " + err.message)
    }
})


controller.get("/login", (req, res) => {
    res.render("login.ejs")
})

controller.post("/login", async (req, res) => {
    const selectedUser = await User.findOne({username: req.body.username})

    if (! selectedUser) {
        return res.send("Username does not exist")
    }

    if (bcrypt.compareSync(req.body.password, selectedUser.password)) {
        req.session.username = selectedUser.username
        req.session.usertype = selectedUser.usertype
        res.redirect("/")
    } else {
        res.send("Wrong password!")
    }
})

controller.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = controller
