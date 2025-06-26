async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const checkExist = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(checkExist);
        resolve(el);
      } else if (elapsed >= timeout) {
        clearInterval(checkExist);
        reject(`Timeout: ${selector} not found`);
      }
      elapsed += interval;
    }, interval);
  });
}

async function scrollToBottomUntilStable(delay = 1000, maxAttempts = 5) {
  let lastHeight = 0;
  for (let i = 0; i < maxAttempts; i++) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    await wait(delay);
    const newHeight = document.body.scrollHeight;
    if (newHeight === lastHeight) break;
    lastHeight = newHeight;
  }
}

async function clickAllShowMoreButtons() {
  const buttons = document.querySelectorAll('button[aria-label*="Show more"]');
  for (const btn of buttons) {
    try {
      btn.scrollIntoView({ behavior: 'smooth' });
      await wait(200);
      btn.click();
    } catch (e) {
      console.warn("Button click failed", e);
    }
  }
}

function extractExperience(section) {
  const experience = [];
  const items = section.querySelectorAll('li');
  items.forEach(item => {
    const lines = item.innerText.trim().split('\n').filter(Boolean);
    const title = lines[0] || '';
    const company = lines[1] || '';
    if (title && !experience.includes(title)) {
      experience.push(company ? `${title} at ${company}` : title);
    }
  });
  return experience;
}

function extractEducation(section) {
  const education = [];
  const items = section.querySelectorAll('li');
  items.forEach(item => {
    const lines = item.innerText.trim().split('\n').filter(Boolean);
    const school = lines[0] || '';
    const degree = lines[1] || '';
    if (school) {
      education.push(degree ? `${school} - ${degree}` : school);
    }
  });
  return education;
}

function extractSkills(section) {
  const skills = [];
  const items = section.querySelectorAll('li');
  items.forEach(item => {
    const skill = item.innerText.trim().split('\n')[0];
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
    }
  });
  return skills;
}

function findSectionByKeyword(keyword) {
  const allSections = [...document.querySelectorAll('section')];
  return document.querySelector(`section[id*="${keyword}"]`) ||
         allSections.find(s => s.querySelector('h2')?.innerText.toLowerCase().includes(keyword));
}

async function scrapeLinkedInProfile(sendResponse) {
  try {
    await scrollToBottomUntilStable();
    await waitForElement('section');
    await clickAllShowMoreButtons();
    await wait(1000); // let content expand

    const name = document.querySelector('h1')?.textContent.trim() || 'Name not found';

    const experienceSection = findSectionByKeyword("experience");
    const educationSection = findSectionByKeyword("education");
    const skillsSection = findSectionByKeyword("skills");

    const profileData = {
      name,
      experience: experienceSection ? extractExperience(experienceSection) : [],
      education: educationSection ? extractEducation(educationSection) : [],
      skills: skillsSection ? extractSkills(skillsSection) : []
    };

    console.log("Scraped profile:", profileData);
    sendResponse(profileData);
  } catch (err) {
    console.error("Profile scraping failed:", err);
    sendResponse({ error: err.toString() });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinkedInData") {
    scrapeLinkedInProfile(sendResponse);
    return true; // keeps message port open
  }
});
