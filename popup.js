'use strict';

// ── Constants ──────────────────────────────────────────────
const LINKEDIN_BASE_URL = 'https://www.linkedin.com/jobs/search/';
const DEFAULT_KEYWORD   = 'Frontend Developer';

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
