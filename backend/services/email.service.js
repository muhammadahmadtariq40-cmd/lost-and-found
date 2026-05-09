// Mock Email Service replacing Nodemailer
// In production, this would use nodemailer and a Gmail SMTP account

const sendEmail = async (to, subject, htmlContent) => {
  console.log('\n=============================================');
  console.log(`✉️  MOCK EMAIL SENT TO: ${to}`);
  console.log(`📝 SUBJECT: ${subject}`);
  console.log(`📄 CONTENT: ${htmlContent}`);
  console.log('=============================================\n');
  return true;
};

module.exports = {
  sendEmail,
};
