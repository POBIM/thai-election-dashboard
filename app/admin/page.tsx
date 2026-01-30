'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ElectionData, DistrictData, RegionFilter } from '../types';
import { Plus, Pencil, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditingDistrict {
  regionName: string;
  originalName?: string;
  district: DistrictData;
  isNew: boolean;
}

export default function AdminPage() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(RegionFilter.ALL);
  const [editingDistrict, setEditingDistrict] = useState<EditingDistrict | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/election-data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDistrict = (regionName: string) => {
    setEditingDistrict({
      regionName,
      district: { name: '', voterCount: 0, province: '' },
      isNew: true
    });
  };

  const handleEditDistrict = (regionName: string, district: DistrictData) => {
    setEditingDistrict({
      regionName,
      originalName: district.name,
      district: { ...district },
      isNew: false
    });
  };

  const handleDeleteDistrict = async (regionName: string, districtName: string) => {
    if (!confirm(`คุณต้องการลบ "${districtName}" ใช่หรือไม่?`)) return;

    try {
      const response = await fetch('/api/election-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          regionName,
          districtName
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
        showMessage('success', 'ลบข้อมูลสำเร็จ');
      } else {
        showMessage('error', 'ไม่สามารถลบข้อมูลได้');
      }
    } catch (error) {
      console.error('Error deleting district:', error);
      showMessage('error', 'เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleSaveDistrict = async () => {
    if (!editingDistrict) return;

    const { regionName, originalName, district, isNew } = editingDistrict;

    if (!district.name || !district.province || district.voterCount < 0) {
      showMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const response = await fetch('/api/election-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isNew ? 'add' : 'update',
          regionName,
          districtName: originalName,
          district: isNew ? district : undefined,
          updates: isNew ? undefined : district
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
        setEditingDistrict(null);
        showMessage('success', isNew ? 'เพิ่มข้อมูลสำเร็จ' : 'อัปเดตข้อมูลสำเร็จ');
      } else {
        showMessage('error', 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.error('Error saving district:', error);
      showMessage('error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const filteredRegions = selectedRegion === RegionFilter.ALL
    ? data?.regions || []
    : data?.regions.filter(r => r.regionName === selectedRegion) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>กลับไปหน้าหลัก</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">จัดการข้อมูลผู้มีสิทธิเลือกตั้ง</h1>
            </div>
            <div className="text-sm text-gray-500">
              อัปเดตล่าสุด: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString('th-TH') : '-'}
            </div>
          </div>
        </div>
      </nav>

      {message && (
        <div className={`fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">เลือกภูมิภาค:</label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={RegionFilter.ALL}>ทั้งหมด</option>
            {data?.regions.map(region => (
              <option key={region.regionName} value={region.regionName}>
                {region.regionName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filteredRegions.map(region => (
            <div key={region.regionName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{region.regionName}</h2>
                    <p className="text-sm text-gray-500">
                      จำนวนผู้มีสิทธิ: {region.totalVoters.toLocaleString()} คน | 
                      {region.districts.length} เขต/อำเภอ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddDistrict(region.regionName)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มเขต/อำเภอ
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {region.districts.map(district => (
                  <div key={district.name} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{district.name}</h3>
                      <p className="text-sm text-gray-500">
                        จังหวัด: {district.province} | 
                        ผู้มีสิทธิ: {district.voterCount.toLocaleString()} คน
                        {district.zoneDescription && (
                          <span className="block text-xs text-gray-400 mt-1">{district.zoneDescription}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditDistrict(region.regionName, district)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDistrict(region.regionName, district.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {editingDistrict && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDistrict.isNew ? 'เพิ่มเขต/อำเภอใหม่' : 'แก้ไขข้อมูล'}
                </h3>
                <p className="text-sm text-gray-500">ภูมิภาค: {editingDistrict.regionName}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="district-name" className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อเขต/อำเภอ <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="district-name"
                    type="text"
                    value={editingDistrict.district.name}
                    onChange={(e) => setEditingDistrict({
                      ...editingDistrict,
                      district: { ...editingDistrict.district, name: e.target.value }
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เช่น เขต 1, อ.เมืองเชียงใหม่"
                  />
                </div>

                <div>
                  <label htmlFor="district-province" className="block text-sm font-medium text-gray-700 mb-1">
                    จังหวัด <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="district-province"
                    type="text"
                    value={editingDistrict.district.province}
                    onChange={(e) => setEditingDistrict({
                      ...editingDistrict,
                      district: { ...editingDistrict.district, province: e.target.value }
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่"
                  />
                </div>

                <div>
                  <label htmlFor="district-voters" className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนผู้มีสิทธิเลือกตั้ง <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="district-voters"
                    type="number"
                    min="0"
                    value={editingDistrict.district.voterCount}
                    onChange={(e) => setEditingDistrict({
                      ...editingDistrict,
                      district: { ...editingDistrict.district, voterCount: parseInt(e.target.value) || 0 }
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDistrict(null)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveDistrict}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">สรุปข้อมูลทั้งหมด</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700">จำนวนภูมิภาค:</span>
              <span className="ml-2 font-semibold text-blue-900">{data?.regions.length || 0}</span>
            </div>
            <div>
              <span className="text-blue-700">จำนวนเขต/อำเภอทั้งหมด:</span>
              <span className="ml-2 font-semibold text-blue-900">
                {data?.regions.reduce((sum, r) => sum + r.districts.length, 0) || 0}
              </span>
            </div>
            <div>
              <span className="text-blue-700">ผู้มีสิทธิเลือกตั้งรวม:</span>
              <span className="ml-2 font-semibold text-blue-900">
                {data?.totalEligibleVoters.toLocaleString() || 0} คน
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
