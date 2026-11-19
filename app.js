const LANGUAGE_CATEGORIES = [
  "English",
  "Tagalog",
  "Cebuano",
  "Latin",
  "Multilingual"
];

const MASS_CATEGORIES = [
  "Entrance",
  "Kyrie",
  "Gloria",
  "Gospel Acclamation",
  "Offertory",
  "Sanctus",
  "Agnus Dei",
  "Communion",
  "Recessional"
];

const SEASON_CATEGORIES = [
  "Advent",
  "Christmas",
  "Lent",
  "Easter",
  "Ordinary Time",
  "Specials"
];

const songCatalog = Array.isArray(window.songs)
  ? window.songs
  : typeof songs !== "undefined"
    ? songs
    : [];

let activeGroup = "all"; // "all" | "mass" | "season" (controls which sub-filter bar is visible)
let appliedFilterGroup = null; // null | "all" | "mass" | "season" (controls which sub-filter is actively filtering)
let appliedSubCategory = null;
let searchQuery = "";

const searchInput = document.getElementById("search-input");
const songListEl = document.getElementById("song-list");

// Create containers dynamically if they aren't in index.html yet
let mainFiltersEl = document.getElementById("main-filters");
let subFiltersEl = document.getElementById("sub-filters");
let songViewerEl = document.getElementById("song-viewer");

if (!mainFiltersEl) {
  mainFiltersEl = document.createElement("div");
  mainFiltersEl.id = "main-filters";
  searchInput.insertAdjacentElement("afterend", mainFiltersEl);
}

if (!subFiltersEl) {
  subFiltersEl = document.createElement("div");
  subFiltersEl.id = "sub-filters";
  mainFiltersEl.insertAdjacentElement("afterend", subFiltersEl);
}

if (!songViewerEl) {
  songViewerEl = document.createElement("section");
  songViewerEl.id = "song-viewer";
  songViewerEl.style.display = "none";
  songListEl.insertAdjacentElement("afterend", songViewerEl);
}

// Group library elements into #library-view so we can switch between library and song page
let libraryViewEl = document.getElementById("library-view");
if (!libraryViewEl) {
  libraryViewEl = document.createElement("div");
  libraryViewEl.id = "library-view";

  const titleRowEl = document.querySelector(".title-row");
  if (titleRowEl) {
    titleRowEl.parentNode.insertBefore(libraryViewEl, titleRowEl);
    libraryViewEl.appendChild(titleRowEl);
  }
  libraryViewEl.appendChild(searchInput);
  libraryViewEl.appendChild(mainFiltersEl);
  libraryViewEl.appendChild(subFiltersEl);
  libraryViewEl.appendChild(songListEl);
}

function renderMainFilters() {
  mainFiltersEl.innerHTML = "";

  const topButtons = [
    { label: "All", group: "all" },
    { label: "Order of the Mass", group: "mass" },
    { label: "Liturgical Seasons", group: "season" }
  ];

  topButtons.forEach((btnInfo) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = btnInfo.label;
    if (activeGroup === btnInfo.group) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      activeGroup = btnInfo.group;

      if (btnInfo.group === "all") {
        if (appliedFilterGroup !== "all") {
          appliedFilterGroup = null;
          appliedSubCategory = null;
        }
        renderMainFilters();
        renderSubFilters();
        renderSongs();
        return;
      }

      renderMainFilters();
      renderSubFilters();
    });

    mainFiltersEl.appendChild(btn);
  });
}

function renderSubFilters() {
  subFiltersEl.innerHTML = "";
  subFiltersEl.style.display = "flex";

  let items = LANGUAGE_CATEGORIES;
  if (activeGroup === "mass") {
    items = MASS_CATEGORIES;
  } else if (activeGroup === "season") {
    items = SEASON_CATEGORIES;
  }

  items.forEach((categoryName) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = categoryName;

    if (appliedFilterGroup === activeGroup && appliedSubCategory === categoryName) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      if (appliedFilterGroup === activeGroup && appliedSubCategory === categoryName) {
        appliedSubCategory = null;
        if (activeGroup === "all") {
          appliedFilterGroup = null;
        }
      } else {
        appliedFilterGroup = activeGroup;
        appliedSubCategory = categoryName;
      }
      renderSubFilters();
      renderSongs();
    });

    subFiltersEl.appendChild(btn);
  });
}

function matchesFilter(song) {
  if (appliedFilterGroup === "all" && appliedSubCategory) {
    const langs = Array.isArray(song.language)
      ? song.language
      : song.language
        ? [song.language]
        : [];
    if (!langs.includes(appliedSubCategory)) {
      return false;
    }
  } else if (appliedFilterGroup === "mass" && appliedSubCategory) {
    if (!song.massPart || !song.massPart.includes(appliedSubCategory)) {
      return false;
    }
  } else if (appliedFilterGroup === "season" && appliedSubCategory) {
    if (!song.seasons || !song.seasons.includes(appliedSubCategory)) {
      return false;
    }
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.trim().toLowerCase();
    const inTitle = song.title.trim().toLowerCase().startsWith(q);
    if (!inTitle) return false;
  }

  return true;
}

function renderSongs() {
  songListEl.innerHTML = "";
  const filtered = songCatalog.filter(matchesFilter);

  filtered.sort((a, b) =>
    a.title.trim().localeCompare(b.title.trim(), undefined, { sensitivity: "base" })
  );

  if (filtered.length === 0) {
    songListEl.innerHTML = `<li class="song-card">No matching songs found.</li>`;
    return;
  }

  filtered.forEach((song) => {
    const li = document.createElement("li");
    li.className = "song-card";

    const titleEl = document.createElement("strong");
    titleEl.textContent = song.title;

    li.appendChild(titleEl);

    li.addEventListener("click", () => openSong(song));
    songListEl.appendChild(li);
  });
}

async function loadAssetContent(filePath, targetEl, isHtml = false) {
  if (!filePath) {
    targetEl.textContent = "Not available for this song yet.";
    return;
  }

  targetEl.textContent = "Loading...";

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("File not found");
    const content = await response.text();

    if (isHtml || filePath.endsWith(".html")) {
      targetEl.innerHTML = content;
    } else {
      targetEl.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(content)}</pre>`;
    }
  } catch (err) {
    targetEl.textContent =
      `File not found or is currently unavailable yet.`;
  }
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function showLibraryView() {
  songViewerEl.style.display = "none";
  songViewerEl.innerHTML = "";
  libraryViewEl.style.display = "block";
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openSong(song) {
  libraryViewEl.style.display = "none";
  songViewerEl.style.display = "block";
  window.scrollTo({ top: 0, behavior: "instant" });

  songViewerEl.innerHTML = `
    <div class="song-page">
      <button type="button" id="close-song-btn" class="return-btn">← Back to List</button>
      <h2 class="song-page-title">${escapeHtml(song.title)}</h2>

      <div class="song-tabs">
        <button type="button" id="tab-lyrics-btn" class="active">Lyrics</button>
        <button type="button" id="tab-sheet-btn">Sheet Music</button>
      </div>

      <div id="song-content-panel" class="song-content-panel"></div>
    </div>
  `;

  const contentPanel = document.getElementById("song-content-panel");
  const lyricsBtn = document.getElementById("tab-lyrics-btn");
  const sheetBtn = document.getElementById("tab-sheet-btn");
  const closeBtn = document.getElementById("close-song-btn");

  const showLyrics = () => {
    lyricsBtn.classList.add("active");
    sheetBtn.classList.remove("active");
    loadAssetContent(song.lyricsFile, contentPanel, true);
  };

  const showSheetMusic = () => {
    sheetBtn.classList.add("active");
    lyricsBtn.classList.remove("active");
    loadAssetContent(song.sheetMusicFile, contentPanel, true);
  };

  lyricsBtn.addEventListener("click", showLyrics);
  sheetBtn.addEventListener("click", showSheetMusic);
  closeBtn.addEventListener("click", showLibraryView);

  showLyrics();
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderSongs();
});

// Initial render
renderMainFilters();
renderSubFilters();
renderSongs();