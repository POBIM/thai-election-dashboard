import { promises as fs } from 'fs';
import path from 'path';
import { ElectionData, RegionData, DistrictData } from '@/app/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'election-data.json');

const defaultData: ElectionData = {
  totalEligibleVoters: 52234567,
  lastUpdated: new Date().toISOString(),
  regions: [
    {
      regionName: 'Bangkok',
      totalVoters: 4320000,
      districts: [
        { name: 'เขต 1 (บางรัก, สาทร)', voterCount: 145000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 2 (คลองเตย, วัฒนา)', voterCount: 138000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 3 (ห้วยขวาง, ดินแดง)', voterCount: 152000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 4 (ลาดพร้าว, บางกะปิ)', voterCount: 165000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 5 (หลักสี่, จตุจักร)', voterCount: 178000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 6 (บางเขน, สายไหม)', voterCount: 192000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 7 (หนองจอก, มีนบุรี)', voterCount: 185000, province: 'กรุงเทพมหานคร' },
        { name: 'เขต 8 (ลาดกระบัง, ประเวศ)', voterCount: 175000, province: 'กรุงเทพมหานคร' },
      ]
    },
    {
      regionName: 'Central',
      totalVoters: 12500000,
      districts: [
        { name: 'อ.เมืองนนทบุรี', voterCount: 142000, province: 'นนทบุรี' },
        { name: 'อ.เมืองปทุมธานี', voterCount: 138000, province: 'ปทุมธานี' },
        { name: 'อ.เมืองพระนครศรีอยุธยา', voterCount: 125000, province: 'พระนครศรีอยุธยา' },
        { name: 'อ.เมืองสมุทรปราการ', voterCount: 165000, province: 'สมุทรปราการ' },
        { name: 'อ.บางละมุง', voterCount: 145000, province: 'ชลบุรี' },
        { name: 'อ.เมืองระยอง', voterCount: 132000, province: 'ระยอง' },
        { name: 'อ.เมืองนครปฐม', voterCount: 118000, province: 'นครปฐม' },
        { name: 'อ.เมืองราชบุรี', voterCount: 108000, province: 'ราชบุรี' },
      ]
    },
    {
      regionName: 'North',
      totalVoters: 9850000,
      districts: [
        { name: 'อ.เมืองเชียงใหม่', voterCount: 155000, province: 'เชียงใหม่' },
        { name: 'อ.หางดง', voterCount: 125000, province: 'เชียงใหม่' },
        { name: 'อ.เมืองเชียงราย', voterCount: 118000, province: 'เชียงราย' },
        { name: 'อ.เมืองลำปาง', voterCount: 108000, province: 'ลำปาง' },
        { name: 'อ.เมืองพิษณุโลก', voterCount: 132000, province: 'พิษณุโลก' },
        { name: 'อ.เมืองน่าน', voterCount: 95000, province: 'น่าน' },
        { name: 'อ.เมืองแพร่', voterCount: 88000, province: 'แพร่' },
        { name: 'อ.เมืองอุตรดิตถ์', voterCount: 82000, province: 'อุตรดิตถ์' },
      ]
    },
    {
      regionName: 'Northeast',
      totalVoters: 18500000,
      districts: [
        { name: 'อ.เมืองขอนแก่น', voterCount: 168000, province: 'ขอนแก่น' },
        { name: 'อ.เมืองนครราชสีมา', voterCount: 175000, province: 'นครราชสีมา' },
        { name: 'อ.เมืองอุดรธานี', voterCount: 142000, province: 'อุดรธานี' },
        { name: 'อ.เมืองอุบลราชธานี', voterCount: 138000, province: 'อุบลราชธานี' },
        { name: 'อ.เมืองร้อยเอ็ด', voterCount: 125000, province: 'ร้อยเอ็ด' },
        { name: 'อ.เมืองสกลนคร', voterCount: 115000, province: 'สกลนคร' },
        { name: 'อ.เมืองศรีสะเกษ', voterCount: 128000, province: 'ศรีสะเกษ' },
        { name: 'อ.เมืองบุรีรัมย์', voterCount: 132000, province: 'บุรีรัมย์' },
      ]
    },
    {
      regionName: 'South',
      totalVoters: 7084567,
      districts: [
        { name: 'อ.หาดใหญ่', voterCount: 165000, province: 'สงขลา' },
        { name: 'อ.เมืองสงขลา', voterCount: 125000, province: 'สงขลา' },
        { name: 'อ.เมืองภูเก็ต', voterCount: 142000, province: 'ภูเก็ต' },
        { name: 'อ.เมืองนครศรีธรรมราช', voterCount: 158000, province: 'นครศรีธรรมราช' },
        { name: 'อ.เมืองกระบี่', voterCount: 108000, province: 'กระบี่' },
        { name: 'อ.เมืองสุราษฎร์ธานี', voterCount: 135000, province: 'สุราษฎร์ธานี' },
        { name: 'อ.เมืองตรัง', voterCount: 98000, province: 'ตรัง' },
        { name: 'อ.เมืองปัตตานี', voterCount: 92000, province: 'ปัตตานี' },
      ]
    }
  ]
};

export async function getElectionData(): Promise<ElectionData> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}

export async function saveElectionData(data: ElectionData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  data.lastUpdated = new Date().toISOString();
  data.totalEligibleVoters = data.regions.reduce(
    (total, region) => total + region.districts.reduce((sum, d) => sum + d.voterCount, 0),
    0
  );
  data.totalActualVoters = data.regions.reduce(
    (total, region) => total + region.districts.reduce((sum, d) => sum + (d.actualVoters || 0), 0),
    0
  );
  data.regions.forEach(region => {
    region.totalVoters = region.districts.reduce((sum, d) => sum + d.voterCount, 0);
  });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function updateDistrict(
  regionName: string,
  districtName: string,
  updates: Partial<DistrictData>
): Promise<ElectionData> {
  const data = await getElectionData();
  const region = data.regions.find(r => r.regionName === regionName);
  if (!region) throw new Error('Region not found');
  
  const district = region.districts.find(d => d.name === districtName);
  if (!district) throw new Error('District not found');
  
  Object.assign(district, updates);
  await saveElectionData(data);
  return data;
}

export async function addDistrict(
  regionName: string,
  district: DistrictData
): Promise<ElectionData> {
  const data = await getElectionData();
  const region = data.regions.find(r => r.regionName === regionName);
  if (!region) throw new Error('Region not found');
  
  region.districts.push(district);
  await saveElectionData(data);
  return data;
}

export async function deleteDistrict(
  regionName: string,
  districtName: string
): Promise<ElectionData> {
  const data = await getElectionData();
  const region = data.regions.find(r => r.regionName === regionName);
  if (!region) throw new Error('Region not found');
  
  region.districts = region.districts.filter(d => d.name !== districtName);
  await saveElectionData(data);
  return data;
}
