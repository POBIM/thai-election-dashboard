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
