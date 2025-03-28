const selectFolderBtn = document.getElementById('select-folder');
const statusText = document.getElementById('statusText');

selectFolderBtn.addEventListener('click', async () => {
  statusText.textContent = 'Processing...';

  const resultPath = await window.electronAPI.selectFolder();

  if (resultPath) {
    statusText.textContent = `CSV saved to: ${resultPath}`;
  } else {
    statusText.textContent = 'Operation cancelled.';
  }
});

