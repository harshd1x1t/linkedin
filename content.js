function getProfileData() {
  // console.log("Extracting LinkedIn profile data...");

  // Extract the name
  const nameElement = document.querySelector('h1');
  const name = nameElement ? nameElement.textContent.trim() : 'Name not found';
  console.log("Name:", name);

  const experience = [];

  // Try to find the experience section based on inner text 
  const allSections = Array.from(document.querySelectorAll('section'));
  const experienceSection = allSections.find(section =>
    section.innerText.toLowerCase().includes('experience')
  );

  if (!experienceSection) {
    console.warn("No experience section found.");
    return { name, experience };
  }

  // Find role titles inside the experience section
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

  console.log("Extracted experience:", experience);
  return { name, experience };
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinkedInData") {
    // Delay to wait for LinkedIn to fully load content
    setTimeout(() => {
      const data = getProfileData();
      sendResponse(data);
    }, 1500); 
    return true;
  }
});
