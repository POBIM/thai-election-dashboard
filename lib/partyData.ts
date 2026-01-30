/**
 * Thai Political Party Data Library
 * Data source: Election Commission of Thailand, WeVis, Wikipedia
 * Updated for 2026 General Election (February 8, 2026)
 */

import { PoliticalParty, PartyResult, CoalitionSide } from '@/app/types';

// Major Thai Political Parties for 2026 Election
export const THAI_PARTIES: PoliticalParty[] = [
  // Major Parties
  {
    id: 'ptp',
    nameTh: 'เพื่อไทย',
    nameEn: 'Pheu Thai Party',
    abbreviation: 'พท.',
    color: '#DC2626', // Red
    partyNumber: 9,
    ideology: 'populist',
    coalition: 'opposition',
    leader: 'แพทองธาร ชินวัตร',
    founded: 2008,
    isActive: true
  },
  {
    id: 'pp',
    nameTh: 'ประชาชน',
    nameEn: "People's Party",
    abbreviation: 'ปชน.',
    color: '#F97316', // Orange
    partyNumber: 46,
    ideology: 'progressive',
    coalition: 'opposition',
    leader: 'ณัฐพงษ์ เรืองปัญญาวุฒิ',
    founded: 2024,
    isActive: true
  },
  {
    id: 'bjt',
    nameTh: 'ภูมิใจไทย',
    nameEn: 'Bhumjaithai Party',
    abbreviation: 'ภท.',
    color: '#2563EB', // Blue
    partyNumber: 37,
    ideology: 'conservative',
    coalition: 'government',
    leader: 'อนุทิน ชาญวีรกูล',
    founded: 2008,
    isActive: true
  },
  {
    id: 'utn',
    nameTh: 'รวมไทยสร้างชาติ',
    nameEn: 'United Thai Nation Party',
    abbreviation: 'รทสช.',
    color: '#1E40AF', // Dark Blue
    partyNumber: 21,
    ideology: 'conservative',
    coalition: 'government',
    leader: 'พีระพันธุ์ สาลีรัฐวิภาค',
    founded: 2021,
    isActive: true
  },
  {
    id: 'pprp',
    nameTh: 'พลังประชารัฐ',
    nameEn: 'Palang Pracharath Party',
    abbreviation: 'พปชร.',
    color: '#3B82F6', // Blue
    partyNumber: 25,
    ideology: 'conservative',
    coalition: 'government',
    leader: 'ประวิตร วงษ์สุวรรณ',
    founded: 2018,
    isActive: true
  },
  {
    id: 'dem',
    nameTh: 'ประชาธิปัตย์',
    nameEn: 'Democrat Party',
    abbreviation: 'ปชป.',
    color: '#60A5FA', // Light Blue
    partyNumber: 10,
    ideology: 'liberal',
    coalition: 'opposition',
    leader: 'เฉลิมชัย ศรีอ่อน',
    founded: 1946,
    isActive: true
  },
  {
    id: 'tst',
    nameTh: 'ไทยสร้างไทย',
    nameEn: 'Thai Sang Thai Party',
    abbreviation: 'ทสท.',
    color: '#EC4899', // Pink
    partyNumber: 28,
    ideology: 'populist',
    coalition: 'opposition',
    leader: 'สุดารัตน์ เกยุราพันธุ์',
    founded: 2021,
    isActive: true
  },
  {
    id: 'ctp',
    nameTh: 'ชาติไทยพัฒนา',
    nameEn: 'Chart Thai Pattana Party',
    abbreviation: 'ชทพ.',
    color: '#CA8A04', // Gold/Brown
    partyNumber: 18,
    ideology: 'conservative',
    coalition: 'government',
    leader: 'วราวุธ ศิลปอาชา',
    founded: 2008,
    isActive: true
  },
  {
    id: 'tlp',
    nameTh: 'เสรีรวมไทย',
    nameEn: 'Thai Liberal Party',
    abbreviation: 'สรท.',
    color: '#DB2777', // Pink
    partyNumber: 42,
    ideology: 'liberal',
    coalition: 'opposition',
    leader: 'เสรีพิศุทธ์ เตมียเวส',
    founded: 2018,
    isActive: true
  },
  {
    id: 'cptp',
    nameTh: 'ชาติพัฒนากล้า',
    nameEn: 'Chart Pattana Kla Party',
    abbreviation: 'ชพก.',
    color: '#7C3AED', // Purple
    partyNumber: 20,
    ideology: 'centrist',
    coalition: 'government',
    leader: 'กรณ์ จาติกวณิช',
    founded: 2020,
    isActive: true
  },
  {
    id: 'pcc',
    nameTh: 'พลังประชาชาติไทย',
    nameEn: 'Thai Civilized Party',
    abbreviation: 'พปชท.',
    color: '#059669', // Emerald
    partyNumber: 26,
    ideology: 'centrist',
    coalition: 'neutral',
    leader: 'พิเชษฐ สถิรชวาล',
    founded: 2018,
    isActive: true
  },
  // Smaller/Regional Parties
  {
    id: 'prd',
    nameTh: 'ประชาชาติ',
    nameEn: 'Prachachart Party',
    abbreviation: 'ปช.',
    color: '#10B981', // Green
    partyNumber: 32,
    ideology: 'centrist',
    coalition: 'opposition',
    leader: 'วันมูหะมัดนอร์ มะทา',
    founded: 2018,
    isActive: true
  },
  {
    id: 'new',
    nameTh: 'ใหม่',
    nameEn: 'New Party',
    abbreviation: 'ใหม่',
    color: '#8B5CF6', // Violet
    partyNumber: 1,
    ideology: 'progressive',
    coalition: 'neutral',
    founded: 2023,
    isActive: true
  }
];

// Party lookup maps for quick access
export const PARTY_BY_ID = new Map<string, PoliticalParty>(
  THAI_PARTIES.map(party => [party.id, party])
);

export const PARTY_BY_NAME_TH = new Map<string, PoliticalParty>(
  THAI_PARTIES.map(party => [party.nameTh, party])
);

export const PARTY_BY_NAME_EN = new Map<string, PoliticalParty>(
  THAI_PARTIES.map(party => [party.nameEn, party])
);

// Utility Functions
export function getPartyById(id: string): PoliticalParty | undefined {
  return PARTY_BY_ID.get(id);
}

export function getPartyByNameTh(nameTh: string): PoliticalParty | undefined {
  return PARTY_BY_NAME_TH.get(nameTh);
}

export function getPartyByNameEn(nameEn: string): PoliticalParty | undefined {
  return PARTY_BY_NAME_EN.get(nameEn);
}

export function getPartyColor(partyId: string): string {
  return PARTY_BY_ID.get(partyId)?.color || '#9CA3AF';
}

export function getPartiesByCoalition(side: CoalitionSide): PoliticalParty[] {
  return THAI_PARTIES.filter(party => party.coalition === side && party.isActive);
}

export function getActiveParties(): PoliticalParty[] {
  return THAI_PARTIES.filter(party => party.isActive);
}

export function getMajorParties(): PoliticalParty[] {
  // Top parties by seat projection/relevance
  const majorPartyIds = ['ptp', 'pp', 'bjt', 'utn', 'pprp', 'dem', 'tst', 'ctp'];
  return majorPartyIds.map(id => PARTY_BY_ID.get(id)!).filter(Boolean);
}

// Coalition helper
export function getCoalitionNameTh(side: CoalitionSide): string {
  const names: Record<CoalitionSide, string> = {
    government: 'ฝ่ายรัฐบาล',
    opposition: 'ฝ่ายค้าน',
    neutral: 'ยังไม่ระบุ'
  };
  return names[side];
}

// Calculate total seats from party results
export function calculateTotalSeats(results: PartyResult[]): {
  total: number;
  constituency: number;
  partyList: number;
} {
  return results.reduce(
    (acc, r) => ({
      total: acc.total + r.totalSeats,
      constituency: acc.constituency + r.constituencySeats,
      partyList: acc.partyList + r.partyListSeats
    }),
    { total: 0, constituency: 0, partyList: 0 }
  );
}

// Sort parties by vote count or seats
export function sortPartiesBySeats(results: PartyResult[]): PartyResult[] {
  return [...results].sort((a, b) => b.totalSeats - a.totalSeats);
}

export function sortPartiesByVotes(results: PartyResult[]): PartyResult[] {
  return [...results].sort((a, b) => b.voteCount - a.voteCount);
}

// Format party display name
export function formatPartyName(party: PoliticalParty, style: 'full' | 'short' | 'abbrev' = 'full'): string {
  switch (style) {
    case 'abbrev':
      return party.abbreviation;
    case 'short':
      return party.nameTh;
    case 'full':
    default:
      return `${party.nameTh} (${party.nameEn})`;
  }
}

// Seat threshold for forming government (251 out of 500 MPs)
export const MAJORITY_THRESHOLD = 251;
export const TOTAL_SEATS = 500;
export const CONSTITUENCY_SEATS = 400;
export const PARTY_LIST_SEATS = 100;

export function canFormGovernment(seats: number): boolean {
  return seats >= MAJORITY_THRESHOLD;
}

export function getSeatsNeededForMajority(currentSeats: number): number {
  return Math.max(0, MAJORITY_THRESHOLD - currentSeats);
}

// 2023 Election Results for Reference (basis for 2026 simulation)
export const ELECTION_2023_RESULTS: PartyResult[] = [
  { partyId: 'pp', constituencySeats: 112, partyListSeats: 39, totalSeats: 151, voteCount: 14438851, votePercentage: 36.23 },
  { partyId: 'ptp', constituencySeats: 112, partyListSeats: 29, totalSeats: 141, voteCount: 10962522, votePercentage: 27.50 },
  { partyId: 'bjt', constituencySeats: 68, partyListSeats: 3, totalSeats: 71, voteCount: 1139459, votePercentage: 2.86 },
  { partyId: 'pprp', constituencySeats: 39, partyListSeats: 1, totalSeats: 40, voteCount: 473147, votePercentage: 1.19 },
  { partyId: 'utn', constituencySeats: 23, partyListSeats: 13, totalSeats: 36, voteCount: 4766408, votePercentage: 11.96 },
  { partyId: 'dem', constituencySeats: 22, partyListSeats: 3, totalSeats: 25, voteCount: 941086, votePercentage: 2.36 },
  { partyId: 'ctp', constituencySeats: 9, partyListSeats: 1, totalSeats: 10, voteCount: 383064, votePercentage: 0.96 },
  { partyId: 'tst', constituencySeats: 6, partyListSeats: 0, totalSeats: 6, voteCount: 164802, votePercentage: 0.41 },
  { partyId: 'prd', constituencySeats: 9, partyListSeats: 0, totalSeats: 9, voteCount: 137678, votePercentage: 0.35 },
];

// Note: Move Forward Party (ก้าวไกล) was dissolved in 2024 and succeeded by People's Party (ประชาชน)
// The data above reflects the transition where PP inherits MFP's political base

// ============================================================================
// Province Winning Party Data (Based on 2023 Election Results)
// ============================================================================

export interface ProvincePartyData {
  province: string;         // Thai province name
  winningPartyId: string;   // Party that won most seats
  districtCount: number;    // Total electoral districts
  partySeats: Record<string, number>; // Seats won by each party
}

// Province-level party wins based on 2023 constituency results
export const PROVINCE_PARTY_DATA: ProvincePartyData[] = [
  // Bangkok (33 districts) - People's Party dominated
  { province: "กรุงเทพมหานคร", winningPartyId: "pp", districtCount: 33, partySeats: { pp: 32, ptp: 1 } },

  // Central Region
  { province: "นนทบุรี", winningPartyId: "pp", districtCount: 6, partySeats: { pp: 5, ptp: 1 } },
  { province: "ปทุมธานี", winningPartyId: "pp", districtCount: 5, partySeats: { pp: 4, ptp: 1 } },
  { province: "สมุทรปราการ", winningPartyId: "pp", districtCount: 6, partySeats: { pp: 5, bjt: 1 } },
  { province: "นครปฐม", winningPartyId: "pp", districtCount: 4, partySeats: { pp: 3, bjt: 1 } },
  { province: "สมุทรสาคร", winningPartyId: "pp", districtCount: 2, partySeats: { pp: 2 } },
  { province: "สมุทรสงคราม", winningPartyId: "pp", districtCount: 1, partySeats: { pp: 1 } },
  { province: "ชลบุรี", winningPartyId: "bjt", districtCount: 8, partySeats: { bjt: 5, pp: 3 } },
  { province: "ระยอง", winningPartyId: "pp", districtCount: 4, partySeats: { pp: 3, bjt: 1 } },
  { province: "ฉะเชิงเทรา", winningPartyId: "pp", districtCount: 4, partySeats: { pp: 2, bjt: 2 } },
  { province: "จันทบุรี", winningPartyId: "bjt", districtCount: 3, partySeats: { bjt: 2, pp: 1 } },
  { province: "ตราด", winningPartyId: "bjt", districtCount: 1, partySeats: { bjt: 1 } },
  { province: "ปราจีนบุรี", winningPartyId: "bjt", districtCount: 3, partySeats: { bjt: 2, pp: 1 } },
  { province: "สระแก้ว", winningPartyId: "bjt", districtCount: 3, partySeats: { bjt: 2, ptp: 1 } },
  { province: "นครนายก", winningPartyId: "pp", districtCount: 1, partySeats: { pp: 1 } },
  { province: "พระนครศรีอยุธยา", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 2, pp: 1, bjt: 1 } },
  { province: "อ่างทอง", winningPartyId: "ptp", districtCount: 1, partySeats: { ptp: 1 } },
  { province: "สระบุรี", winningPartyId: "pp", districtCount: 4, partySeats: { pp: 2, bjt: 1, ptp: 1 } },
  { province: "ลพบุรี", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 2, bjt: 1, pp: 1 } },
  { province: "สิงห์บุรี", winningPartyId: "ptp", districtCount: 1, partySeats: { ptp: 1 } },
  { province: "ชัยนาท", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "สุพรรณบุรี", winningPartyId: "ctp", districtCount: 4, partySeats: { ctp: 3, ptp: 1 } },
  { province: "กาญจนบุรี", winningPartyId: "bjt", districtCount: 4, partySeats: { bjt: 2, pp: 1, ptp: 1 } },
  { province: "ราชบุรี", winningPartyId: "bjt", districtCount: 4, partySeats: { bjt: 2, pp: 1, ptp: 1 } },
  { province: "เพชรบุรี", winningPartyId: "dem", districtCount: 2, partySeats: { dem: 1, bjt: 1 } },
  { province: "ประจวบคีรีขันธ์", winningPartyId: "dem", districtCount: 2, partySeats: { dem: 1, bjt: 1 } },

  // North Region
  { province: "เชียงใหม่", winningPartyId: "ptp", districtCount: 10, partySeats: { ptp: 7, pp: 3 } },
  { province: "เชียงราย", winningPartyId: "ptp", districtCount: 7, partySeats: { ptp: 5, pp: 2 } },
  { province: "ลำปาง", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 3, pp: 1 } },
  { province: "ลำพูน", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "แม่ฮ่องสอน", winningPartyId: "ptp", districtCount: 1, partySeats: { ptp: 1 } },
  { province: "น่าน", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "พะเยา", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "แพร่", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "อุตรดิตถ์", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "ตาก", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 2, bjt: 1 } },
  { province: "สุโขทัย", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 2, bjt: 1 } },
  { province: "พิษณุโลก", winningPartyId: "ptp", districtCount: 5, partySeats: { ptp: 3, pp: 1, bjt: 1 } },
  { province: "พิจิตร", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 2, bjt: 1 } },
  { province: "เพชรบูรณ์", winningPartyId: "ptp", districtCount: 5, partySeats: { ptp: 4, bjt: 1 } },
  { province: "กำแพงเพชร", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 3, bjt: 1 } },
  { province: "นครสวรรค์", winningPartyId: "ptp", districtCount: 5, partySeats: { ptp: 3, bjt: 2 } },
  { province: "อุทัยธานี", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },

  // Northeast Region
  { province: "นครราชสีมา", winningPartyId: "ptp", districtCount: 15, partySeats: { ptp: 8, bjt: 4, pp: 3 } },
  { province: "บุรีรัมย์", winningPartyId: "bjt", districtCount: 9, partySeats: { bjt: 8, ptp: 1 } },
  { province: "สุรินทร์", winningPartyId: "ptp", districtCount: 7, partySeats: { ptp: 4, bjt: 3 } },
  { province: "ศรีสะเกษ", winningPartyId: "ptp", districtCount: 8, partySeats: { ptp: 5, bjt: 3 } },
  { province: "อุบลราชธานี", winningPartyId: "ptp", districtCount: 11, partySeats: { ptp: 8, bjt: 2, pp: 1 } },
  { province: "ยโสธร", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 3 } },
  { province: "ชัยภูมิ", winningPartyId: "ptp", districtCount: 6, partySeats: { ptp: 4, bjt: 2 } },
  { province: "อำนาจเจริญ", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "หนองคาย", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 3 } },
  { province: "หนองบัวลำภู", winningPartyId: "ptp", districtCount: 3, partySeats: { ptp: 2, bjt: 1 } },
  { province: "อุดรธานี", winningPartyId: "ptp", districtCount: 9, partySeats: { ptp: 8, pp: 1 } },
  { province: "เลย", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 4 } },
  { province: "สกลนคร", winningPartyId: "ptp", districtCount: 6, partySeats: { ptp: 5, bjt: 1 } },
  { province: "นครพนม", winningPartyId: "ptp", districtCount: 4, partySeats: { ptp: 4 } },
  { province: "มุกดาหาร", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },
  { province: "กาฬสินธุ์", winningPartyId: "ptp", districtCount: 5, partySeats: { ptp: 4, bjt: 1 } },
  { province: "ร้อยเอ็ด", winningPartyId: "ptp", districtCount: 7, partySeats: { ptp: 6, bjt: 1 } },
  { province: "มหาสารคาม", winningPartyId: "ptp", districtCount: 5, partySeats: { ptp: 4, bjt: 1 } },
  { province: "ขอนแก่น", winningPartyId: "ptp", districtCount: 11, partySeats: { ptp: 8, pp: 2, bjt: 1 } },
  { province: "บึงกาฬ", winningPartyId: "ptp", districtCount: 2, partySeats: { ptp: 2 } },

  // South Region
  { province: "ชุมพร", winningPartyId: "dem", districtCount: 3, partySeats: { dem: 2, bjt: 1 } },
  { province: "สุราษฎร์ธานี", winningPartyId: "dem", districtCount: 6, partySeats: { dem: 4, bjt: 2 } },
  { province: "นครศรีธรรมราช", winningPartyId: "dem", districtCount: 9, partySeats: { dem: 5, bjt: 3, pp: 1 } },
  { province: "กระบี่", winningPartyId: "dem", districtCount: 2, partySeats: { dem: 2 } },
  { province: "พังงา", winningPartyId: "bjt", districtCount: 2, partySeats: { bjt: 1, dem: 1 } },
  { province: "ภูเก็ต", winningPartyId: "pp", districtCount: 2, partySeats: { pp: 2 } },
  { province: "สุราษฎร์ธานี", winningPartyId: "dem", districtCount: 6, partySeats: { dem: 4, bjt: 2 } },
  { province: "ระนอง", winningPartyId: "dem", districtCount: 1, partySeats: { dem: 1 } },
  { province: "พัทลุง", winningPartyId: "dem", districtCount: 3, partySeats: { dem: 3 } },
  { province: "ตรัง", winningPartyId: "dem", districtCount: 4, partySeats: { dem: 3, bjt: 1 } },
  { province: "สตูล", winningPartyId: "dem", districtCount: 2, partySeats: { dem: 2 } },
  { province: "สงขลา", winningPartyId: "dem", districtCount: 8, partySeats: { dem: 5, bjt: 2, prd: 1 } },
  { province: "ปัตตานี", winningPartyId: "prd", districtCount: 4, partySeats: { prd: 4 } },
  { province: "ยะลา", winningPartyId: "prd", districtCount: 3, partySeats: { prd: 3 } },
  { province: "นราธิวาส", winningPartyId: "prd", districtCount: 4, partySeats: { prd: 3, bjt: 1 } },
];

// Create lookup map by province name
export const PROVINCE_PARTY_MAP = new Map<string, ProvincePartyData>(
  PROVINCE_PARTY_DATA.map(data => [data.province, data])
);

/**
 * Get winning party for a province
 */
export function getProvinceWinningParty(provinceTh: string): PoliticalParty | undefined {
  const data = PROVINCE_PARTY_MAP.get(provinceTh);
  if (!data) return undefined;
  return PARTY_BY_ID.get(data.winningPartyId);
}

/**
 * Get province party data
 */
export function getProvincePartyData(provinceTh: string): ProvincePartyData | undefined {
  return PROVINCE_PARTY_MAP.get(provinceTh);
}

/**
 * Get Bangkok district breakdown by party
 */
export function getBangkokDistrictsByParty(): { partyId: string; party: PoliticalParty; seats: number }[] {
  const bkkData = PROVINCE_PARTY_MAP.get("กรุงเทพมหานคร");
  if (!bkkData) return [];

  return Object.entries(bkkData.partySeats)
    .map(([partyId, seats]) => ({
      partyId,
      party: PARTY_BY_ID.get(partyId)!,
      seats
    }))
    .filter(item => item.party)
    .sort((a, b) => b.seats - a.seats);
}

/**
 * Get party seat summary across all provinces
 */
export function getPartySeatSummary(): { partyId: string; party: PoliticalParty; totalSeats: number; provinces: number }[] {
  const summary = new Map<string, { totalSeats: number; provinces: number }>();

  PROVINCE_PARTY_DATA.forEach(province => {
    Object.entries(province.partySeats).forEach(([partyId, seats]) => {
      if (!summary.has(partyId)) {
        summary.set(partyId, { totalSeats: 0, provinces: 0 });
      }
      const data = summary.get(partyId)!;
      data.totalSeats += seats;
      data.provinces += 1;
    });
  });

  return Array.from(summary.entries())
    .map(([partyId, data]) => ({
      partyId,
      party: PARTY_BY_ID.get(partyId)!,
      ...data
    }))
    .filter(item => item.party)
    .sort((a, b) => b.totalSeats - a.totalSeats);
}
