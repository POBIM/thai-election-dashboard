'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import type { RegionData } from '../types';
import { RegionFilter } from '../types';
import {
  toThaiProvince,
  getRegion,
  getRegionColor,
  getRegionNameTh,
  getTurnoutColor,
  aggregateByProvince,
  formatNumber,
  formatPercent,
  REGION_COLORS,
} from '@/lib/provinceMapping';
import type { ProvinceStats } from '@/lib/provinceMapping';
import {
  getProvinceWinningParty,
  getProvincePartyData,
  getBangkokDistrictsByParty,
  getPartySeatSummary,
  PARTY_BY_ID,
} from '@/lib/partyData';

const GEO_URL = "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/tha.topo.json";

// Province centroid coordinates for labels (approximate)
const PROVINCE_CENTROIDS: Record<string, [number, number]> = {
  "Bangkok": [100.5, 13.75],
  "Nonthaburi": [100.5, 13.9],
  "Pathum Thani": [100.5, 14.0],
  "Samut Prakan": [100.6, 13.6],
  "Nakhon Pathom": [100.1, 13.8],
  "Chon Buri": [101.0, 13.3],
  "Rayong": [101.3, 12.7],
  "Chiang Mai": [98.9, 18.8],
  "Chiang Rai": [99.8, 19.9],
  "Nakhon Ratchasima": [102.1, 15.0],
  "Khon Kaen": [102.8, 16.4],
  "Udon Thani": [102.8, 17.4],
  "Ubon Ratchathani": [104.8, 15.2],
  "Buri Ram": [103.1, 14.9],
  "Songkhla": [100.5, 7.2],
  "Nakhon Si Thammarat": [99.9, 8.4],
  "Surat Thani": [99.3, 9.1],
  "Phuket": [98.4, 7.9],
};

type ViewMode = 'region' | 'turnout' | 'party';

interface ThailandMapProps {
  regionStats: RegionData[];
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const ThailandMap: React.FC<ThailandMapProps> = ({ regionStats, selectedRegion, onSelectRegion }) => {
  const safeRegionStats = regionStats ?? [];
  
  const [geoData, setGeoData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<ProvinceStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('party');

  useEffect(() => {
    let isMounted = true;
    
    const loadGeoData = async () => {
      try {
        const response = await fetch(GEO_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch map data');
        }
        const data = await response.json();
        
        if (isMounted && data && typeof data === 'object') {
          setGeoData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load map data:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadGeoData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Use centralized aggregation function
  const provinceData = useMemo(() => {
    return aggregateByProvince(safeRegionStats);
  }, [safeRegionStats]);

  // Get party seat summary for legend
  const partySummary = useMemo(() => getPartySeatSummary(), []);
  const bangkokParties = useMemo(() => getBangkokDistrictsByParty(), []);

  // Get fill color based on view mode
  const getFillColor = (provinceNameEn: string, provinceNameTh: string, isSelected: boolean): string => {
    if (!isSelected) return "#E5E7EB";

    switch (viewMode) {
      case 'party': {
        const party = getProvinceWinningParty(provinceNameTh);
        return party?.color || "#9CA3AF";
      }
      case 'turnout': {
        const stats = provinceData.get(provinceNameTh);
        return stats ? getTurnoutColor(stats.turnoutPercentage) : "#9CA3AF";
      }
      case 'region':
      default: {
        const region = getRegion(provinceNameEn);
        return getRegionColor(region);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[700px] relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">แผนที่แสดงข้อมูลการเลือกตั้ง (Election Map)</h3>
          <p className="text-sm text-gray-500">คลิกที่จังหวัดเพื่อดูข้อมูลเฉพาะภาค</p>
        </div>
        <div className="flex items-center gap-2">
          {(['party', 'region', 'turnout'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {mode === 'party' ? 'ตามพรรค' : mode === 'region' ? 'ตามภาค' : 'ตาม % มาใช้สิทธิ'}
            </button>
          ))}
          {selectedRegion !== RegionFilter.ALL && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelectRegion(RegionFilter.ALL); }}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded ml-2"
            >
              รีเซ็ต
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow flex gap-4">
        {/* Main Map */}
        <div className="flex-grow h-full rounded-lg overflow-hidden relative bg-blue-50/10 flex items-center justify-center">
          {hasError ? (
            <div className="text-red-400 text-sm flex flex-col items-center">
              <p>ไม่สามารถโหลดแผนที่ได้</p>
              <p className="text-xs mt-1 text-gray-400">(Map Data Unavailable)</p>
            </div>
          ) : isLoading || !geoData ? (
            <div className="text-gray-400 animate-pulse">กำลังโหลดแผนที่...</div>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 2600,
                center: [100.5, 13.5]
              }}
              className="w-full h-full"
              width={380}
              height={750}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => geo.properties?.name)
                    .map((geo) => {
                      const provinceNameEn = geo.properties.name;
                      const provinceNameTh = toThaiProvince(provinceNameEn);
                      const region = getRegion(provinceNameEn);
                      const isSelected = selectedRegion === RegionFilter.ALL || selectedRegion === region;
                      const provinceStats = provinceData.get(provinceNameTh);
                      const fillColor = getFillColor(provinceNameEn, provinceNameTh, isSelected);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                        onMouseEnter={() => {
                          if (provinceStats) {
                            setTooltipContent(provinceStats);
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent(null);
                        }}
                        onClick={() => onSelectRegion(region)}
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 0.2s"
                          },
                          hover: {
                            fill: fillColor,
                            stroke: "#FFFFFF",
                            strokeWidth: 1,
                            outline: "none",
                            filter: "brightness(0.85)",
                            cursor: "pointer"
                          },
                          pressed: {
                            fill: fillColor,
                            outline: "none",
                            filter: "brightness(0.7)"
                          }
                        }}
                      />
                      );
                    })
                }
              </Geographies>

              {/* Province Labels with District Count */}
              {Object.entries(PROVINCE_CENTROIDS).map(([provinceName, coords]) => {
                const provinceNameTh = toThaiProvince(provinceName);
                const partyData = getProvincePartyData(provinceNameTh);
                const region = getRegion(provinceName);
                const isSelected = selectedRegion === RegionFilter.ALL || selectedRegion === region;

                if (!partyData || !isSelected) return null;

                return (
                  <Marker key={provinceName} coordinates={coords}>
                    <circle r={8} fill="white" stroke="#374151" strokeWidth={0.5} opacity={0.9} />
                    <text
                      textAnchor="middle"
                      y={4}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#1F2937",
                        fontSize: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      {partyData.districtCount}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>
          )}

          {/* Tooltip */}
          {tooltipContent && (
            <div className="absolute bottom-4 left-4 bg-gray-800 text-white text-xs px-4 py-3 rounded-lg shadow-lg pointer-events-none opacity-95 z-10 min-w-[250px]">
              <div className="font-semibold text-sm flex items-center gap-2">
                {tooltipContent.nameTh}
                {viewMode === 'party' && (() => {
                  const party = getProvinceWinningParty(tooltipContent.nameTh);
                  return party ? (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: party.color, color: 'white' }}
                    >
                      {party.abbreviation}
                    </span>
                  ) : null;
                })()}
              </div>
              <div className="text-gray-400 text-xs mb-2">{tooltipContent.nameEn}</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-300">ภาค:</span>
                  <span>{tooltipContent.regionNameTh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">เขตเลือกตั้ง:</span>
                  <span className="font-semibold text-yellow-400">{getProvincePartyData(tooltipContent.nameTh)?.districtCount || tooltipContent.districtCount} เขต</span>
                </div>
                {viewMode === 'party' && (() => {
                  const partyData = getProvincePartyData(tooltipContent.nameTh);
                  if (!partyData || !partyData.partySeats) return null;
                  return (
                    <div className="border-t border-gray-600 pt-1 mt-1">
                      <div className="text-gray-300 mb-1">ที่นั่งตามพรรค:</div>
                      {Object.entries(partyData.partySeats)
                        .sort(([,a], [,b]) => b - a)
                        .map(([partyId, seats]) => {
                          const party = PARTY_BY_ID.get(partyId);
                          return party ? (
                            <div key={partyId} className="flex justify-between items-center">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }}></span>
                                {party.abbreviation}
                              </span>
                              <span>{seats} ที่นั่ง</span>
                            </div>
                          ) : null;
                        })}
                    </div>
                  );
                })()}
                <div className="flex justify-between">
                  <span className="text-gray-300">ผู้มีสิทธิ:</span>
                  <span>{formatNumber(tooltipContent.totalEligible)} คน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">มาใช้สิทธิ:</span>
                  <span>{formatNumber(tooltipContent.totalActual)} คน</span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-1 mt-1">
                  <span className="text-gray-300">ร้อยละมาใช้สิทธิ:</span>
                  <span className={`font-semibold ${
                    tooltipContent.turnoutPercentage >= 75 ? 'text-green-400' :
                    tooltipContent.turnoutPercentage >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatPercent(tooltipContent.turnoutPercentage)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Party Legend */}
        <div className="w-[220px] flex flex-col gap-3">
          {/* View Mode Legend */}
          <div className="bg-white/95 p-3 rounded-lg shadow-sm border border-gray-100 text-xs backdrop-blur-sm">
            <div className="font-semibold text-gray-700 mb-2">
              {viewMode === 'party' ? 'พรรคที่ชนะ' : viewMode === 'region' ? 'ภูมิภาค' : 'ร้อยละมาใช้สิทธิ'}
            </div>

            {viewMode === 'party' && (
              <div className="space-y-1.5">
                {partySummary.slice(0, 8).map(({ partyId, party, totalSeats, provinces }) => (
                  <div key={partyId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: party.color }}></div>
                      <span className="text-gray-700">{party.abbreviation}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{totalSeats} ที่นั่ง</span>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'turnout' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "#059669" }}></div>
                  <span className="text-gray-600">80%+ (สูง)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }}></div>
                  <span className="text-gray-600">75-79% (ดี)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
                  <span className="text-gray-600">70-74% (ปานกลาง)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" }}></div>
                  <span className="text-gray-600">ต่ำกว่า 70%</span>
                </div>
              </div>
            )}

            {viewMode === 'region' && (
              <div className="space-y-1">
                {[
                  { key: RegionFilter.ALL, label: 'ทั้งหมด', color: 'gradient' },
                  { key: RegionFilter.BANGKOK, label: 'กรุงเทพฯ', color: REGION_COLORS[RegionFilter.BANGKOK] },
                  { key: RegionFilter.CENTRAL, label: 'ภาคกลาง', color: REGION_COLORS[RegionFilter.CENTRAL] },
                  { key: RegionFilter.NORTH, label: 'ภาคเหนือ', color: REGION_COLORS[RegionFilter.NORTH] },
                  { key: RegionFilter.NORTHEAST, label: 'ภาคอีสาน', color: REGION_COLORS[RegionFilter.NORTHEAST] },
                  { key: RegionFilter.SOUTH, label: 'ภาคใต้', color: REGION_COLORS[RegionFilter.SOUTH] },
                ].map((item, index) => (
                  <React.Fragment key={item.key}>
                    {index === 1 && <div className="border-t border-gray-200 my-1"></div>}
                    <button
                      type="button"
                      onClick={() => onSelectRegion(item.key)}
                      className={`flex items-center gap-2 w-full text-left p-1.5 rounded transition-all ${
                        selectedRegion === item.key
                          ? 'bg-blue-100 ring-1 ring-blue-400'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${item.color === 'gradient' ? 'bg-gradient-to-r from-green-400 via-yellow-400 to-purple-400' : ''}`}
                        style={item.color !== 'gradient' ? { backgroundColor: item.color } : undefined}
                      ></div>
                      <span className={`${selectedRegion === item.key ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Bangkok Detail - Only show when party mode */}
          {viewMode === 'party' && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg shadow-sm border border-orange-200 text-xs">
              <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-lg">🏛️</span>
                กรุงเทพมหานคร
              </div>
              <div className="text-gray-600 mb-2">33 เขตเลือกตั้ง</div>
              <div className="space-y-1.5">
                {bangkokParties.map(({ partyId, party, seats }) => (
                  <div key={partyId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: party.color }}></div>
                      <span className="text-gray-700">{party.nameTh}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-800">{seats}</span>
                      <span className="text-gray-500">เขต</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-orange-200 text-gray-500">
                พรรคประชาชนครองพื้นที่ส่วนใหญ่
              </div>
            </div>
          )}

          {/* Selected Region Info */}
          {selectedRegion !== RegionFilter.ALL && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-xs font-medium">
              กำลังแสดง: {getRegionNameTh(selectedRegion)}
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
            <div className="font-semibold text-gray-700 mb-2">สถิติด่วน</div>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>ทั้งหมด:</span>
                <span className="font-medium">400 เขต</span>
              </div>
              <div className="flex justify-between">
                <span>จังหวัด:</span>
                <span className="font-medium">77 จังหวัด</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
