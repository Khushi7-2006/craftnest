const CATEGORIES = [
  "All",
  "DIY Journals",
  "Scrapbooking Kits",
  "Sticker Packs",
  "Washi Tapes",
  "Handmade Notebooks",
  "Decorative Papers",
  "Art & Craft Kits",
  "Gift Stationery",
  "DIY Cards",
  "Bookmark Kits",
];

export default function CategoryFilter({ value, onChange }) {
  return (
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
