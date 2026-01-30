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
  "เชียงราย": RegionFilter.NORTH, "เชียงใหม่": RegionFilter.NORTH, "น่าน": RegionFilter.NORTH, "พะเยา": RegionFilter.NORTH,
  "แพร่": RegionFilter.NORTH, "แม่ฮ่องสอน": RegionFilter.NORTH, "ลำปาง": RegionFilter.NORTH, "ลำพูน": RegionFilter.NORTH,
  "อุตรดิตถ์": RegionFilter.NORTH, "ตาก": RegionFilter.NORTH, "สุโขทัย": RegionFilter.NORTH, "พิษณุโลก": RegionFilter.NORTH,
  "พิจิตร": RegionFilter.NORTH, "เพชรบูรณ์": RegionFilter.NORTH, "กำแพงเพชร": RegionFilter.NORTH, "นครสวรรค์": RegionFilter.NORTH,
  "อุทัยธานี": RegionFilter.NORTH,
  "กาฬสินธุ์": RegionFilter.NORTHEAST, "ขอนแก่น": RegionFilter.NORTHEAST, "ชัยภูมิ": RegionFilter.NORTHEAST, "นครพนม": RegionFilter.NORTHEAST,
  "นครราชสีมา": RegionFilter.NORTHEAST, "บึงกาฬ": RegionFilter.NORTHEAST, "บุรีรัมย์": RegionFilter.NORTHEAST, "มหาสารคาม": RegionFilter.NORTHEAST,
  "มุกดาหาร": RegionFilter.NORTHEAST, "ยโสธร": RegionFilter.NORTHEAST, "ร้อยเอ็ด": RegionFilter.NORTHEAST, "เลย": RegionFilter.NORTHEAST,
  "สกลนคร": RegionFilter.NORTHEAST, "สุรินทร์": RegionFilter.NORTHEAST, "ศรีสะเกษ": RegionFilter.NORTHEAST, "หนองคาย": RegionFilter.NORTHEAST,
  "หนองบัวลำภู": RegionFilter.NORTHEAST, "อุดรธานี": RegionFilter.NORTHEAST, "อุบลราชธานี": RegionFilter.NORTHEAST, "อำนาจเจริญ": RegionFilter.NORTHEAST,
  "กรุงเทพมหานคร": RegionFilter.BANGKOK,
  "ชัยนาท": RegionFilter.CENTRAL, "นครนายก": RegionFilter.CENTRAL, "นครปฐม": RegionFilter.CENTRAL,
  "นนทบุรี": RegionFilter.CENTRAL, "ปทุมธานี": RegionFilter.CENTRAL, "พระนครศรีอยุธยา": RegionFilter.CENTRAL,
  "ลพบุรี": RegionFilter.CENTRAL, "สมุทรปราการ": RegionFilter.CENTRAL, "สมุทรสงคราม": RegionFilter.CENTRAL,
  "สมุทรสาคร": RegionFilter.CENTRAL, "สิงห์บุรี": RegionFilter.CENTRAL, "สุพรรณบุรี": RegionFilter.CENTRAL,
  "สระบุรี": RegionFilter.CENTRAL, "อ่างทอง": RegionFilter.CENTRAL, "จันทบุรี": RegionFilter.CENTRAL,
  "ฉะเชิงเทรา": RegionFilter.CENTRAL, "ชลบุรี": RegionFilter.CENTRAL, "ตราด": RegionFilter.CENTRAL,
  "ปราจีนบุรี": RegionFilter.CENTRAL, "ระยอง": RegionFilter.CENTRAL, "สระแก้ว": RegionFilter.CENTRAL,
  "กาญจนบุรี": RegionFilter.CENTRAL, "ประจวบคีรีขันธ์": RegionFilter.CENTRAL, "เพชรบุรี": RegionFilter.CENTRAL,
  "ราชบุรี": RegionFilter.CENTRAL,
  "กระบี่": RegionFilter.SOUTH, "ชุมพร": RegionFilter.SOUTH, "ตรัง": RegionFilter.SOUTH, "นครศรีธรรมราช": RegionFilter.SOUTH,
  "นราธิวาส": RegionFilter.SOUTH, "ปัตตานี": RegionFilter.SOUTH, "พังงา": RegionFilter.SOUTH, "พัทลุง": RegionFilter.SOUTH,
  "ภูเก็ต": RegionFilter.SOUTH, "ยะลา": RegionFilter.SOUTH, "ระนอง": RegionFilter.SOUTH, "สงขลา": RegionFilter.SOUTH,
  "สตูล": RegionFilter.SOUTH, "สุราษฎร์ธานี": RegionFilter.SOUTH
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

  const getRegionStats = (regionName: string) => {
    return regionStats.find(r => r.regionName === regionName);
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
            height={500}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const provinceName = geo.properties.name || geo.properties.NAME_1;
                  const region = getRegionFromProvince(provinceName);
                  const isSelected = selectedRegion === RegionFilter.ALL || selectedRegion === region;
                  const provinceStats = provinceData[provinceName];
                  const regionStatsData = getRegionStats(region);

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
            {showByTurnout ? 'ร้อยละการมาใช้สิทธิ' : 'ภูมิภาค'}
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
            <div className="space-y-2">
              {Object.keys(REGION_COLORS).filter(k => k !== 'Default').map(region => (
                <button
                  key={region}
                  type="button"
                  onClick={() => onSelectRegion(region)}
                  className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-1 rounded transition-colors"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: REGION_COLORS[region] }}></div>
                  <span className={`${selectedRegion === region ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{region}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRegion !== RegionFilter.ALL && (
          <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
            กำลังแสดง: {selectedRegion}
          </div>
        )}
      </div>
    </div>
  );
};
