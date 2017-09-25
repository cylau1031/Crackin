document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('normal-theme-btn').addEventListener('click', (evt) => {
    chrome.storage.sync.set({"theme": "normal"}, () => {})
  })
  document.getElementById('code-theme-btn').addEventListener('click', (evt) => {
    chrome.storage.sync.set({"theme": "code"}, () => {})
  })
});
