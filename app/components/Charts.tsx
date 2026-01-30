import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { RegionData, DistrictData } from '../types';

interface RegionChartProps {
  data: RegionData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const VotersByRegionPie: React.FC<RegionChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนผู้มีสิทธิเลือกตั้งตามภูมิภาค (Voters by Region)</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="totalVoters"
              nameKey="regionName"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.regionName}`} fill={COLORS[data.indexOf(entry) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface DistrictRankChartProps {
  data: DistrictData[];
}

export const TopDistrictsBar: React.FC<DistrictRankChartProps> = ({ data }) => {
  // Sort and take top 10
  const sortedData = [...data].sort((a, b) => b.voterCount - a.voterCount).slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">10 เขตที่มีผู้มีสิทธิเลือกตั้งสูงสุด (Top 10 Districts)</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{fontSize: 12}}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} คน`, 'จำนวนผู้มีสิทธิ']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="voterCount" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
