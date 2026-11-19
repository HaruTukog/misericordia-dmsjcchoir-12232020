// Format: [id, title, massPart, seasons, language, hasSheet]
const RAW_SONGS = [
  ["laudate-dominum", "Laudate Dominum", ["Entrance"], [], ["Multilingual"], true],
  ["iesu-panis-vitae", "Iesu, Panis Vitae", ["Communion"], [], ["Multilingual"], true],
  ["balang-araw", "Balang Araw", ["Recessional"], ["Advent"], ["Tagalog"], true],
  ["we-are-yours", "We Are Yours", ["Communion"], [], ["English"], true],
  ["lhm-as-we-prepare", "Lord, Have Mercy (As We Prepare)", ["Kyrie"], [], ["English"], true],
  ["kyrie-mmc", "Kyrie, Eleison (MMC)", ["Kyrie"], [], ["Multilingual"], true],
  ["lhm-lfl", "Lord, Have Mercy (Kyrie, Eleison)", ["Kyrie"], [], ["English"], true],
  ["the-first-noel", "The First Noel", [], ["Christmas"], ["English"], true],
  ["hark-the-herald", "Hark! The Herald Angels Sing", [], ["Christmas"], ["English"], true],
  ["adeste-fideles", "Adeste Fideles", [], ["Christmas"], ["Multilingual"], true],
  ["angels-we-have-heard", "Angels We Have Heard on High", [], ["Christmas"], ["English"], true],
  ["god-rest-ye-merry", "God Rest Ye Merry, Gentlemen", [], ["Christmas"], ["English"], true],
  ["joy-to-the-world", "Joy To The World", [], ["Christmas"], ["English"], true],
  ["o-holy-night", "O Holy Night", [], ["Christmas"], ["English"], true],
  ["silent-night", "Silent Night", [], ["Christmas"], ["English"], true],
  ["kasadya-ning-taknaa", "Kasadya Ning Taknaa", [], ["Christmas"], ["Cebuano"], true],
  ["ave-maria", "Ave Maria", [], ["Ordinary Time"], ["Latin"], true]
];

window.songs = RAW_SONGS.map(
  ([id, title, massPart = [], seasons = [], language = [], hasSheet = true]) => ({
    id,
    title,
    massPart,
    seasons,
    language,
    lyricsFile: `assets/lyrics/${id}.html`,
    sheetMusicFile: hasSheet ? `assets/sheets/${id}.html` : null
  })
);