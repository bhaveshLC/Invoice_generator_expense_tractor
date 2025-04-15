const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;

class PDFService {
  static async generateInvoicePDF(invoice, responseStream = null) {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount - (invoice.discount || 0);

    const templatePath = path.join(__dirname, "../templates/invoice.ejs");
    const template = await fs.readFile(templatePath, "utf-8");
    const html = ejs.render(template, {
      invoice,
      subtotal,
      taxAmount,
      total,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      if (responseStream) {
        const pdfStream = await page.createPDFStream({
          format: "A4",
          printBackground: true,
          margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px",
          },
        });

        pdfStream.pipe(responseStream);
        await new Promise((resolve) => pdfStream.on("end", resolve));
      } else {
        return await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px",
          },
        });
      }
    } finally {
      await browser.close();
    }
  }
}

module.exports = PDFService;
