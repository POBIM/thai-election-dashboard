'use client';

import React, { useState } from 'react';
import { X, Calculator, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { 
  getMajorParties, 
  CONSTITUENCY_SEATS, 
  PARTY_LIST_SEATS,
  formatPartyName
} from '@/lib/partyData';

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  constituencySeats: Record<string, number>;
  partyListSeats: Record<string, number>;
  onConstituencyChange: (partyId: string, seats: number) => void;
  onPartyListChange: (partyId: string, seats: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export const SimulationDialog: React.FC<SimulationDialogProps> = ({
  isOpen,
  onClose,
  constituencySeats,
  partyListSeats,
  onConstituencyChange,
  onPartyListChange,
  onApply,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'constituency' | 'partylist'>('constituency');
  
  const parties = getMajorParties();
  
  const totalConstituency = Object.values(constituencySeats).reduce((a, b) => a + b, 0);
  const totalPartyList = Object.values(partyListSeats).reduce((a, b) => a + b, 0);
  
  const isConstituencyValid = totalConstituency === CONSTITUENCY_SEATS;
  const isPartyListValid = totalPartyList === PARTY_LIST_SEATS;
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderPartyRow = (party: ReturnType<typeof getMajorParties>[0], type: 'constituency' | 'partylist') => {
    const isConstituency = type === 'constituency';
    const currentVal = isConstituency 
      ? (constituencySeats[party.id] || 0) 
      : (partyListSeats[party.id] || 0);
    
    const maxVal = isConstituency ? 150 : 50;
    const handleChange = isConstituency ? onConstituencyChange : onPartyListChange;

    return (
      <div key={party.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-3 w-40 flex-shrink-0">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0" 
            style={{ backgroundColor: party.color }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 truncate">
              {party.nameTh}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {party.nameEn}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={maxVal}
            value={currentVal}
            onChange={(e) => handleChange(party.id, parseInt(e.target.value) || 0)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{ accentColor: party.color }}
          />
        </div>

        <div className="w-20 flex-shrink-0">
          <input
            type="number"
            min="0"
            max={maxVal}
            value={currentVal}
            onChange={(e) => {
              const val = Math.min(maxVal, Math.max(0, parseInt(e.target.value) || 0));
              handleChange(party.id, val);
            }}
            className="w-full px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">จำลองผลการเลือกตั้ง</h2>
              <p className="text-xs text-gray-500">ปรับเปลี่ยนจำนวนที่นั่งเพื่อดูผลลัพธ์</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('constituency')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'constituency'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            สส. เขต ({CONSTITUENCY_SEATS})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('partylist')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'partylist'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            บัญชีรายชื่อ ({PARTY_LIST_SEATS})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'constituency' ? (
            <div className="space-y-1">
              {parties.map(party => renderPartyRow(party, 'constituency'))}
            </div>
          ) : (
            <div className="space-y-1">
              {parties.map(party => renderPartyRow(party, 'partylist'))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between text-sm px-2">
            <span className="text-gray-600">รวมที่นั่ง (ปัจจุบัน):</span>
            <div className="flex gap-4">
              <div className={`flex items-center gap-1.5 ${isConstituencyValid ? 'text-green-600' : 'text-red-600'}`}>
                {isConstituencyValid ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>
                  เขต: <span className="font-bold">{totalConstituency}</span>/{CONSTITUENCY_SEATS}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 ${isPartyListValid ? 'text-green-600' : 'text-red-600'}`}>
                {isPartyListValid ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>
                  ปาร์ตี้ลิสต์: <span className="font-bold">{totalPartyList}</span>/{PARTY_LIST_SEATS}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              <RotateCcw size={16} />
              รีเซ็ตค่าปี 66
            </button>
            <button
              type="button"
              onClick={onApply}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calculator size={16} />
              ใช้งาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
