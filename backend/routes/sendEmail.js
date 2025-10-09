import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "snehakoshta1@gmail.com",
      pass: "bjio kgsd tzdw gsbk",
    },
  });

  let mailOptions = {
    from: "your-email@gmail.com",
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully!");
    }
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
