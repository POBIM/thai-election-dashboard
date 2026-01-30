export interface DistrictData {
  name: string;
  voterCount: number;
  province: string;
  zoneDescription?: string;
  amphoeList?: string[];
  actualVoters?: number;
  invalidVotes?: number;
  noVotes?: number;
}

export interface ElectionData {
  totalEligibleVoters: number;
  totalActualVoters?: number;
  lastUpdated: string;
  regions: RegionData[];
}

export interface RegionData {
  regionName: string;
  totalVoters: number;
  districts: DistrictData[];
}

export interface ElectionData {
  totalEligibleVoters: number;
  lastUpdated: string;
  regions: RegionData[];
}

export enum RegionFilter {
  ALL = 'All',
  BANGKOK = 'Bangkok',
  CENTRAL = 'Central',
  NORTH = 'North',
  NORTHEAST = 'Northeast',
  SOUTH = 'South'
}

// Party Types for Election Simulation
export interface PoliticalParty {
  id: string;
  nameTh: string;
  nameEn: string;
  abbreviation: string;
  color: string;
  logoUrl?: string;
  partyNumber?: number; // Ballot number for 2026 election
  ideology: PartyIdeology;
  coalition: CoalitionSide;
  leader?: string;
  founded?: number;
  isActive: boolean;
}

export type PartyIdeology =
  | 'progressive'      // ก้าวหน้า
  | 'conservative'     // อนุรักษ์นิยม
  | 'populist'         // ประชานิยม
  | 'liberal'          // เสรีนิยม
  | 'centrist';        // กลาง

export type CoalitionSide =
  | 'government'       // ฝ่ายรัฐบาล
  | 'opposition'       // ฝ่ายค้าน
  | 'neutral';         // กลาง/ไม่ระบุ

export interface PartyResult {
  partyId: string;
  constituencySeats: number;
  partyListSeats: number;
  totalSeats: number;
  voteCount: number;
  votePercentage: number;
}

export interface DistrictResult {
  districtName: string;
  province: string;
  winningPartyId: string;
  results: PartyVoteResult[];
}

export interface PartyVoteResult {
  partyId: string;
  votes: number;
  percentage: number;
}

export interface ElectionSimulationConfig {
  targetPartyId?: string;
  turnoutTarget?: number;
  swingFactors?: Record<string, number>; // party id -> swing percentage
}

export interface CustomSimulationConfig {
  partyConstituencySeats: Record<string, number>;
  partyListSeats: Record<string, number>;
}

export interface CustomSimulationResult {
  partyResults: PartyResult[];
  totalConstituencySeats: number; // should always = 400
  totalPartyListSeats: number; // should always = 100
  totalSeats: number; // should always = 500
  canFormGovernment: {
    partyId: string;
    partyName: string;
    totalSeats: number;
    canForm: boolean;
    seatsNeeded: number;
  }[];
  suggestedCoalitions: {
    parties: { partyId: string; partyName: string; seats: number }[];
    totalSeats: number;
    canFormGovernment: boolean;
  }[];
}
