import nodemailer from "nodemailer";

export async function sendApprovalEmail(post) {
  console.log("Attempting to send email...");
  console.log("FROM:", process.env.GMAIL_USER);
  console.log("TO:", "sharma.deepak2999@gmail.com");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const approveUrl = `http://localhost:8000/api/approve?post_id=${post.id}`;
    const rejectUrl = `http://localhost:8000/api/reject?post_id=${post.id}`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "sharma.deepak2999@gmail.com",
      subject: "Post Pending Approval",
      text: `Title: ${post.title}

${post.content.slice(0, 100)}

Approve: ${approveUrl}
Reject: ${rejectUrl}`,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("EMAIL FAILED — FALLBACK LOG:");
    console.error(err.message);
    console.log({
      title: post.title,
      approveUrl: `http://localhost:8000/api/approve?post_id=${post.id}`,
      rejectUrl: `http://localhost:8000/api/reject?post_id=${post.id}`,
    });
  }
}
