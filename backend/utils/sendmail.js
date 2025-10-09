import nodemailer from "nodemailer";

export async function sendUserMail(booking) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: "Booking Confirmation",
    html: `
      <h2>Hi ${booking.name},</h2>
      <p>Your slot for <b>${booking.service}</b> has been booked successfully.</p>
      <p>Click the button below to confirm:</p>
      <a href="http://localhost:5000/confirm/${booking._id}" 
         style="
           display: inline-block;
           padding: 10px 20px;
           background-color: #4CAF50;
           color: white;
           text-decoration: none;
           border-radius: 5px;
           font-weight: bold;
         ">
        Confirm Booking
      </a>
      <p>Thank you!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
