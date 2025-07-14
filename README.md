# 🔎 LinkedIn Profile Data Extractor – Chrome Extension

A Chrome extension that extracts structured data from LinkedIn profiles — including full name, education, skills, and experience — and enables users to save the extracted information locally in JSON format.

---

## 📌 Overview

This project streamlines the process of collecting data from LinkedIn profiles for recruiters, data analysts, and researchers. The extension injects a script into the profile page, extracts key data fields, and provides an interface for the user to download this data in JSON format.

---

## 🧩 Features

- ✅ Extracts:
  - Full Name
  - Education History
  - Skills
  - Work Experience
- ✅ Lightweight Chrome extension with popup UI
- ✅ Saves data locally in `.json` format
- ✅ Local backend server with API endpoints
- ✅ Swagger UI for API documentation and testing
- ✅ Easily extensible for future improvements

---

## 🛠️ Tech Stack

- **Frontend (Extension):** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Other Tools:** Swagger UI, Chrome Extension APIs

---

## 🗂️ File Structure
```plaintext
linkedin-extension/
ª   structure.txt
   
+---backend
    ª   package-lock.json
    ª   package.json
    ª   server.js
    ª   swagger.js
    ª 
    +---controllers
    ª       profileController.js
    ª       
    +---frontend
    ª       content.js
    ª       manifest.json
    ª       popup.html
    ª       popup.js
    ª       style.css
    +---routes
    ª       profile.js
    ª       
    +---storage
    ª       profile.json
    ª       profiles.json
    ª       
    +---test
            profile.test.js

```

## 🚀 Getting Started

### 1. Clone the Repository

bash
git clone https://github.com/your-username/linkedin-extractor-extension.git
cd linkedin-extractor-extension

### 2. Install Backend Dependencies
bash
npm install

### 3. Start the Local Backend Server
bash
node server.js
 # Backend will run on http://localhost:3000/

### 4. Load the Chrome Extension
Open Chrome and go to chrome://extensions/

Enable Developer Mode

Click Load unpacked

Select the root folder of this project

🧪 Testing the Extension
Open a valid LinkedIn profile in Chrome.

Click on the extension icon in your browser toolbar.

The extension will scrape the page and display extracted info.

Click the "Download JSON" button to save data locally.

📘 API Documentation (Swagger)
Swagger UI is available at:

bash
http://localhost:3000/api-docs
 # Use it to view and test the backend API endpoints.
