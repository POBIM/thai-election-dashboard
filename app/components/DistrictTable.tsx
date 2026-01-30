import React, { useState, useMemo } from 'react';
import { DistrictData } from '../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface DistrictTableProps {
  districts: DistrictData[];
}

export const DistrictTable: React.FC<DistrictTableProps> = ({ districts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'voters' | 'actual' | 'turnout'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.zoneDescription && d.zoneDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedDistricts = useMemo(() => {
    return [...filteredDistricts].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'th');
          break;
        case 'voters':
          comparison = a.voterCount - b.voterCount;
          break;
        case 'actual':
          comparison = (a.actualVoters || 0) - (b.actualVoters || 0);
          break;
        case 'turnout':
          const turnoutA = a.actualVoters && a.voterCount ? (a.actualVoters / a.voterCount) * 100 : 0;
          const turnoutB = b.actualVoters && b.voterCount ? (b.actualVoters / b.voterCount) * 100 : 0;
          comparison = turnoutA - turnoutB;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredDistricts, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'voters' | 'actual' | 'turnout') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const toggleRow = (districtName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(districtName)) {
      newExpanded.delete(districtName);
    } else {
      newExpanded.add(districtName);
    }
    setExpandedRows(newExpanded);
  };

  const getTurnoutColor = (turnout: number) => {
    if (turnout >= 80) return 'text-green-600';
    if (turnout >= 75) return 'text-blue-600';
    if (turnout >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const SortIcon = ({ column }: { column: string }) => (
    <span className="ml-1 text-gray-400">
      {sortBy === column ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">รายชื่อเขตเลือกตั้ง (District List)</h3>
          <p className="text-sm text-gray-500 mt-1">ทั้งหมด {districts.length} เขต | แสดง {filteredDistricts.length} รายการ</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ค้นหาเขต หรือ จังหวัด..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-grow max-h-[600px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm sticky top-0 z-10">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                เขต (District)<SortIcon column="name" />
              </th>
              <th className="px-4 py-3">จังหวัด</th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('voters')}
              >
                ผู้มีสิทธิ<SortIcon column="voters" />
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('actual')}
              >
                มาใช้สิทธิ<SortIcon column="actual" />
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('turnout')}
              >
                ร้อยละ<SortIcon column="turnout" />
              </th>
              <th className="px-4 py-3 text-center">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedDistricts.length > 0 ? (
              sortedDistricts.map((district, idx) => {
                const turnout = district.actualVoters && district.voterCount
                  ? (district.actualVoters / district.voterCount) * 100
                  : 0;
                const hasDetails = district.zoneDescription || district.amphoeList ||
                  district.invalidVotes !== undefined || district.noVotes !== undefined;

                return (
                  <React.Fragment key={`${district.name}-${idx}`}>
                    <tr className="hover:bg-blue-50 transition-colors text-sm text-gray-700">
                      <td className="px-4 py-3 font-medium">{district.name}</td>
                      <td className="px-4 py-3 text-gray-500">{district.province}</td>
                      <td className="px-4 py-3 text-right font-mono">{district.voterCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {district.actualVoters ? district.actualVoters.toLocaleString() : '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${getTurnoutColor(turnout)}`}>
                        {turnout > 0 ? `${turnout.toFixed(2)}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {hasDetails && (
                          <button
                            type="button"
                            onClick={() => toggleRow(district.name)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mx-auto"
                          >
                            {expandedRows.has(district.name) ? (
                              <><ChevronUp className="w-4 h-4" /> ซ่อน</>
                            ) : (
                              <><ChevronDown className="w-4 h-4" /> ดูเพิ่ม</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedRows.has(district.name) && hasDetails && (
                      <tr className="bg-gray-50 text-sm">
                        <td colSpan={6} className="px-6 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              {district.zoneDescription && (
                                <p className="text-gray-600 mb-2">
                                  <span className="font-medium">ครอบคลุม:</span> {district.zoneDescription}
                                </p>
                              )}
                              {district.amphoeList && district.amphoeList.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  <span className="font-medium text-gray-600">อำเภอ:</span>
                                  {district.amphoeList.map((amphoe) => (
                                    <span key={`${district.name}-${amphoe}`} className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                                      {amphoe}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              {district.invalidVotes !== undefined && (
                                <p className="text-gray-600">
                                  <span className="font-medium">บัตรเสีย:</span>{' '}
                                  <span className="text-red-600">{district.invalidVotes.toLocaleString()} บัตร</span>
                                  {district.actualVoters && (
                                    <span className="text-gray-400 text-xs ml-1">
                                      ({((district.invalidVotes / district.actualVoters) * 100).toFixed(2)}%)
                                    </span>
                                  )}
                                </p>
                              )}
                              {district.noVotes !== undefined && (
                                <p className="text-gray-600">
                                  <span className="font-medium">ไม่ลงคะแนน:</span>{' '}
                                  <span className="text-orange-600">{district.noVotes.toLocaleString()} บัตร</span>
                                  {district.actualVoters && (
                                    <span className="text-gray-400 text-xs ml-1">
                                      ({((district.noVotes / district.actualVoters) * 100).toFixed(2)}%)
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  ไม่พบข้อมูลที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
