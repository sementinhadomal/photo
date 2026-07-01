const filesData = [
  { name: "LUT_Guide_and_Video_Tutorial.pdf", size: "106 KB" },
  { name: "CLEAN_GRADE_LUT.cube", size: "947 KB" },
  { name: "SUNSET_LUT.cube", size: "947 KB" },
  { name: "ALTITUDE_LUT.cube", size: "947 KB" },
  { name: "TEAL_AND_ORANGE_LUT.cube", size: "947 KB" },
  { name: "VINTAGE_GREEN_LUT.cube", size: "947 KB" }
];

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (ext === 'cube') return '🎨';
  if (ext === 'zip') return '📦';
  if (ext === 'mp4' || ext === 'm4v' || ext === 'webm') return '🎬';
  return '📁';
}

function updateLanguage(lang) {
  localStorage.setItem('selectedLanguage', lang);
  const t = translations[lang] || translations.en;

  // Header / Hero
  document.getElementById('page-title').innerText = t.title;
  document.getElementById('page-subtitle').innerText = t.subtitle;

  // Video Section
  document.getElementById('watch-first-label').innerText = t.watchFirst;
  document.getElementById('watch-first-title').innerText = t.title;
  document.getElementById('watch-first-desc').innerText = t.watchFirstDesc;

  // Guide Section
  document.getElementById('guide-label').innerText = t.colorGradingGuide;
  document.getElementById('guide-subtitle').innerText = t.lutFcpSubtitle;
  document.getElementById('guide-desc').innerText = t.lutFcpDesc;

  // Steps
  for (let i = 1; i <= 7; i++) {
    document.getElementById(`step-${i}-title`).innerText = t[`step${i}Title`] || `Step ${i}`;
    document.getElementById(`step-${i}-desc`).innerText = t[`step${i}Desc`] || '';
  }

  // Tutorial info
  document.getElementById('tutorial-label').innerText = t.tutorialTitle;
  document.getElementById('tutorial-subtitle').innerText = t.tutorialSubtitle;
  document.getElementById('tutorial-desc').innerText = t.tutorialDesc;

  // Downloads header
  document.getElementById('download-title').innerText = t.downloadTitle;
  document.getElementById('download-subtitle').innerText = t.downloadSubtitle;

  // Download buttons
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.innerText = t.downloadBtn;
  });

  // Footer Logo
  document.getElementById('footer-logo').innerText = t.footer;
}

// Generate the download cards dynamically
function renderDownloadSection() {
  const grid = document.getElementById('download-grid');
  grid.innerHTML = '';

  filesData.forEach(file => {
    const card = document.createElement('div');
    card.className = 'download-card';

    const left = document.createElement('div');
    left.className = 'download-card-left';

    const icon = document.createElement('div');
    icon.className = 'download-icon';
    icon.innerText = getFileIcon(file.name);

    const meta = document.createElement('div');
    meta.className = 'download-meta';

    const name = document.createElement('div');
    name.className = 'download-name';
    name.innerText = file.name;

    const size = document.createElement('div');
    size.className = 'download-size';
    size.innerText = file.size;

    meta.appendChild(name);
    meta.appendChild(size);
    left.appendChild(icon);
    left.appendChild(meta);

    const btn = document.createElement('a');
    btn.className = 'download-btn';
    btn.href = file.name;
    btn.setAttribute('download', file.name);
    btn.innerText = 'Download';

    card.appendChild(left);
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDownloadSection();

  const langSelect = document.getElementById('lang-select');
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  langSelect.value = savedLang;

  langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });

  updateLanguage(savedLang);
});
