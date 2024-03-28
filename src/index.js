const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// Signup User
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            return res.send("User Already Exists. Please Choose a different Username...!");

        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);

        res.render("login");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Login User 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User cannot found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            req.send("Wrong Password")
        }
    } catch {
        res.send("Wrong Details");
    }
})

const port = 5000;
app.listen(port, () => {
    console.log(`Server connected to Port: ${port}`);
});
