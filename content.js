// function getProfileData() {
//   console.log("🚀 Extracting profile data...");

//   // Find name element
//   const nameElement = document.querySelector('[data-view-name="profile_name"]') ||
//                       document.querySelector('h1.text-heading-xlarge') ||
//                       document.querySelector('h1');

//   const name = nameElement ? nameElement.innerText.trim() : "Name not found";
//   console.log("✅ Name:", name);

//   // Find experience section
//   const experienceSection = [...document.querySelectorAll('section')]
//     .find(section => section.innerText.toLowerCase().includes('experience'));

//   const experience = [];

//   if (experienceSection) {
//     const roles = experienceSection.querySelectorAll('li');

//     roles.forEach((role) => {
//       const title = role.querySelector('span[aria-hidden="true"]')?.innerText.trim();
//       if (title) {
//         experience.push(title);
//       }
//     });
//   } else {
//     console.warn("⚠️ Experience section not found");
//   }

//   console.log("✅ Experience:", experience);
//   return { name, experience };
// }

// // Message handler
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getLinkedInData") {
//     setTimeout(() => {
//       const data = getProfileData();
//       sendResponse(data);
//     }, 1000); // Give LinkedIn DOM a moment to render
//     return true; // Needed for async response
//   }
// });
function getProfileData() {
  console.log("🚀 Extracting LinkedIn profile data...");

  // Step 1: Extract the name
  const nameElement = document.querySelector('h1');
  const name = nameElement ? nameElement.textContent.trim() : 'Name not found';
  console.log("✅ Name:", name);

  const experience = [];

  // Step 2: Try to find the experience section based on inner text (less brittle than IDs)
  const allSections = Array.from(document.querySelectorAll('section'));
  const experienceSection = allSections.find(section =>
    section.innerText.toLowerCase().includes('experience')
  );

  if (!experienceSection) {
    console.warn("⚠️ No experience section found.");
    return { name, experience };
  }

  // Step 3: Find role titles inside the experience section
  const roleItems = experienceSection.querySelectorAll('li');

  roleItems.forEach((item) => {
    const titleSpan = item.querySelector('span[aria-hidden="true"]');
    const companySpan = item.querySelectorAll('span[aria-hidden="true"]')[1];

    if (titleSpan) {
      const title = titleSpan.textContent.trim();
      const company = companySpan ? companySpan.textContent.trim() : '';
      if (title && !experience.includes(title)) {
        experience.push(company ? `${title} at ${company}` : title);
      }
    }
  });

  console.log("✅ Extracted experience:", experience);
  return { name, experience };
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinkedInData") {
    // Delay to wait for LinkedIn to fully load content
    setTimeout(() => {
      const data = getProfileData();
      sendResponse(data);
    }, 1500); // Adjust if needed
    return true; // Required for async response
  }
});
