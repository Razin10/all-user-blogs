const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const UserModel = require("./models/User");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false); // or true, depending on your preference
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(cors({
    origin: 'https://all-user-blogs-frontend.onrender.com', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'] ,
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongoURI
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'None', // Necessary for cross-origin cookies
        secure: process.env.NODE_ENV === 'production'// Set to true if using HTTPS
    }
}));

app.use(cookieParser());

// User Routes
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser  = await UserModel.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new UserModel({ name, email, password: hashedPassword });
        const savedUser  = await newUser .save();
        res.status(201).json(savedUser );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt with email: ${email}`); // Log the email being used for login
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                console.log(`Login successful for user: ${user.name}`); // Log successful login
                res.status(200).json({ message: "Success", user: req.session.user });
            } else {
                console.log("Password doesn't match"); // Log password mismatch
                res.status(401).json({ error: "Password doesn't match" });
            }
        } else {
            console.log("No records found"); // Log when no user is found
            res.status(404).json({ error: "No Records found" });
        }
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
});

app.get('/user', (req, res) => {
    console.log('Session:', req.session); // Log the session object
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});


app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});



// Blog Routes
app.use('/api/blogs', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
