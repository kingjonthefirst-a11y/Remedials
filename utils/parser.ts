import { CSVRow, FormState } from '../types';

export const parseDescription = (fullDescription: string): { edn: string, db: string, desc: string } => {
  if (!fullDescription) return { edn: '', db: '', desc: '' };

  // Common pattern in CSV: "DB-ID DESCRIPTION TEXT - EDN NUMBER"
  // Example: "DB-1-9-4 BELOW DB TRUNKING IS OVERFILLED - EDN OPS193-1310220234-001"
  
  // Strategy: Split by " - " to try and separate the EDN at the end
  const parts = fullDescription.split(' - ');
  
  let edn = '';
  let remainder = fullDescription;

  // Check if the last part looks like an EDN
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.trim().startsWith('EDN')) {
      edn = lastPart.trim();
      // Rejoin the rest in case there were multiple hyphens
      remainder = parts.slice(0, parts.length - 1).join(' - ');
    }
  }

  // Now parse the remainder for DB ID. 
  // Assumption: DB ID is the first "word" in the remaining string.
  const firstSpaceIndex = remainder.indexOf(' ');
  let db = '';
  let desc = remainder;

  if (firstSpaceIndex > -1) {
    db = remainder.substring(0, firstSpaceIndex).trim();
    desc = remainder.substring(firstSpaceIndex).trim();
  } else {
    // If no space, the whole thing might be the DB ID or just text
    db = remainder;
    desc = '';
  }

  return { edn, db, desc };
};

export const mapRowToForm = (row: CSVRow): Partial<FormState> => {
  const { edn, db, desc } = parseDescription(row["Problem Description"] || "");

  const siteNo = row["Site No."] || "";
  const siteName = row["Site Name"] || "";
  
  return {
    won: row["WO #"] || "",
    storeNumberName: `${siteNo} ${siteName}`.trim(),
    ednNumber: edn,
    dbId: db,
    description: desc,
    // Provide a default date format if available
    dateCompleted: row["Date Completed"] ? new Date(row["Date Completed"]).toISOString().split('T')[0] : "", 
  };
};