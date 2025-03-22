const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const hbs = require("hbs");
const Appointment = require("./models/appointment");
require("./db/conn");

const port = process.env.PORT || 3001;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const baseUrl = "/Bloom_Together";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from both root and baseUrl paths
app.use(express.static(static_path));
app.use(baseUrl, express.static(static_path));

app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

// Root routes for Vercel deployment
app.get("/", (req, res) => {
    res.render("main");
});

app.get("/women", (req, res) => {
    res.render("index");
});

app.get("/lgbtq", (req, res) => {
    res.render("Lindex");
});

// Original baseUrl routes
app.get(`${baseUrl}/`, (req, res) => {
    res.render("main");
});

app.get(`${baseUrl}/women`, (req, res) => {
    res.render("index");
});

app.get(`${baseUrl}/lgbtq`, (req, res) => {
    res.render("Lindex");
});

// Handle both root and baseUrl for appointments
app.post(`${baseUrl}/appointment`, handleAppointment);
app.post("/appointment", handleAppointment);

// Handle both root and baseUrl for subscriptions
app.post(`${baseUrl}/subscribe`, handleSubscription);
app.post("/subscribe", handleSubscription);

// Appointment handler function
async function handleAppointment(req, res) {
    try {
        const { name, number, email, time, messages, source } = req.body;

        if (!number || !email) {
            return res.status(400).send("Number and email are required");
        }

        const AppointmentEmployee = new Appointment({
            name,
            number,
            email,
            time,
            messages,
        });

        await AppointmentEmployee.save();

        // Render appropriate page based on `source`
        if (source === "Lindex") {
            res.status(201).render("Lindex");
        } else {
            res.status(201).render("index");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

// Subscription handler function
function handleSubscription(req, res) {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || "", // Your Gmail address from env
            pass: process.env.EMAIL_PASS || "", // Your Gmail password from env
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER || "",
        to: email,
        subject: "Subscription Confirmation",
        text: "Thank you for subscribing to our newsletter!",
    };

    // Skip sending email if credentials are not provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("Email credentials not provided, skipping email send");
        return res.sendStatus(200);
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error:", error);
            res.status(500).send("Error sending confirmation email");
        } else {
            console.log("Email sent:", info.response);
            res.sendStatus(200);
        }
    });
}

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Also available at http://localhost:${port}${baseUrl}`);
});
