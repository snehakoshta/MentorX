import nodemailer from "nodemailer";

async function testMail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "snehakoshta1@gmail.com",
        pass: "bjiokgsdtzdwgsbk",
      },
    });

    const info = await transporter.sendMail({
      from: '"Test" <snehakoshta1@gmail.com>',
      to: "your-other-email@gmail.com",
      subject: "Test Mail",
      text: "This is a test email from Node.js",
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testMail();
