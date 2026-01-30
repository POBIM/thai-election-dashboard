import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ComposedChart, Line
} from 'recharts';
import { RegionData, DistrictData } from '../types';

interface RegionChartProps {
  data: RegionData[];
}

const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#818CF8', '#82ca9d'];
const REGION_NAMES_TH: Record<string, string> = {
  'Bangkok': 'กรุงเทพฯ',
  'Central': 'ภาคกลาง',
  'North': 'ภาคเหนือ',
  'Northeast': 'ภาคอีสาน',
  'South': 'ภาคใต้'
};

export const VotersByRegionPie: React.FC<RegionChartProps> = ({ data }) => {
  const [showActual, setShowActual] = useState(false);

  const chartData = useMemo(() => {
    return data.map(region => {
      const totalActual = region.districts.reduce((sum, d) => sum + (d.actualVoters || 0), 0);
      const turnout = region.totalVoters > 0 ? (totalActual / region.totalVoters) * 100 : 0;
      return {
        ...region,
        regionNameTh: REGION_NAMES_TH[region.regionName] || region.regionName,
        totalActualVoters: totalActual,
        turnoutPercentage: turnout
      };
    });
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {showActual ? 'ผู้มาใช้สิทธิตามภูมิภาค' : 'ผู้มีสิทธิเลือกตั้งตามภูมิภาค'}
        </h3>
        <button
          type="button"
          onClick={() => setShowActual(!showActual)}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            showActual
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {showActual ? 'แสดงผู้มีสิทธิ' : 'แสดงผู้มาใช้สิทธิ'}
        </button>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey={showActual ? "totalActualVoters" : "totalVoters"}
              nameKey="regionNameTh"
              label={({ regionNameTh, percent }) => `${regionNameTh} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.regionName}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} คน`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TurnoutByRegionChart: React.FC<RegionChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map((region, index) => {
      const totalActual = region.districts.reduce((sum, d) => sum + (d.actualVoters || 0), 0);
      const turnout = region.totalVoters > 0 ? (totalActual / region.totalVoters) * 100 : 0;
      return {
        name: REGION_NAMES_TH[region.regionName] || region.regionName,
        eligible: region.totalVoters,
        actual: totalActual,
        turnout: turnout,
        fill: COLORS[index % COLORS.length]
      };
    }).sort((a, b) => b.turnout - a.turnout);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        อัตราการมาใช้สิทธิตามภูมิภาค (Turnout by Region)
      </h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'turnout') return [`${value.toFixed(2)}%`, 'อัตราการมาใช้สิทธิ'];
                return [value.toLocaleString(), name === 'eligible' ? 'ผู้มีสิทธิ' : 'มาใช้สิทธิ'];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="turnout" radius={[0, 4, 4, 0]} barSize={25}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.turnout >= 75 ? '#10B981' : entry.turnout >= 70 ? '#F59E0B' : '#EF4444'}
                />
              ))}
            </Bar>
            <Line type="monotone" dataKey="turnout" stroke="#3B82F6" strokeWidth={0} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span> 75%+ (สูง)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500"></span> 70-74%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> ต่ำกว่า 70%</span>
      </div>
    </div>
  );
};

interface DistrictRankChartProps {
  data: DistrictData[];
}

export const TopDistrictsBar: React.FC<DistrictRankChartProps> = ({ data }) => {
  const [sortByTurnout, setSortByTurnout] = useState(false);

  const chartData = useMemo(() => {
    const withTurnout = data.map(d => ({
      ...d,
      turnout: d.actualVoters && d.voterCount ? (d.actualVoters / d.voterCount) * 100 : 0
    }));

    if (sortByTurnout) {
      return [...withTurnout].sort((a, b) => b.turnout - a.turnout).slice(0, 10);
    }
    return [...withTurnout].sort((a, b) => b.voterCount - a.voterCount).slice(0, 10);
  }, [data, sortByTurnout]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {sortByTurnout ? 'เขตที่มี % มาใช้สิทธิสูงสุด' : 'เขตที่มีผู้มีสิทธิสูงสุด'}
        </h3>
        <button
          type="button"
          onClick={() => setSortByTurnout(!sortByTurnout)}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            sortByTurnout
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {sortByTurnout ? 'จัดตามผู้มีสิทธิ' : 'จัดตาม % มาใช้สิทธิ'}
        </button>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              hide={!sortByTurnout}
              domain={sortByTurnout ? [0, 100] : [0, 'auto']}
              tickFormatter={sortByTurnout ? (v) => `${v}%` : undefined}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'turnout') return [`${value.toFixed(2)}%`, 'อัตราการมาใช้สิทธิ'];
                if (name === 'voterCount') return [`${value.toLocaleString()} คน`, 'ผู้มีสิทธิ'];
                if (name === 'actualVoters') return [`${value.toLocaleString()} คน`, 'มาใช้สิทธิ'];
                return [value, name];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            {sortByTurnout ? (
              <Bar dataKey="turnout" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.turnout >= 80 ? '#059669' : entry.turnout >= 75 ? '#3B82F6' : entry.turnout >= 70 ? '#F59E0B' : '#EF4444'}
                  />
                ))}
              </Bar>
            ) : (
              <Bar dataKey="voterCount" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DistrictTurnoutDistribution: React.FC<DistrictRankChartProps> = ({ data }) => {
  const distributionData = useMemo(() => {
    const ranges = [
      { label: '80%+', min: 80, max: 100, color: '#059669' },
      { label: '75-79%', min: 75, max: 80, color: '#3B82F6' },
      { label: '70-74%', min: 70, max: 75, color: '#F59E0B' },
      { label: 'ต่ำกว่า 70%', min: 0, max: 70, color: '#EF4444' }
    ];

    return ranges.map(range => {
      const count = data.filter(d => {
        const turnout = d.actualVoters && d.voterCount ? (d.actualVoters / d.voterCount) * 100 : 0;
        return turnout >= range.min && turnout < range.max;
      }).length;

      return {
        name: range.label,
        count,
        fill: range.color,
        percentage: data.length > 0 ? (count / data.length) * 100 : 0
      };
    });
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        การกระจายตัวของอัตราการมาใช้สิทธิ
      </h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distributionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'count') return [`${value} เขต`, 'จำนวนเขต'];
                return [value, name];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">
        ทั้งหมด {data.length} เขต
      </div>
    </div>
  );
};
