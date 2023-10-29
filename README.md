# Domain Details Finder

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [CSV Output](#csv-output)
- [Scheduling](#scheduling)
- [Testing](#testing)

## Introduction

The **Domain Details Finder** is a versatile tool designed to extract details of public domains, including the owner's name, email, and phone number. It then stores the results in a CSV file and emails it to a specified email address. This tool is also equipped to run on a schedule, automating the domain detail extraction process. It keeps track of any errors that may occur and logs them in a separate error file.

## Features

- Extracts owner's name, email, and phone number for public domains.
- Stores extracted data in a CSV file.
- Emails the CSV file to a pre-specified email address.
- Automated execution using cron jobs (node-schedule).
- Error logging with Winston.

## How It Works

1. Provide a `.txt` file containing a list of domains.
2. The tool reads the domain list from the file and stores it in a list.
3. It sends requests to the WHOIS server to retrieve domain details.
4. The tool extracts the required details from the response and saves them in a CSV file.
5. After completing the extraction process, it emails the CSV file to the specified email address.

## Installation

Before using the **Domain Details Finder**, please ensure you have the following prerequisites in place:

1. **Node.js**: Make sure you have Node.js installed on your system. If Node.js is not installed, you can download it from the official website: [Node.js Downloads](https://nodejs.org/en/download/).

2. **Clone the Repository**: Clone this repository to your local machine:

   ```bash
   git clone https://github.com/adarsh-K-R/Domain-Details-Finder.git
   ```

3. **Navigate to the Project Directory**: Go to the project directory you've just cloned:

   ```bash
   cd Domain-Details-Finder
   ```

4. **Install Dependencies**: Install the project dependencies using npm:

   ```bash
   npm install
   ```

## Configuration

Before using the **Domain Details Finder**, it's crucial to configure it to your specific requirements. Open the `scripts.js` file and set the following parameters:

- `filePath`: The path to the `.txt` file containing the list of domains.
- `recipientEmail`: The email address to which the CSV file will be sent.
- `senderEmail` & `senderPassword` : From which thw mail will be sent.
- The schedule for running the tool (using cron syntax).

Additionally, in the `scripts.js` file, ensure that you have provided your SMTP email server configuration and credentials in the `nodemailer` section. This includes your email server host, port, and authentication details.

## Usage

To run the **Domain Details Finder**, execute the following command in your terminal:

```bash
npm start
```

This will initiate the domain detail extraction process based on your configuration.

## Error Handling

Proper error handling is essential for the smooth operation of the script. The script should be capable of managing scenarios where domains cannot be resolved or details cannot be extracted. Ensure that the script logs errors and continues processing other domains.

## CSV Output

The script mentioned in this repository is designed to store the extracted data in a CSV file. Make sure that the script creates this file correctly and that the format of the CSV file matches your requirements.

## Scheduling

As indicated in the introduction, the script can be automated using cron jobs (node-schedule). To schedule the script to run at specific times, set up the desired cron schedule in the `cronSchedule` mathod in the `scripts.js` file.

## Testing

It is recommended to test the script with a small domain list to ensure that it works as expected before processing a larger list of domains.

```
