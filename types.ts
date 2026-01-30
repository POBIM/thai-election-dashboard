export interface DistrictData {
  name: string;
  voterCount: number;
  province: string;
  zoneDescription?: string;
  amphoeList?: string[];
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