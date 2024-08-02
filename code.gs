/**

* Get "home page", or a requested page.

* Expects a 'page' parameter in querystring.

*

* @param {event} e Event passed to doGet, with querystring

* @returns {String/html} Html to be served

*/



// function doGet(e) {

// Logger.log( Utilities.jsonStringify(e) );

// if (e.parameter.page === "") {

// // When no specific page requested, return "home page"

// return HtmlService.createTemplateFromFile('update').evaluate();

// }

// // else, use page parameter to pick an html file from the script

// return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();

// }



function doGet(e){

Logger.log( Utilities.jsonStringify(e));


if (!e.parameter.page && !e.parameter.uulinktoken){

// HtmlService.createTemplateFromFile('update').evaluate();

let file = HtmlService.createHtmlOutputFromFile('update');

file = file.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

return file;


} else if (e.parameter.page){

let file = HtmlService.createHtmlOutputFromFile(e.parameter['page']);

file = file.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

return file;

}

}



function authPDFreq(uToken){ 

try {

const sheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g').getSheetByName('TOKENS - THE POWER OF SELF DISCIPLINE');

const values = sheet.getDataRange().getValues();


for (let i = 0; i < values.length; i++){

if (values[i].includes(uToken)){

sheet.deleteRow(i + 1);

return {status : true, res : getFiles()};


}

}

} catch(error){

Logger.log(error)

return { status: "error", message: "An Error occurred during authentication: " + error };

}


return false;

}




function getFiles(){

// Access the files using their ID


const pdfFileIds = [

"1dtKlnRFImwxhc37mezywChbfnw9VtE_q", // These IDs are unique to the account 'josephalexconsulting@gmail.com'

"1e0XFdIypeDFnZ69Qc_u2Qjgnc6fppl33", 

"1e5cTzvNQd7bm8kaU8EKf4P7xk_cI-tnh" 

];


const fileNames = [

"Worksheet 1 - Your Actionable Change Blueprint",

"Worksheet 2 - Finding Your Accountability Network",

"Worksheet 3 - Your Habits Rewiring Sheet"

]



try {

// Array to save base64 code

const base64Arr = [];

for (let i = 0; i < pdfFileIds.length; i++){

let file = DriveApp.getFileById(pdfFileIds[i]).getBlob();

let htmlATag = HtmlService.createHtmlOutput(`

<a href="data:application/pdf;base64,${Utilities.base64Encode(file.getBytes())}" download="${fileNames[i]}" role ="button" class="aTagBtn">Download ${fileNames[i]}</a>`).getContent();

base64Arr.push(htmlATag);

}


return base64Arr;

} catch (error){

Logger.log(error);

return error;

}


}





function getIpAddress() {

try {

let response = UrlFetchApp.fetch('https://api64.ipify.org?format=json').getContentText();

// let content = response.getContentText();

let userIp = JSON.parse(response);

const plainIP = userIp.ip;

Logger.log('User IP Address: ' + plainIP);

return plainIP;

} catch (error) {

Logger.log('Error fetching IP address: ' + error);

return error;

}

}





// Declares the function for sending emails

function sendEmail(userEmail) {

let spreadsheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g');

let worksheet = spreadsheet.getSheetByName('SentEmails'); // Create a new sheet 'SentEmails' for tracking sent emails

let emailExists = false;



try {

// Check if the email exists in the 'SentEmails' sheet.

let emailData = worksheet.getDataRange().getValues();

for (let i = 0; i < emailData.length; i++) {

if (emailData[i][0] === userEmail) {

emailExists = true;

break;

} else {

emailExists = false;

}

}


if (emailExists === false) {

// Fetch the HTML content from the external URL

let externalHTMLURL = UrlFetchApp.fetch('https://josephalex.vercel.app/welcome-message.html').getContentText();


// Sets the email subject, content and sender

let subject = "Hello + Time Management";

let message = externalHTMLURL;

let senderEmail = 'josephalexconsulting@gmail.com';


// Send the email with the attached PDF

GmailApp.sendEmail(userEmail, subject, '', {

name: 'Joseph Alex',

htmlBody: message,

from: senderEmail,

});


Logger.log("Email status: sent", emailExists);


// Add the email to the 'SentEmails' sheet to track that it has been sent.

let newRow = [userEmail, new Date()];

worksheet.appendRow(newRow);


return "Sent";

} else {

Logger.log("Email already sent to " + userEmail, emailExists);

return "Already sent"; // Email has already been sent.

}

} catch (e) {

Logger.log("Error sending email: " + e);

return "Sent"; // Email sending failed.

}

}



// The function for adding subscribers, screen size and others

function addSubscriber(data) {

const email = data.email;

const screen = Number(data.screenWidth);

const successOrNotProperty = data.successOrNotProperty;

const userIpAddress = data.userIpAddress;


// Get the Google spreadsheet.

const spreadsheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g');


// Get the worksheet.

const worksheet = spreadsheet.getSheetByName('Sheet1');


// Get the data range of the worksheet.

const dataRange = worksheet.getDataRange();


// Get all the values in the spreadsheet.

const dataValues = dataRange.getValues();


// Check if the email is already in the spreadsheet.

const emailExists = dataValues.some(row => row[0] === email);


if (!emailExists) {

// If the email is not in the spreadsheet, add the new subscriber data.

const lastRow = worksheet.getLastRow() + 1;

worksheet.getRange(lastRow, 1).setValue(email);

Logger.log(screen);

const targetRange = worksheet.getRange(lastRow, 2);

targetRange.setValue(screen);

// Set the number format for the cell to ensure it is treated as a number

targetRange.setNumberFormat('0');

worksheet.getRange(lastRow, 3).setValue(successOrNotProperty);

worksheet.getRange(lastRow, 4).setValue(userIpAddress);

worksheet.getRange(lastRow, 5).setValue(new Date());

notifyAdmin();

} else {

Logger.log('Email already exists in the spreadsheet.');

return "You are Already Subscribed"

}

}


function notifyAdmin(newEmail) {

// Notify the administration of the new subscriber

const subject = 'New Subscriber';

const reportBody = `We have a new Subscriber with the email address: ${newEmail}. 

I told ya this was gonna work`;

const senderEmail = 'josephalexconsulting@gmail.com';

const adminEmail = 'nwodojoseph88@gmail.com'


GmailApp.sendEmail(adminEmail, subject, '', {

name: 'Report',

htmlBody: reportBody,

from: senderEmail,

});

}





//Use this anytime there is a misrepresentation of the user's screen width

function treatAsNumber() {

// Get the Google spreadsheet.

const spreadsheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g');


// Get the worksheet.

const worksheet = spreadsheet.getSheetByName('Sheet1');


const lastRow = worksheet.getLastRow();


const targetRange = worksheet.getRange(lastRow, 2);

// Set the number format for the cell to ensure it is treated as a number

targetRange.setNumberFormat('0');

}








//This is manually controlled. Only used when there was an unexpected error in sending mails

function sendEmailOnError() {

// Fetch the HTML content from the external URL

let externalHTMLURL = UrlFetchApp.fetch('https://josephalex.vercel.app/newsletters/3-minute-thursdays/building-new-habits.html').getContentText();


// Sets the email subject, content and sender

let subject = "Building New Habits - The 3-minute Thursdays";

let message = externalHTMLURL;

let senderEmail = 'josephalexconsulting@gmail.com';

let email = 'nwodojoseph88@gmail.com'


// Send the email with the attached PDF

GmailApp.sendEmail(email, subject, '', {

name: 'Joseph Alex',

htmlBody: message,

from: senderEmail,

})

let timeSent = Utilities.formatDate(new Date(), "Africa/Lagos", "HH:mm:ss");

Logger.log("Current Time: " + timeSent);

Logger.log("Email was sent to: " + email);

}









function authEbookReq(formData) {

const firstName = String(formData.userFirstName);

const userEmail = String(formData.userEmailAddress);

const accessCode = String(formData.bookAccessCode);

const userIp = formData.ipAddress;

const request = String(formData.ebookRequest);

let emailSendState;


const spreadsheetValues = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g').getSheetByName('Worksheets Access Codes').getDataRange().getValues();

Logger.log(spreadsheetValues);



// Checks if 'request' & 'accessCode' is in the spreadsheet


let resultaccessAuth = accessCodeauth(spreadsheetValues, request, accessCode);


if (resultaccessAuth === 'Access Code Validated') {

// Get the ebook, log those values and return to frontend a response


let worksheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g').getSheetByName('Worksheets Access Codes');

const lastRow = worksheet.getLastRow() + 1;

worksheet.getRange(lastRow, 3).setValue(firstName);

worksheet.getRange(lastRow, 4).setValue(userEmail);

worksheet.getRange(lastRow, 6).setValue(userIp);

worksheet.getRange(lastRow, 7).setValue(request);

worksheet.getRange(lastRow, 8).setValue(accessCode);

Logger.log("This was validated"); Logger.log(userIp); Logger.log(request); Logger.log(accessCode); Logger.log(firstName); Logger.log(userEmail);


const sendEmailRes = sendWelcomeMsg(userEmail, firstName, request);

if (sendEmailRes === "Email Sent") {

emailSendState = sendEmailRes;

// Return state to sheet

worksheet.getRange(lastRow, 5).setValue(emailSendState);

} else {

emailSendState = `Email not Sent: ${sendEmailRes}`;

worksheet.getRange(lastRow, 5).setValue(emailSendState);

Logger.log(sendEmailRes);

};

return {status: "Success!", message : "Access Code Validated 🎉 \n You will receive a response via email shortly." };


} else { 

Logger.log("This was NOT validated"); Logger.log("The user IP is " + userIp); Logger.log("The requsted ebook is " + request, typeof(request)); Logger.log("The Access Code is " + accessCode,"The type of acces code is " + typeof(accessCode)); Logger.log("The first name is " + firstName); Logger.log("The user Email is " + userEmail);

return {status : "Invalid Access Code", message : "Please Type the Code as it Appears in the Book" }

} // Handle the rest in frontend



}




let currentRow;

function accessCodeauth(sheetValues, req, code) {

for (let i = 0; i < sheetValues.length; i++) { 

if (sheetValues[i][0] == req && sheetValues[i][1] == code) {

return 'Access Code Validated';

};

}

// If we get here, no match was found in any row

return 'Access code Incorrect'; 

}




function sendWelcomeMsg(userEmail, firstName, ebookReq) {

// Get html template from welcome.html AND get the sheet ready for saving token


let worksheet = SpreadsheetApp.openById('1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g').getSheetByName('TOKENS - THE POWER OF SELF DISCIPLINE');

const lastRow = worksheet.getLastRow() + 1;


let token = generateUniqueToken(32);

Logger.log(token);

let welcomeMsg = HtmlService.createHtmlOutputFromFile('welcome');

let content = welcomeMsg.getContent();

let newCont1 = content.replaceAll('{{subscriberFirstName}}', firstName || "there");

let newCont2 = newCont1.replaceAll('{{uniqueToken}}', token);


worksheet.getRange(lastRow, 1).setValue(ebookReq);

worksheet.getRange(lastRow, 2).setValue(token);



// Send Welcome Message from html


const subject = `Welcome to The Topside! Unleash Your Potential`;


try {

GmailApp.sendEmail(userEmail, subject, "", {

name: "Joseph Alex",

htmlBody: newCont2,

from: "josephalexconsulting@gmail.com",

});

notifyAdmin(userEmail); // Notify Admin of the new subscriber 

Logger.log("Email sent successfully");

return "Email Sent";

} catch (error) {

Logger.log("Error sending email: " + error);

return `Error Sending Email: ${error}`;

}

}







function generateUniqueToken(tokenLength) {

const characters = "ABCDEFGHIJKLklmnopqrstuvwxyz0123456789_";

const spreadsheetId = "1K1neS96TYNYshPdy6rPXs9gE-VliqWRPqlfRsy5ZS7g"; 

const sheetName = "TOKENS - THE POWER OF SELF DISCIPLINE";


let token = "TOP_";

let isUnique = false; // Flag to track uniqueness


while (!isUnique) { // Keep generating until unique

for (let i = 0; i < tokenLength; i++) {

token += characters.charAt(Math.floor(Math.random() * characters.length));

}


// Check for uniqueness in the spreadsheet

let sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

let spreadsheetValues = sheet.getDataRange().getValues();


isUnique = !spreadsheetValues.flat().includes(token); // Check if token exists in any cell

}



return token;

}





