let extractedData = {}; // Store extracted data globally

document.getElementById('extractBtn').addEventListener('click', () => {
  document.getElementById('result').innerHTML = "⏳ Extracting...";

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];

  if (!tab.url.includes("linkedin.com/in/")) {
    document.getElementById('result').innerHTML = "❌ Please open a LinkedIn profile first.";
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "getLinkedInData" }, response => {
    if (chrome.runtime.lastError) {
      document.getElementById('result').innerHTML =
        "❌ Error: " + chrome.runtime.lastError.message +
        "<br>🔄 Try reloading the LinkedIn profile page.";
      return;
    }

    extractedData = response;
    renderResult(response);
  });
});
});

document.getElementById('submitBtn').addEventListener('click', () => {
  if (!Object.keys(extractedData).length) {
    alert("Please extract data first.");
    return;
  }

  fetch("http://localhost:5000/api/profile/save/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify(extractedData)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to save data");
    return res.json();
  })
  .then(data => {
    alert("✅ Data submitted successfully!");
    console.log("Server response:", data);
  })
  .catch(err => {
    console.error("❌ API error:", err);
    alert("❌ Failed to submit data. Check the console.");
  });
});

function renderResult(data) {
  if (data.error) {
    document.getElementById('result').innerHTML = "❌ " + data.error;
    return;
  }

const createAccordion = (id, title, content) => `
  <div class="accordion-item">
    <button class="accordion-header" data-target="${id}">
      <span class="accordion-title">${title}</span>
      <span class="accordion-icon">›</span>
    </button>
    <div id="${id}" class="accordion-content">
      ${Array.isArray(content)
        ? `<ul>${content.map(i => `<li>${i}</li>`).join('')}</ul>`
        : content}
    </div>
  </div>
`;

  const contactHTML = (() => {
    const contact = data.contact || {};
    if (Object.keys(contact).length === 0) return "<p>No contact info available.</p>";

    const fieldsToShow = {
      "email": "Email",
      "phone": "Phone",
      "linkedin": "LinkedIn",
      "website": "Website",
      "birthday": "Birthday"
    };

    let html = "<ul>";
    for (const [key, label] of Object.entries(fieldsToShow)) {
      const values = contact[key];
      if (values) {
        for (const value of values) {
          const isLink = key === "email" || key === "phone";
          const href = isLink ? `${key === "email" ? "mailto:" : "tel:"}${value}` : value;
          html += `<li><strong>${label}:</strong> <a href="${href}" target="_blank">${value}</a></li>`;
        }
      }
    }
    html += "</ul>";
    return html;
  })();

  const html = `
    <h2>${data.name}</h2>
    <p><strong>Open to Work:</strong> ${data.openToWork ? '✅ Yes' : '❌ No'}</p>
    ${createAccordion('experiencePanel', 'Experience', data.experience)}
    ${createAccordion('educationPanel', 'Education', data.education)}
    ${createAccordion('skillsPanel', 'Skills', data.skills)}
    ${createAccordion('contactPanel', 'Contact Info', contactHTML)}
  `;

  document.getElementById('result').innerHTML = html;

  document.querySelectorAll('.accordion-header').forEach(button => {
button.addEventListener('click', () => {
  const targetId = button.getAttribute('data-target');
  const content = document.getElementById(targetId);
  const icon = button.querySelector('.accordion-icon');

  const isOpen = content.classList.contains('open');

  if (isOpen) {
    content.style.maxHeight = null;
    content.classList.remove('open');
    button.classList.remove('open');
    if (icon) icon.textContent = '›'; // right arrow
  } else {
    content.classList.add('open');
    content.style.maxHeight = content.scrollHeight + "px";
    button.classList.add('open');
    if (icon) icon.textContent = '⌵'; // down arrow
  }
});
});
}
