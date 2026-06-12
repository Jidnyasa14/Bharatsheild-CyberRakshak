const API = "http://localhost:3001";

// Create right-click context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:       "shieldurl-check",
    title:    "🛡️ Check with ShieldURL",
    contexts: ["link"],
  });
});

// Handle right-click scan
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "shieldurl-check") return;
  const url = info.linkUrl;

  // Store the URL for popup to read
  await chrome.storage.local.set({ pendingUrl: url, result: null });

  // Open popup
  chrome.action.openPopup();
});
