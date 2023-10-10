const nodemailer = require("nodemailer");
const config = require("../../config/config");
const logger = require("../../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `${config.clientURL}/auth/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendEmailVerificationEmail = async (to, token) => {
  const subject = "Verify email";
  const verifyEmailUrl = `${config.clientURL}/verify-email?token=${token}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verifyEmailUrl}
  If you did not sign up, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendTeamInvitationEmail = async (to, team, invitationId) => {
  const subject = "Team invitation";
  const teamInvitationUrl = `${config.clientURL}/team-invitation/${team.team_id}?invitationId=${invitationId}`;
  const text = `Dear user,
  To join the team ${team.team_name}, click on this link: ${teamInvitationUrl}
  If you do not wish to join, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendEmailVerificationEmail,
  sendTeamInvitationEmail,
};
