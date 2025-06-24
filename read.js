document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "getLinkedInData" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      document.getElementById("name").innerText = "Failed to retrieve data.";
      return;
    }

    document.getElementById("name").innerText = `Name: ${response.name}`;
    const list = document.getElementById("expList");
    response.experience.forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item;
      list.appendChild(li);
    });
  });
});
