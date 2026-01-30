import React, { useState } from 'react';
import { DistrictData } from '../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface DistrictTableProps {
  districts: DistrictData[];
}

export const DistrictTable: React.FC<DistrictTableProps> = ({ districts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.zoneDescription && d.zoneDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRow = (districtName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(districtName)) {
      newExpanded.delete(districtName);
    } else {
      newExpanded.add(districtName);
    }
    setExpandedRows(newExpanded);
  };

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
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm sticky top-0">
            <tr>
              <th className="px-6 py-3">เขต (District)</th>
              <th className="px-6 py-3">จังหวัด (Province)</th>
              <th className="px-6 py-3 text-right">จำนวนผู้มีสิทธิ (Voters)</th>
              <th className="px-6 py-3">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map((district, idx) => (
                <React.Fragment key={`${district.name}-${idx}`}>
                  <tr className="hover:bg-blue-50 transition-colors text-sm text-gray-700">
                    <td className="px-6 py-3 font-medium">{district.name}</td>
                    <td className="px-6 py-3 text-gray-500">{district.province}</td>
                    <td className="px-6 py-3 text-right font-mono">{district.voterCount.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      {(district.zoneDescription || district.amphoeList) && (
                        <button
                          type="button"
                          onClick={() => toggleRow(district.name)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
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
                  {expandedRows.has(district.name) && (district.zoneDescription || district.amphoeList) && (
                    <tr className="bg-gray-50 text-sm">
                      <td colSpan={4} className="px-6 py-3">
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
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
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
