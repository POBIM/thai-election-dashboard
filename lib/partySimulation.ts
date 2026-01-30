/**
 * Party Simulation Utilities
 * Functions for simulating election outcomes based on conditions
 *
 * For 2026 Thai General Election (February 8, 2026)
 */

import { RegionFilter, PartyResult, DistrictResult, ElectionSimulationConfig, PoliticalParty, CustomSimulationConfig, CustomSimulationResult } from '@/app/types';
import {
  THAI_PARTIES,
  PARTY_BY_ID,
  ELECTION_2023_RESULTS,
  TOTAL_SEATS,
  CONSTITUENCY_SEATS,
  PARTY_LIST_SEATS,
  MAJORITY_THRESHOLD
} from './partyData';

// Regional party strength based on 2023 results and historical patterns
// Values represent base support percentage in each region
export const REGIONAL_PARTY_STRENGTH: Record<string, Record<string, number>> = {
  [RegionFilter.BANGKOK]: {
    pp: 45,    // People's Party strong in Bangkok
    ptp: 25,   // Pheu Thai moderate
    dem: 10,   // Democrat base
    bjt: 5,    // Bhumjaithai weak
    utn: 8,    // United Thai Nation
    pprp: 3,   // Palang Pracharath
    other: 4
  },
  [RegionFilter.CENTRAL]: {
    ptp: 30,   // Pheu Thai strong
    pp: 25,    // People's Party growing
    bjt: 20,   // Bhumjaithai
    dem: 8,    // Democrat
    utn: 7,    // United Thai Nation
    pprp: 5,   // Palang Pracharath
    other: 5
  },
  [RegionFilter.NORTH]: {
    ptp: 50,   // Pheu Thai dominant
    pp: 25,    // People's Party
    bjt: 10,   // Bhumjaithai
    dem: 5,    // Democrat weak
    utn: 5,    // United Thai Nation
    pprp: 2,   // Palang Pracharath
    other: 3
  },
  [RegionFilter.NORTHEAST]: {
    ptp: 55,   // Pheu Thai strongest here
    pp: 20,    // People's Party
    bjt: 12,   // Bhumjaithai
    dem: 3,    // Democrat weak
    utn: 5,    // United Thai Nation
    pprp: 2,   // Palang Pracharath
    other: 3
  },
  [RegionFilter.SOUTH]: {
    dem: 40,   // Democrat stronghold
    bjt: 20,   // Bhumjaithai growing
    pp: 15,    // People's Party
    ptp: 10,   // Pheu Thai weak
    pprp: 8,   // Palang Pracharath
    utn: 4,    // United Thai Nation
    other: 3
  }
};

// Constituency seat distribution by region (based on 2023 allocation)
export const REGIONAL_SEATS: Record<string, number> = {
  [RegionFilter.BANGKOK]: 33,
  [RegionFilter.CENTRAL]: 93,
  [RegionFilter.NORTH]: 71,
  [RegionFilter.NORTHEAST]: 149,
  [RegionFilter.SOUTH]: 54
};

interface SimulationResult {
  partyResults: PartyResult[];
  seatsByRegion: Record<string, Record<string, number>>;
  totalTurnout: number;
  canFormGovernment: { partyId: string; canForm: boolean; seatsNeeded: number }[];
  winningCoalition?: { parties: string[]; totalSeats: number };
}

/**
 * Simulate election results based on configuration
 */
export function simulateElection(config: ElectionSimulationConfig = {}): SimulationResult {
  const { targetPartyId, turnoutTarget = 75, swingFactors = {} } = config;

  const seatsByRegion: Record<string, Record<string, number>> = {};
  const partySeats: Record<string, { constituency: number; votes: number }> = {};

  // Initialize party seats
  THAI_PARTIES.forEach(party => {
    partySeats[party.id] = { constituency: 0, votes: 0 };
  });

  // Calculate seats for each region
  Object.entries(REGIONAL_SEATS).forEach(([region, totalSeats]) => {
    seatsByRegion[region] = {};
    const baseStrength = REGIONAL_PARTY_STRENGTH[region] || {};

    // Apply swing factors
    const adjustedStrength: Record<string, number> = {};
    let totalStrength = 0;

    Object.entries(baseStrength).forEach(([partyId, strength]) => {
      if (partyId === 'other') {
        adjustedStrength[partyId] = strength;
      } else {
        const swing = swingFactors[partyId] || 0;
        // Boost target party if specified
        const targetBoost = targetPartyId === partyId ? 5 : 0;
        adjustedStrength[partyId] = Math.max(0, strength + swing + targetBoost);
      }
      totalStrength += adjustedStrength[partyId];
    });

    // Normalize and distribute seats
    const normalizedStrength: Record<string, number> = {};
    Object.entries(adjustedStrength).forEach(([partyId, strength]) => {
      normalizedStrength[partyId] = strength / totalStrength;
    });

    // Distribute seats using D'Hondt-like method for realism
    let remainingSeats = totalSeats;
    const partyRemainders: Record<string, number> = {};

    Object.entries(normalizedStrength).forEach(([partyId, share]) => {
      if (partyId !== 'other') {
        const exactSeats = share * totalSeats;
        const floorSeats = Math.floor(exactSeats);
        seatsByRegion[region][partyId] = floorSeats;
        partyRemainders[partyId] = exactSeats - floorSeats;
        remainingSeats -= floorSeats;

        if (partySeats[partyId]) {
          partySeats[partyId].constituency += floorSeats;
          partySeats[partyId].votes += Math.round(share * 1000000 * (turnoutTarget / 100));
        }
      }
    });

    // Distribute remaining seats by largest remainder
    const sortedByRemainder = Object.entries(partyRemainders)
      .sort(([, a], [, b]) => b - a);

    for (let i = 0; i < remainingSeats && i < sortedByRemainder.length; i++) {
      const partyId = sortedByRemainder[i][0];
      seatsByRegion[region][partyId]++;
      if (partySeats[partyId]) {
        partySeats[partyId].constituency++;
      }
    }
  });

  // Calculate party list seats (100 seats proportionally distributed)
  const totalVotes = Object.values(partySeats).reduce((sum, p) => sum + p.votes, 0);
  const partyListAllocation: Record<string, number> = {};

  Object.entries(partySeats).forEach(([partyId, data]) => {
    if (data.votes > 0) {
      const voteShare = data.votes / totalVotes;
      partyListAllocation[partyId] = Math.round(voteShare * PARTY_LIST_SEATS);
    }
  });

  // Build final results
  const partyResults: PartyResult[] = Object.entries(partySeats)
    .filter(([, data]) => data.constituency > 0 || partyListAllocation[data.constituency] > 0)
    .map(([partyId, data]) => ({
      partyId,
      constituencySeats: data.constituency,
      partyListSeats: partyListAllocation[partyId] || 0,
      totalSeats: data.constituency + (partyListAllocation[partyId] || 0),
      voteCount: data.votes,
      votePercentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0
    }))
    .sort((a, b) => b.totalSeats - a.totalSeats);

  // Check which parties can form government
  const canFormGovernment = partyResults.map(result => ({
    partyId: result.partyId,
    canForm: result.totalSeats >= MAJORITY_THRESHOLD,
    seatsNeeded: Math.max(0, MAJORITY_THRESHOLD - result.totalSeats)
  }));

  // Find potential winning coalition
  const winningCoalition = findWinningCoalition(partyResults);

  return {
    partyResults,
    seatsByRegion,
    totalTurnout: turnoutTarget,
    canFormGovernment,
    winningCoalition
  };
}

/**
 * Find a potential coalition that can form government
 */
function findWinningCoalition(results: PartyResult[]): { parties: string[]; totalSeats: number } | undefined {
  // Try to form coalition from top parties
  const sortedResults = [...results].sort((a, b) => b.totalSeats - a.totalSeats);
  const coalition: string[] = [];
  let totalSeats = 0;

  for (const result of sortedResults) {
    coalition.push(result.partyId);
    totalSeats += result.totalSeats;

    if (totalSeats >= MAJORITY_THRESHOLD) {
      return { parties: coalition, totalSeats };
    }
  }

  return undefined;
}

/**
 * Calculate swing needed for a party to win majority
 */
export function calculateSwingForMajority(partyId: string): number {
  const baseResult = simulateElection();
  const partyResult = baseResult.partyResults.find(r => r.partyId === partyId);

  if (!partyResult) return 100;

  const currentSeats = partyResult.totalSeats;
  const seatsNeeded = MAJORITY_THRESHOLD - currentSeats;

  // Rough approximation: 1% swing ≈ 5-8 seats
  return Math.ceil(seatsNeeded / 6);
}

/**
 * Get predicted winner for a region based on strength
 */
export function getRegionalWinner(region: RegionFilter): { partyId: string; party: PoliticalParty; strength: number } | undefined {
  const strengths = REGIONAL_PARTY_STRENGTH[region];
  if (!strengths) return undefined;

  let maxStrength = 0;
  let winnerId = '';

  Object.entries(strengths).forEach(([partyId, strength]) => {
    if (partyId !== 'other' && strength > maxStrength) {
      maxStrength = strength;
      winnerId = partyId;
    }
  });

  const party = PARTY_BY_ID.get(winnerId);
  if (!party) return undefined;

  return { partyId: winnerId, party, strength: maxStrength };
}

/**
 * Calculate competitiveness of a region
 */
export function getRegionalCompetitiveness(region: RegionFilter): 'safe' | 'leaning' | 'competitive' | 'tossup' {
  const strengths = REGIONAL_PARTY_STRENGTH[region];
  if (!strengths) return 'tossup';

  const partyStrengths = Object.entries(strengths)
    .filter(([id]) => id !== 'other')
    .map(([, s]) => s)
    .sort((a, b) => b - a);

  if (partyStrengths.length < 2) return 'safe';

  const gap = partyStrengths[0] - partyStrengths[1];

  if (gap >= 20) return 'safe';
  if (gap >= 10) return 'leaning';
  if (gap >= 5) return 'competitive';
  return 'tossup';
}

// Export 2023 baseline for comparison
export const BASELINE_2023 = ELECTION_2023_RESULTS;

export function runCustomSimulation(config: CustomSimulationConfig): CustomSimulationResult {
  const { partyConstituencySeats, partyListSeats } = config;

  const allPartyIds = new Set([
    ...Object.keys(partyConstituencySeats),
    ...Object.keys(partyListSeats)
  ]);

  const partyResults: PartyResult[] = [];

  allPartyIds.forEach(partyId => {
    const constituency = partyConstituencySeats[partyId] || 0;
    const list = partyListSeats[partyId] || 0;
    const total = constituency + list;

    if (total <= 0) return;

    const totalSeatsSum = Object.values(partyConstituencySeats).reduce((s, v) => s + v, 0) +
                          Object.values(partyListSeats).reduce((s, v) => s + v, 0);
    const voteShare = totalSeatsSum > 0 ? total / totalSeatsSum : 0;
    const estimatedVotes = Math.round(voteShare * 40000000);

    partyResults.push({
      partyId,
      constituencySeats: constituency,
      partyListSeats: list,
      totalSeats: total,
      voteCount: estimatedVotes,
      votePercentage: voteShare * 100
    });
  });

  partyResults.sort((a, b) => b.totalSeats - a.totalSeats);

  const totalConstituencySeats = partyResults.reduce((sum, r) => sum + r.constituencySeats, 0);
  const totalPartyListSeats = partyResults.reduce((sum, r) => sum + r.partyListSeats, 0);

  const canFormGovernment = partyResults.map(result => {
    const party = PARTY_BY_ID.get(result.partyId);
    return {
      partyId: result.partyId,
      partyName: party?.nameTh || result.partyId,
      totalSeats: result.totalSeats,
      canForm: result.totalSeats >= MAJORITY_THRESHOLD,
      seatsNeeded: Math.max(0, MAJORITY_THRESHOLD - result.totalSeats)
    };
  });

  const suggestedCoalitions = generateCoalitionSuggestions(partyResults);

  return {
    partyResults,
    totalConstituencySeats,
    totalPartyListSeats,
    totalSeats: totalConstituencySeats + totalPartyListSeats,
    canFormGovernment,
    suggestedCoalitions
  };
}

function generateCoalitionSuggestions(results: PartyResult[]): CustomSimulationResult['suggestedCoalitions'] {
  const coalitions: CustomSimulationResult['suggestedCoalitions'] = [];
  const sorted = [...results].sort((a, b) => b.totalSeats - a.totalSeats);

  if (sorted.length === 0) return coalitions;

  const buildCoalition = (startIdx: number, maxParties: number) => {
    const parties: { partyId: string; partyName: string; seats: number }[] = [];
    let totalSeats = 0;

    for (let i = startIdx; i < sorted.length && parties.length < maxParties; i++) {
      const result = sorted[i];
      const party = PARTY_BY_ID.get(result.partyId);
      parties.push({
        partyId: result.partyId,
        partyName: party?.nameTh || result.partyId,
        seats: result.totalSeats
      });
      totalSeats += result.totalSeats;

      if (totalSeats >= MAJORITY_THRESHOLD) break;
    }

    return { parties, totalSeats, canFormGovernment: totalSeats >= MAJORITY_THRESHOLD };
  };

  coalitions.push(buildCoalition(0, 6));

  if (sorted.length > 1) {
    coalitions.push(buildCoalition(1, 6));
  }

  const governmentParties = sorted.filter(r => {
    const party = PARTY_BY_ID.get(r.partyId);
    return party?.coalition === 'government';
  });

  if (governmentParties.length > 0) {
    const parties = governmentParties.map(r => {
      const party = PARTY_BY_ID.get(r.partyId);
      return {
        partyId: r.partyId,
        partyName: party?.nameTh || r.partyId,
        seats: r.totalSeats
      };
    });
    const totalSeats = parties.reduce((sum, p) => sum + p.seats, 0);
    coalitions.push({ parties, totalSeats, canFormGovernment: totalSeats >= MAJORITY_THRESHOLD });
  }

  const oppositionParties = sorted.filter(r => {
    const party = PARTY_BY_ID.get(r.partyId);
    return party?.coalition === 'opposition';
  });

  if (oppositionParties.length > 0) {
    const parties = oppositionParties.map(r => {
      const party = PARTY_BY_ID.get(r.partyId);
      return {
        partyId: r.partyId,
        partyName: party?.nameTh || r.partyId,
        seats: r.totalSeats
      };
    });
    const totalSeats = parties.reduce((sum, p) => sum + p.seats, 0);
    coalitions.push({ parties, totalSeats, canFormGovernment: totalSeats >= MAJORITY_THRESHOLD });
  }

  return coalitions;
}

export function getDefaultConstituencySeats(): Record<string, number> {
  const defaults: Record<string, number> = {};
  ELECTION_2023_RESULTS.forEach(result => {
    defaults[result.partyId] = result.constituencySeats;
  });
  return defaults;
}

export function getDefaultPartyListSeats(): Record<string, number> {
  const defaults: Record<string, number> = {};
  ELECTION_2023_RESULTS.forEach(result => {
    defaults[result.partyId] = result.partyListSeats;
  });
  return defaults;
}
