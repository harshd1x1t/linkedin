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
  const roles = section.querySelectorAll('li');

  roles.forEach(item => {
    const spans = item.querySelectorAll('span[aria-hidden="true"]');
    const texts = Array.from(spans)
      .map(span => span.innerText.trim())
      .filter(Boolean);

    if (texts.length === 0) return;

    const title = texts[0];
    let company = '';

    for (let i = 1; i < texts.length; i++) {
      if (texts[i] !== title) {
        company = texts[i];
        break;
      }
    }

    const entry = company && company !== title ? `${title} at ${company}` : title;
    if (!experience.includes(entry)) {
      experience.push(entry);
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
    let degree = '';

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] !== school) {
        degree = lines[i];
        break;
      }
    }

    const eduEntry = degree && degree !== school ? `${school} - ${degree}` : school;

    if (eduEntry && !education.includes(eduEntry)) {
      education.push(eduEntry);
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


function detectOpenToWork() {
  return Array.from(document.querySelectorAll('div, span'))
    .some(el => el.textContent.toLowerCase().includes('open to work'));
}

async function scrapeLinkedInProfile(sendResponse) {
  try {
    await scrollToBottomUntilStable();
    await waitForElement('section');
    await clickAllShowMoreButtons();
    await wait(1000);

    const name = document.querySelector('h1')?.textContent.trim() || 'Name not found';

    const experienceSection = findSectionByKeyword("experience");
    const educationSection = findSectionByKeyword("education");
    const skillsSection = findSectionByKeyword("skills");
    const openToWork = detectOpenToWork();

    const profileData = {
      name,
      openToWork,
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
    return true;
  }
});