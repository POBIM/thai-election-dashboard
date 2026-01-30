'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { RegionData, RegionFilter, DistrictData } from '../types';

const GEO_URL = "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

interface ThailandMapProps {
  regionStats: RegionData[];
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

interface ProvinceStats {
  name: string;
  region: string;
  totalEligible: number;
  totalActual: number;
  turnoutPercentage: number;
  districtCount: number;
}

const PROVINCE_REGION_MAP: Record<string, string> = {
  "Chiang Rai": RegionFilter.NORTH, "Chiang Mai": RegionFilter.NORTH, "Nan": RegionFilter.NORTH, "Phayao": RegionFilter.NORTH,
  "Phrae": RegionFilter.NORTH, "Mae Hong Son": RegionFilter.NORTH, "Lampang": RegionFilter.NORTH, "Lamphun": RegionFilter.NORTH,
  "Uttaradit": RegionFilter.NORTH, "Tak": RegionFilter.NORTH, "Sukhothai": RegionFilter.NORTH, "Phitsanulok": RegionFilter.NORTH,
  "Phichit": RegionFilter.NORTH, "Phetchabun": RegionFilter.NORTH, "Kamphaeng Phet": RegionFilter.NORTH, "Nakhon Sawan": RegionFilter.NORTH,
  "Uthai Thani": RegionFilter.NORTH,

  "Kalasin": RegionFilter.NORTHEAST, "Khon Kaen": RegionFilter.NORTHEAST, "Chaiyaphum": RegionFilter.NORTHEAST, "Nakhon Phanom": RegionFilter.NORTHEAST,
  "Nakhon Ratchasima": RegionFilter.NORTHEAST, "Bueng Kan": RegionFilter.NORTHEAST, "Buri Ram": RegionFilter.NORTHEAST, "Maha Sarakham": RegionFilter.NORTHEAST,
  "Mukdahan": RegionFilter.NORTHEAST, "Yasothon": RegionFilter.NORTHEAST, "Roi Et": RegionFilter.NORTHEAST, "Loei": RegionFilter.NORTHEAST,
  "Sakon Nakhon": RegionFilter.NORTHEAST, "Surin": RegionFilter.NORTHEAST, "Si Sa Ket": RegionFilter.NORTHEAST, "Nong Khai": RegionFilter.NORTHEAST,
  "Nong Bua Lam Phu": RegionFilter.NORTHEAST, "Udon Thani": RegionFilter.NORTHEAST, "Ubon Ratchathani": RegionFilter.NORTHEAST, "Amnat Charoen": RegionFilter.NORTHEAST,

  "Bangkok": RegionFilter.BANGKOK, "Bangkok Metropolis": RegionFilter.BANGKOK,

  "Chai Nat": RegionFilter.CENTRAL, "Nakhon Nayok": RegionFilter.CENTRAL, "Nakhon Pathom": RegionFilter.CENTRAL,
  "Nonthaburi": RegionFilter.CENTRAL, "Pathum Thani": RegionFilter.CENTRAL, "Phra Nakhon Si Ayutthaya": RegionFilter.CENTRAL,
  "Lop Buri": RegionFilter.CENTRAL, "Samut Prakan": RegionFilter.CENTRAL, "Samut Songkhram": RegionFilter.CENTRAL,
  "Samut Sakhon": RegionFilter.CENTRAL, "Sing Buri": RegionFilter.CENTRAL, "Suphan Buri": RegionFilter.CENTRAL,
  "Saraburi": RegionFilter.CENTRAL, "Ang Thong": RegionFilter.CENTRAL, "Chanthaburi": RegionFilter.CENTRAL,
  "Chachoengsao": RegionFilter.CENTRAL, "Chon Buri": RegionFilter.CENTRAL, "Trat": RegionFilter.CENTRAL,
  "Prachin Buri": RegionFilter.CENTRAL, "Rayong": RegionFilter.CENTRAL, "Sa Kaeo": RegionFilter.CENTRAL,
  "Kanchanaburi": RegionFilter.CENTRAL, "Prachuap Khiri Khan": RegionFilter.CENTRAL, "Phetchaburi": RegionFilter.CENTRAL,
  "Ratchaburi": RegionFilter.CENTRAL,

  "Krabi": RegionFilter.SOUTH, "Chumphon": RegionFilter.SOUTH, "Trang": RegionFilter.SOUTH, "Nakhon Si Thammarat": RegionFilter.SOUTH,
  "Narathiwat": RegionFilter.SOUTH, "Pattani": RegionFilter.SOUTH, "Phangnga": RegionFilter.SOUTH, "Phatthalung": RegionFilter.SOUTH,
  "Phuket": RegionFilter.SOUTH, "Yala": RegionFilter.SOUTH, "Ranong": RegionFilter.SOUTH, "Songkhla": RegionFilter.SOUTH,
  "Satun": RegionFilter.SOUTH, "Surat Thani": RegionFilter.SOUTH
};

const REGION_COLORS: Record<string, string> = {
  [RegionFilter.NORTH]: "#34D399",
  [RegionFilter.NORTHEAST]: "#FBBF24",
  [RegionFilter.CENTRAL]: "#60A5FA",
  [RegionFilter.BANGKOK]: "#F87171",
  [RegionFilter.SOUTH]: "#818CF8",
  "Default": "#E5E7EB"
};

function getTurnoutColor(percentage: number): string {
  if (percentage >= 80) return "#059669";
  if (percentage >= 75) return "#3B82F6";
  if (percentage >= 70) return "#F59E0B";
  return "#EF4444";
}

export const ThailandMap: React.FC<ThailandMapProps> = ({ regionStats, selectedRegion, onSelectRegion }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<ProvinceStats | null>(null);
  const [showByTurnout, setShowByTurnout] = useState(false);

  useEffect(() => {
    fetch(GEO_URL)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => setGeoData(data))
      .catch(err => {
        console.error("Failed to load map data", err);
        setError(true);
      });
  }, []);

  const provinceData = useMemo(() => {
    const data: Record<string, ProvinceStats> = {};
    
    regionStats.forEach(region => {
      region.districts.forEach((district: DistrictData) => {
        const provinceName = district.province;
        if (!data[provinceName]) {
          data[provinceName] = {
            name: provinceName,
            region: region.regionName,
            totalEligible: 0,
            totalActual: 0,
            turnoutPercentage: 0,
            districtCount: 0
          };
        }
        data[provinceName].totalEligible += district.voterCount;
        data[provinceName].totalActual += district.actualVoters || 0;
        data[provinceName].districtCount += 1;
      });
    });

    Object.values(data).forEach(province => {
      province.turnoutPercentage = province.totalActual > 0 
        ? (province.totalActual / province.totalEligible) * 100 
        : 0;
    });

    return data;
  }, [regionStats]);

  const getRegionFromProvince = (provinceName: string) => {
    return PROVINCE_REGION_MAP[provinceName] || RegionFilter.CENTRAL;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[700px] relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">แผนที่แสดงข้อมูลการเลือกตั้ง (Election Map)</h3>
          <p className="text-sm text-gray-500">คลิกที่จังหวัดเพื่อดูข้อมูลเฉพาะภาค</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowByTurnout(!showByTurnout)}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              showByTurnout 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {showByTurnout ? 'แสดงตามภาค' : 'แสดงตาม % มาใช้สิทธิ'}
          </button>
          {selectedRegion !== RegionFilter.ALL && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelectRegion(RegionFilter.ALL); }}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded"
            >
              รีเซ็ต
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow w-full h-full rounded-lg overflow-hidden relative bg-blue-50/10 flex items-center justify-center">
        {error ? (
          <div className="text-red-400 text-sm flex flex-col items-center">
            <p>ไม่สามารถโหลดแผนที่ได้</p>
            <p className="text-xs mt-1 text-gray-400">(Map Data Unavailable)</p>
          </div>
        ) : !geoData ? (
          <div className="text-gray-400 animate-pulse">Loading Map...</div>
        ) : (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2800,
              center: [100.5, 13.5]
            }}
            className="w-full h-full"
            width={400}
            height={800}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const provinceName = geo.properties.name || geo.properties.NAME_1;
                  const region = getRegionFromProvince(provinceName);
                  const isSelected = String(selectedRegion) === String(RegionFilter.ALL) || String(selectedRegion) === String(region);
                  const provinceStats = provinceData[provinceName];

                  let fillColor: string;
                  if (showByTurnout && provinceStats) {
                    fillColor = isSelected ? getTurnoutColor(provinceStats.turnoutPercentage) : "#E5E7EB";
                  } else {
                    fillColor = isSelected ? REGION_COLORS[region] : "#E5E7EB";
                  }

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
                          fill: isSelected ? (showByTurnout ? getTurnoutColor(provinceStats?.turnoutPercentage || 0) : REGION_COLORS[region]) : "#9CA3AF",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          filter: "brightness(0.85)",
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: showByTurnout ? getTurnoutColor(provinceStats?.turnoutPercentage || 0) : REGION_COLORS[region],
                          outline: "none",
                          filter: "brightness(0.7)"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}

        {tooltipContent && (
          <div className="absolute bottom-4 left-4 bg-gray-800 text-white text-xs px-4 py-3 rounded-lg shadow-lg pointer-events-none opacity-95 z-10 min-w-[200px]">
            <div className="font-semibold text-sm mb-2">{tooltipContent.name}</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">ภาค:</span>
                <span>{tooltipContent.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">เขตเลือกตั้ง:</span>
                <span>{tooltipContent.districtCount} เขต</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">ผู้มีสิทธิ:</span>
                <span>{formatNumber(tooltipContent.totalEligible)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">มาใช้สิทธิ:</span>
                <span>{formatNumber(tooltipContent.totalActual)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-1 mt-1">
                <span className="text-gray-300">ร้อยละ:</span>
                <span className={`font-semibold ${
                  tooltipContent.turnoutPercentage >= 75 ? 'text-green-400' : 
                  tooltipContent.turnoutPercentage >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {tooltipContent.turnoutPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/95 p-4 rounded-lg shadow-sm border border-gray-100 text-xs space-y-3 backdrop-blur-sm max-w-[180px]">
          <div className="font-semibold text-gray-700 mb-2">
            {showByTurnout ? 'ร้อยละการมาใช้สิทธิ' : 'เลือกภูมิภาค'}
          </div>
          
          {showByTurnout ? (
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
          ) : (
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

        {selectedRegion !== RegionFilter.ALL && (
          <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
            กำลังแสดง: {
              selectedRegion === RegionFilter.BANGKOK ? 'กรุงเทพฯ' :
              selectedRegion === RegionFilter.CENTRAL ? 'ภาคกลาง' :
              selectedRegion === RegionFilter.NORTH ? 'ภาคเหนือ' :
              selectedRegion === RegionFilter.NORTHEAST ? 'ภาคอีสาน' :
              selectedRegion === RegionFilter.SOUTH ? 'ภาคใต้' : selectedRegion
            }
          </div>
        )}
      </div>
    </div>
  );
};
