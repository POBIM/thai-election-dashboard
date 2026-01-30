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
