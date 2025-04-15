const cron = require("node-cron");
const { sendInvoiceReminder } = require("../services/invoice.service");

cron.schedule("0 9 * * *", async () => {
  try {
    await sendInvoiceReminder();
    console.log("Invoice reminders sent.");
  } catch (err) {
    console.error("Error in invoice reminder job:", err);
  }
});
