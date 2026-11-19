// Format: [id, title, massPart, seasons, language, hasSheet]
const RAW_SONGS = [
  ["laudate-dominum", "Laudate Dominum", ["Entrance"], [], ["Multilingual"], false],
  ["iesu-panis-vitae", "Iesu, Panis Vitae", ["Communion"], [], ["Multilingual"], false],
  ["balang-araw", "Balang Araw", ["Recessional"], ["Advent"], ["Tagalog"], false],
  ["we-are-yours", "We Are Yours", ["Communion"], [], ["English"], false],
  ["lhm-as-we-prepare", "Lord, Have Mercy (As We Prepare)", ["Kyrie"], [], ["English"], false],
  ["kyrie-mmc", "Kyrie, Eleison (MMC)", ["Kyrie"], [], ["Multilingual"], false],
  ["lhm-lfl", "Lord, Have Mercy (Kyrie, Eleison)", ["Kyrie"], [], ["English"], false],
  ["the-first-noel", "The First Noel", [], ["Christmas"], ["English"], false],
  ["hark-the-herald", "Hark! The Herald Angels Sing", [], ["Christmas"], ["English"], false],
  ["adeste-fideles", "Adeste Fideles", [], ["Christmas"], ["Multilingual"], false],
  ["angels-we-have-heard", "Angels We Have Heard on High", [], ["Christmas"], ["English"], false],
  ["god-rest-ye-merry", "God Rest Ye Merry, Gentlemen", [], ["Christmas"], ["English"], false],
  ["joy-to-the-world", "Joy To The World", [], ["Christmas"], ["English"], false],
  ["o-holy-night", "O Holy Night", [], ["Christmas"], ["English"], false],
  ["silent-night", "Silent Night", [], ["Christmas"], ["English"], false],
  ["kasadya-ning-taknaa", "Kasadya Ning Taknaa", [], ["Christmas"], ["Cebuano"], false],
  ["ave-maria", "Ave Maria", [], ["Ordinary Time"], ["Latin"], false]
];

globalThis.songs = RAW_SONGS.map(
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