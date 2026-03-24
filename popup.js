'use strict';

// ── Constants ──────────────────────────────────────────────
const LINKEDIN_BASE_URL = 'https://www.linkedin.com/jobs/search/';
const DEFAULT_KEYWORD   = 'Frontend Developer';

// ── Target Companies Data ──────────────────────────────────
const COMPANIES = {
  marketplaces: [
    { name: 'Andela',     note: 'React / TS / Python · Global' },
    { name: 'Braintrust', note: 'React / TS engineers' },
    { name: 'micro1',     note: 'AI-vetted · JS / TS stack' },
    { name: 'Turing',     note: 'React + Python roles' },
    { name: 'Toptal',     note: 'Top 3% vetting' },
  ],
  employers: [
    { name: 'GitLab',            note: 'React, TS, Python' },
    { name: 'Automattic',        note: 'JS-first · global' },
    { name: 'Shopify',           note: 'React, TS, REST APIs' },
    { name: 'Zapier',            note: 'React, Python, APIs' },
    { name: 'Basecamp',          note: 'Rails + JS stack' },
    { name: 'Hotjar',            note: 'React + TypeScript' },
    { name: 'Buffer',            note: 'React, Node.js' },
    { name: 'Doist',             note: 'React Native + TS' },
    { name: 'Canonical',         note: 'Python, open-source' },
    { name: 'Stripe',            note: 'React, TS, Python' },
    { name: 'Cloudflare',        note: 'TS Workers, React' },
    { name: 'Elastic',           note: 'React, TS dashboards' },
    { name: 'HashiCorp',         note: 'Go + React frontend' },
    { name: 'DigitalOcean',      note: 'React, TS, Python' },
    { name: 'GitHub',            note: 'React, TypeScript' },
    { name: 'Flutterwave',       note: 'React, TS, Node' },
    { name: 'Interswitch',       note: 'React, Java backend' },
    { name: 'Paystack',          note: 'React, TypeScript' },
    { name: 'Chipper Cash',      note: 'React Native + TS' },
    { name: 'Jumo',              note: 'Python, data pipelines' },
    { name: 'M-KOPA',            note: 'Mobile-first · RN' },
    { name: 'Wave Mobile Money', note: 'React Native + TS' },
    { name: 'Gebeya',            note: 'JS / TS · Pan-African' },
    { name: 'Lemonade Finance',  note: 'React Native · mobile' },
  ],
};

// ── State ──────────────────────────────────────────────────
let activeKeyword = DEFAULT_KEYWORD;

// ── Build LinkedIn URL ──────────────────────────────────────
/**
 * Builds a LinkedIn job-search URL with remote + Africa filters applied.
 * @param {string} keywords - Job title / search term
 * @returns {string} Full LinkedIn search URL
 */
function buildLinkedInURL(keywords) {
  const kw = (keywords || '').trim() || activeKeyword;

  const params = new URLSearchParams({
    keywords: kw,
    f_WT:     '2',         // Work type: Remote
    location: 'Africa',    // Africa region
    geoId:    '103537801', // LinkedIn geoId for Africa
  });

  const exp = document.getElementById('experience').value;
  if (exp) params.set('f_E', exp);

  const date = document.getElementById('datePosted').value;
  if (date) params.set('f_TPR', date);

  const sort = document.getElementById('sortBy').value;
  if (sort) params.set('sortBy', sort);

  return `${LINKEDIN_BASE_URL}?${params.toString()}`;
}

// ── Open Search in New Tab ──────────────────────────────────
function searchJobs(keywords) {
  const url = buildLinkedInURL(keywords);
  chrome.tabs.create({ url });
}

// ── Chip Click: select a preset job title ──────────────────
function setActiveChip(keyword) {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.keyword === keyword);
  });
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    activeKeyword = chip.dataset.keyword;
    document.getElementById('keywords').value = activeKeyword;
    setActiveChip(activeKeyword);
  });
});

// ── Quick-action buttons at the bottom ─────────────────────
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    searchJobs(btn.dataset.keyword);
  });
});

// ── Main search button ──────────────────────────────────────
document.getElementById('searchBtn').addEventListener('click', () => {
  searchJobs(document.getElementById('keywords').value.trim());
});

// ── Enter key in keywords input ────────────────────────────
document.getElementById('keywords').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    searchJobs(e.target.value.trim());
  }
});

// ── Keep chips in sync when user types manually ─────────────
document.getElementById('keywords').addEventListener('input', e => {
  const typed = e.target.value.trim().toLowerCase();
  let matched = false;

  document.querySelectorAll('.chip').forEach(chip => {
    const isMatch = chip.dataset.keyword.toLowerCase() === typed;
    chip.classList.toggle('active', isMatch);
    if (isMatch) {
      activeKeyword = chip.dataset.keyword;
      matched = true;
    }
  });

  if (!matched) {
    // Custom text — no chip stays highlighted
    activeKeyword = e.target.value.trim() || DEFAULT_KEYWORD;
  }
});

// ── Render Company Buttons ─────────────────────────────────
function renderCompanies() {
  function createCompanyBtn(company) {
    const btn = document.createElement('button');
    btn.className = 'company-btn';
    btn.dataset.company = company.name;
    btn.title = company.note;

    const nameEl = document.createElement('span');
    nameEl.className = 'company-btn-name';
    nameEl.textContent = company.name;

    const noteEl = document.createElement('span');
    noteEl.className = 'company-btn-note';
    noteEl.textContent = company.note;

    btn.appendChild(nameEl);
    btn.appendChild(noteEl);

    btn.addEventListener('click', () => {
      const kw = document.getElementById('keywords').value.trim() || activeKeyword;
      searchJobs(`${kw} ${company.name}`);
    });
    return btn;
  }

  const mgGrid = document.getElementById('marketplaceGrid');
  const emGrid = document.getElementById('employerGrid');
  COMPANIES.marketplaces.forEach(c => mgGrid.appendChild(createCompanyBtn(c)));
  COMPANIES.employers.forEach(c => emGrid.appendChild(createCompanyBtn(c)));
}

renderCompanies();

// ── Companies Section Toggle ───────────────────────────────
const companiesToggle = document.getElementById('companiesToggle');

function toggleCompanies() {
  const body  = document.getElementById('companiesBody');
  const caret = document.getElementById('toggleCaret');
  const isNowOpen = body.classList.toggle('hidden') === false;
  caret.classList.toggle('open', isNowOpen);
  companiesToggle.setAttribute('aria-expanded', String(isNowOpen));
}

companiesToggle.addEventListener('click', toggleCompanies);

companiesToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleCompanies();
  }
});
