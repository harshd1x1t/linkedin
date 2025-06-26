document.getElementById('extractBtn').addEventListener('click', () => {
  document.getElementById('result').innerHTML = "⏳ Extracting...";

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getLinkedInData" }, response => {
      if (chrome.runtime.lastError) {
        document.getElementById('result').innerHTML = "❌ Error: " + chrome.runtime.lastError.message;
        return;
      }
      renderResult(response);
    });
  });
});

function renderResult(data) {
  if (data.error) {
    document.getElementById('result').innerHTML = "❌ " + data.error;
    return;
  }

  const section = (title, items) => `
    <div class="section">
      <h2>${title}</h2>
      <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `;

  const html = `
    <h2>${data.name}</h2>
    ${section("Experience", data.experience)}
    ${section("Education", data.education)}
    ${section("Skills", data.skills)}
  `;

  document.getElementById('result').innerHTML = html;
}
