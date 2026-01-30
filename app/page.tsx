'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ElectionData, RegionFilter, CustomSimulationResult } from './types';
import { StatsCard } from './components/StatsCard';
import { VotersByRegionPie, TopDistrictsBar, TurnoutByRegionChart, DistrictTurnoutDistribution } from './components/Charts';
import { DistrictTable } from './components/DistrictTable';
import { ThailandMap } from './components/ThailandMap';
import { SimulationDialog } from './components/SimulationDialog';
import { Users, MapPin, BarChart3, Globe, Settings, Vote, TrendingUp, AlertCircle, Shuffle, X } from 'lucide-react';
import Link from 'next/link';
import { runCustomSimulation, getDefaultConstituencySeats, getDefaultPartyListSeats } from '@/lib/partySimulation';
import { getPartyById, MAJORITY_THRESHOLD } from '@/lib/partyData';

export default function Home() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter | string>(RegionFilter.ALL);

  const [isSimDialogOpen, setIsSimDialogOpen] = useState(false);
  const [constituencySeats, setConstituencySeats] = useState<Record<string, number>>(() => getDefaultConstituencySeats());
  const [partyListSeats, setPartyListSeats] = useState<Record<string, number>>(() => getDefaultPartyListSeats());
  const [simulationResult, setSimulationResult] = useState<CustomSimulationResult | null>(null);

  const handleConstituencyChange = useCallback((partyId: string, seats: number) => {
    setConstituencySeats(prev => ({ ...prev, [partyId]: seats }));
  }, []);

  const handlePartyListChange = useCallback((partyId: string, seats: number) => {
    setPartyListSeats(prev => ({ ...prev, [partyId]: seats }));
  }, []);

  const handleSimulationApply = useCallback(() => {
    const result = runCustomSimulation({
      partyConstituencySeats: constituencySeats,
      partyListSeats: partyListSeats
    });
    setSimulationResult(result);
    setIsSimDialogOpen(false);
  }, [constituencySeats, partyListSeats]);

  const handleSimulationReset = useCallback(() => {
    setConstituencySeats(getDefaultConstituencySeats());
    setPartyListSeats(getDefaultPartyListSeats());
  }, []);

  const handleClearSimulation = useCallback(() => {
    setSimulationResult(null);
    handleSimulationReset();
  }, [handleSimulationReset]);

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch('/api/election-data');
      const result = await response.json();
      if (result && Array.isArray(result.regions)) {
        setData(result);
      } else {
        console.error('Invalid election data format:', result);
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { filteredDistricts, regionStats, totalVotersFiltered, totalActualVotersFiltered, turnoutPercentage, totalInvalidVotes, totalNoVotes } = useMemo(() => {
    const emptyResult = {
      allDistricts: [],
      filteredDistricts: [],
      regionStats: [],
      totalVotersFiltered: 0,
      totalActualVotersFiltered: 0,
      turnoutPercentage: 0,
      totalInvalidVotes: 0,
      totalNoVotes: 0
    };

    if (!data || !Array.isArray(data.regions)) {
      return emptyResult;
    }

    const all = data.regions.flatMap(r => r.districts);

    let filtered = all;
    if (selectedRegion !== RegionFilter.ALL) {
      filtered = data.regions
        .filter(r => r.regionName.includes(selectedRegion))
        .flatMap(r => r.districts);
    }

    const total = filtered.reduce((acc, curr) => acc + curr.voterCount, 0);
    const totalActual = filtered.reduce((acc, curr) => acc + (curr.actualVoters || 0), 0);
    const turnout = total > 0 ? (totalActual / total) * 100 : 0;
    const invalidVotes = filtered.reduce((acc, curr) => acc + (curr.invalidVotes || 0), 0);
    const noVotes = filtered.reduce((acc, curr) => acc + (curr.noVotes || 0), 0);

    return {
      allDistricts: all,
      filteredDistricts: filtered,
      regionStats: data.regions ?? [],
      totalVotersFiltered: total,
      totalActualVotersFiltered: totalActual,
      turnoutPercentage: turnout,
      totalInvalidVotes: invalidVotes,
      totalNoVotes: noVotes
    };
  }, [data, selectedRegion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">ไม่สามารถโหลดข้อมูลได้</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thai Election Watch</h1>
                <p className="text-xs text-gray-500">Dashboard แสดงจำนวนผู้มีสิทธิเลือกตั้ง</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSimDialogOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                จำลองผลเลือกตั้ง
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                จัดการข้อมูล
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {simulationResult && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Shuffle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">ผลการจำลอง</h2>
                  <p className="text-sm text-gray-500">สส. เขต {simulationResult.totalConstituencySeats} + บัญชีรายชื่อ {simulationResult.totalPartyListSeats} = {simulationResult.totalSeats} ที่นั่ง</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimDialogOpen(true)}
                  className="px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  type="button"
                  onClick={handleClearSimulation}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {simulationResult.partyResults.slice(0, 6).map((result) => {
                const party = getPartyById(result.partyId);
                const canForm = result.totalSeats >= MAJORITY_THRESHOLD;
                return (
                  <div
                    key={result.partyId}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party?.color || '#ccc' }}
                      />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {party?.nameTh || result.partyId}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {result.totalSeats}
                      {canForm && <span className="ml-1 text-xs text-green-600 font-normal">จัดตั้งรัฐบาลได้</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      เขต {result.constituencySeats} + ปาร์ตี้ลิสต์ {result.partyListSeats}
                    </div>
                  </div>
                );
              })}
            </div>

            {simulationResult.suggestedCoalitions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-orange-200">
                <p className="text-sm text-gray-600 mb-2">แนวร่วมที่เป็นไปได้:</p>
                <div className="flex flex-wrap gap-2">
                  {simulationResult.suggestedCoalitions.slice(0, 2).map((coalition) => (
                    <div
                      key={coalition.parties.map(p => p.partyId).join('-')}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        coalition.canFormGovernment
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {coalition.parties.map(p => p.partyName).join(' + ')} = {coalition.totalSeats} ที่นั่ง
                      {coalition.canFormGovernment && ' (จัดตั้งรัฐบาลได้)'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-sm font-medium text-gray-600 mr-2">กรองตามภูมิภาค:</span>
          {[RegionFilter.ALL, RegionFilter.BANGKOK, RegionFilter.CENTRAL, RegionFilter.NORTH, RegionFilter.NORTHEAST, RegionFilter.SOUTH].map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedRegion === region
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {region === RegionFilter.ALL ? 'ทั้งหมด (All)' : region}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            title={selectedRegion === RegionFilter.ALL ? "ผู้มีสิทธิเลือกตั้ง" : `ผู้มีสิทธิฯ`}
            value={totalVotersFiltered.toLocaleString()}
            icon={Users}
            trend={selectedRegion !== RegionFilter.ALL ? selectedRegion : undefined}
            colorClass="bg-blue-500"
          />
          <StatsCard
            title="มาใช้สิทธิ"
            value={totalActualVotersFiltered.toLocaleString()}
            icon={Vote}
            colorClass="bg-green-500"
          />
          <StatsCard
            title="ร้อยละมาใช้สิทธิ"
            value={`${turnoutPercentage.toFixed(2)}%`}
            icon={TrendingUp}
            trend={turnoutPercentage >= 75 ? 'สูงกว่าเป้าหมาย' : 'ต่ำกว่าเป้าหมาย'}
            colorClass={turnoutPercentage >= 75 ? "bg-emerald-500" : "bg-yellow-500"}
          />
          <StatsCard
            title="จำนวนเขต"
            value={filteredDistricts.length}
            icon={MapPin}
            colorClass="bg-indigo-500"
          />
          <StatsCard
            title="บัตรเสีย"
            value={totalInvalidVotes.toLocaleString()}
            icon={AlertCircle}
            trend={totalActualVotersFiltered > 0 ? `${((totalInvalidVotes / totalActualVotersFiltered) * 100).toFixed(2)}%` : undefined}
            colorClass="bg-red-500"
          />
          <StatsCard
            title="ไม่ลงคะแนน"
            value={totalNoVotes.toLocaleString()}
            icon={BarChart3}
            trend={totalActualVotersFiltered > 0 ? `${((totalNoVotes / totalActualVotersFiltered) * 100).toFixed(2)}%` : undefined}
            colorClass="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThailandMap
            regionStats={regionStats}
            selectedRegion={selectedRegion}
            onSelectRegion={(region) => setSelectedRegion(region as string)}
            simulationResult={simulationResult}
          />

          <div className="flex flex-col gap-6">
            {selectedRegion === RegionFilter.ALL ? (
               <VotersByRegionPie data={regionStats} />
            ) : (
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>เลือก &quot;ทั้งหมด&quot; เพื่อดูสัดส่วนรวม</p>
                  </div>
               </div>
            )}
          </div>
        </div>

        {selectedRegion === RegionFilter.ALL && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TurnoutByRegionChart data={regionStats} />
            <DistrictTurnoutDistribution data={filteredDistricts} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <TopDistrictsBar data={filteredDistricts} />
        </div>

        <div className="w-full">
           <DistrictTable districts={filteredDistricts} />
        </div>

        <div className="text-center text-xs text-gray-400 pt-8 pb-4">
          <p>หมายเหตุ: ข้อมูลนี้เป็นเพียงตัวอย่าง (Demo) เท่านั้น ไม่ใช่ข้อมูลจริงจาก กกต.</p>
          <p>อัปเดตล่าสุด: {new Date(data.lastUpdated).toLocaleString('th-TH')}</p>
        </div>
      </main>

      <SimulationDialog
        isOpen={isSimDialogOpen}
        onClose={() => setIsSimDialogOpen(false)}
        constituencySeats={constituencySeats}
        partyListSeats={partyListSeats}
        onConstituencyChange={handleConstituencyChange}
        onPartyListChange={handlePartyListChange}
        onApply={handleSimulationApply}
        onReset={handleSimulationReset}
      />
    </div>
  );
}
