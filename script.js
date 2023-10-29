const whois = require("whois");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const schedule = require("node-schedule");
const winston = require("winston");
const nodemailer = require("nodemailer");

// CSV file to store the extracted details.
const csvFilePath = "./domain_data.csv";
// sample data file
const filePath = "./domain-names.txt";
const recipientEmail = ""; // add the recipient's email address here
const senderEmail = ""; // add your email address here
const senderPassword = ""; // add your email's password here
const service = "gmail";

const emailConfig = {
  service: service,
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
};

// Create a transporter using the provided email configuration.
const transporter = nodemailer.createTransport({
  ...emailConfig,
});

const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.simple(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

// Create a CSV writer instance.
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: "Date", title: "Date" },
    { id: "Name", title: "Name" },
    { id: "Domain", title: "Domain" },
    { id: "Email", title: "Email" },
    { id: "Phone", title: "Phone" },
  ],
});

// Schedule a daily job to perform WHOIS lookup on newly registered domains.
// The job runs at 8th day of every month.
schedule.scheduleJob("00 10 20 * *", async () => {
  console.log("Job started");

  const processedDomains = new Set();

  const fileData = fs.readFileSync(filePath, "utf-8");
  const newlyRegisteredDomains = fileData
    .split("\n")
    .map((line) => line.trim());

  // Remove the last element if it's an empty string (caused by the final newline)
  if (newlyRegisteredDomains[newlyRegisteredDomains.length - 1] === "") {
    newlyRegisteredDomains.pop();
  }

  for (const domain of newlyRegisteredDomains) {
    // Check if the domain has already been processed.
    if (!processedDomains.has(domain)) {
      try {
        const whoisData = await performWhoisLookup(domain);
        const details = extractDetails(whoisData);
        // If the domain has no email or phone, skip it.
        if (!details) {
          console.log(`Excluding ${domain} due to missing details.`);
          continue;
        }
        await saveDetailsToCSV(details);
        processedDomains.add(domain); // Mark the domain as processed.
      } catch (error) {
        console.log(`Error processing ${domain}:`);
        errorLogger.error(
          `Error during WHOIS lookup for ${domain}: ${error.message}`
        );
      }
    } else {
      console.log(`Domain ${domain} already processed. Skipping.`);
    }
  }

  await sendEmailWithDetails();

  process.exit(0);
});

// Function to send an email with the extracted details.
async function sendEmailWithDetails() {
  try {
    const message = {
      from: emailConfig.auth.user,
      to: recipientEmail,
      subject: "Newly Registered Domain Details",
      text: "Please find the attached CSV file for details.",
      html: "<h1>Hi, Please find the attached CSV file for details.</h1>",
      attachments: [
        {
          filename: "domain_data.csv",
          path: csvFilePath,
        },
      ],
    };

    await transporter.sendMail(message);
    console.log(`Email sent to ${recipientEmail} with details.`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to perform a WHOIS lookup and extract details.
function performWhoisLookup(domain) {
  try {
    return new Promise((resolve, reject) => {
      whois.lookup(domain, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    errorLogger.error(
      `Error during WHOIS lookup for ${domain}: ${error.message}`
    );
    throw error;
  }
}

// Function to extract required details from WHOIS data.
function extractDetails(whoisData) {
  const details = {
    Date: "",
    Name: "",
    Domain: "",
    Email: "",
    Phone: "",
  };

  const lines = whoisData.split("\n");

  for (const line of lines) {
    // Look for the line that contains the registrant's name.
    if (line.includes("Registrant Name:")) {
      details.Name = line.split(":")[1].trim();
      if (
        details.Name.includes("REDACTED FOR PRIVACY") ||
        details.Name.includes("Redacted for privacy") ||
        details.Name.includes("Redacted For Privacy") ||
        details.Name.includes("Registration Private") ||
        details.Name.includes("Contact Privacy") ||
        details.Name.includes("Privacy protection") ||
        details.Name.includes("Whois Privacy") ||
        details.Name.includes("Protected Protected") ||
        details.Name.includes("GDPR Masked") ||
        details.Name.includes("Domain Admin") ||
        details.Name.includes("DOMAIN ADMINISTRATOR") ||
        details.Name.includes("DATA REDACTED") ||
        details.Name.includes("Admin Contact") ||
        details.Name.includes("Domain Privacy") ||
        details.Name.includes("Domain ID Shield Service")
      ) {
        return null;
      }
    }

    // Look for the line that contains the registrant's email.
    if (line.includes("Registrant Email:")) {
      details.Email = line.split(":")[1].trim();
    }

    // Look for the line that contains the registrant's phone number.
    if (line.includes("Registrant Phone:")) {
      details.Phone = line.split(":")[1].trim();
    }

    // Look for the line that contains the domain name.
    if (line.includes("Domain Name:")) {
      details.Domain = line.split(":")[1].trim();
    }

    // Look for the line that contains the domain registration date.
    if (line.includes("Creation Date:")) {
      details.Date = line.split(":")[1].trim();
    }

    // // If all the required details have been extracted, stop the loop.
    // if (details.Name && details.Email && details.Phone && details.Domain && details.Date) {
    //   break;
    // }
  }

  // Check if the domain has an email and phone number.
  if (!details.Email || !details.Phone || !details.Domain) {
    return null;
  }

  return details;
}

// Function to save extracted details to the CSV file.
async function saveDetailsToCSV(details) {
  await csvWriter.writeRecords([details]);
  console.log(`Details saved to CSV for domain: ${details.Domain}`);
}

console.log("Domain scraper scheduled to run daily.");
