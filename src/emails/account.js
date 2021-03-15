const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_EMAIL,
        subject: "Thanks for joining!",
        text: `Welcome to the task manager app, ${name}. Let me know if there's anything else I can do for you.`,
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_EMAIL,
        subject: "Sorry to see you go!",
        text: `Goodbye, ${name}. Thank you for using our app, hope you come back soon.`,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
};
