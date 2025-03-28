const selectFolderBtn = document.getElementById('select-folder');
const statusText = document.getElementById('statusText');

selectFolderBtn.addEventListener('click', async () => {
  statusText.textContent = 'Opening folder dialog...';

  const folderPath = await window.electronAPI.selectFolder();

  if (folderPath) {
    statusText.textContent = `Selected folder: ${folderPath}`;
  } else {
    statusText.textContent = 'Folder selection was cancelled.';
  }
});
