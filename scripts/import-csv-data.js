const fs = require('fs');
const path = require('path');

const PROVINCE_REGION_MAP = {
  "กรุงเทพมหานคร": "Bangkok",
  "กระบี่": "South", "ชุมพร": "South", "ตรัง": "South", "นครศรีธรรมราช": "South",
  "นราธิวาส": "South", "ปัตตานี": "South", "พังงา": "South", "พัทลุง": "South",
  "ภูเก็ต": "South", "ยะลา": "South", "ระนอง": "South", "สงขลา": "South",
  "สตูล": "South", "สุราษฎร์ธานี": "South",
  "เชียงราย": "North", "เชียงใหม่": "North", "น่าน": "North", "พะเยา": "North",
  "แพร่": "North", "แม่ฮ่องสอน": "North", "ลำปาง": "North", "ลำพูน": "North",
  "อุตรดิตถ์": "North", "ตาก": "North", "สุโขทัย": "North", "พิษณุโลก": "North",
  "พิจิตร": "North", "เพชรบูรณ์": "North", "กำแพงเพชร": "North", "นครสวรรค์": "North",
  "อุทัยธานี": "North",
  "กาฬสินธุ์": "Northeast", "ขอนแก่น": "Northeast", "ชัยภูมิ": "Northeast", "นครพนม": "Northeast",
  "นครราชสีมา": "Northeast", "บึงกาฬ": "Northeast", "บุรีรัมย์": "Northeast", "มหาสารคาม": "Northeast",
  "มุกดาหาร": "Northeast", "ยโสธร": "Northeast", "ร้อยเอ็ด": "Northeast", "เลย": "Northeast",
  "สกลนคร": "Northeast", "สุรินทร์": "Northeast", "ศรีสะเกษ": "Northeast", "หนองคาย": "Northeast",
  "หนองบัวลำภู": "Northeast", "อุดรธานี": "Northeast", "อุบลราชธานี": "Northeast", "อำนาจเจริญ": "Northeast",
  "ชัยนาท": "Central", "นครนายก": "Central", "นครปฐม": "Central",
  "นนทบุรี": "Central", "ปทุมธานี": "Central", "พระนครศรีอยุธยา": "Central",
  "ลพบุรี": "Central", "สมุทรปราการ": "Central", "สมุทรสงคราม": "Central",
  "สมุทรสาคร": "Central", "สิงห์บุรี": "Central", "สุพรรณบุรี": "Central",
  "สระบุรี": "Central", "อ่างทอง": "Central", "จันทบุรี": "Central",
  "ฉะเชิงเทรา": "Central", "ชลบุรี": "Central", "ตราด": "Central",
  "ปราจีนบุรี": "Central", "ระยอง": "Central", "สระแก้ว": "Central",
  "กาญจนบุรี": "Central", "ประจวบคีรีขันธ์": "Central", "เพชรบุรี": "Central",
  "ราชบุรี": "Central"
};

const regions = {
  "Bangkok": { regionName: "Bangkok", totalVoters: 0, totalActualVoters: 0, districts: [] },
  "Central": { regionName: "Central", totalVoters: 0, totalActualVoters: 0, districts: [] },
  "North": { regionName: "North", totalVoters: 0, totalActualVoters: 0, districts: [] },
  "Northeast": { regionName: "Northeast", totalVoters: 0, totalActualVoters: 0, districts: [] },
  "South": { regionName: "South", totalVoters: 0, totalActualVoters: 0, districts: [] }
};

const csvPath = path.join(__dirname, '../dataA.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

const headers = lines[0].split(',');

for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  if (cols.length < 4) continue;
  
  const province = cols[0].trim();
  const districtNum = cols[1].trim();
  const eligibleVoters = parseInt(cols[2].trim()) || 0;
  const actualVoters = parseInt(cols[3].trim()) || 0;
  const invalidVotes = parseInt(cols[5].trim()) || 0;
  const noVotes = parseInt(cols[7].trim()) || 0;
  
  const region = PROVINCE_REGION_MAP[province];
  if (!region) {
    console.log(`Warning: No region mapping for ${province}`);
    continue;
  }
  
  const districtName = `${province} เขต ${districtNum}`;
  
  regions[region].districts.push({
    name: districtName,
    province: province,
    voterCount: eligibleVoters,
    actualVoters: actualVoters,
    invalidVotes: invalidVotes,
    noVotes: noVotes
  });
  
  regions[region].totalVoters += eligibleVoters;
  regions[region].totalActualVoters += actualVoters;
}

const electionData = {
  totalEligibleVoters: Object.values(regions).reduce((sum, r) => sum + r.totalVoters, 0),
  totalActualVoters: Object.values(regions).reduce((sum, r) => sum + r.totalActualVoters, 0),
  lastUpdated: new Date().toISOString(),
  regions: Object.values(regions)
};

const outputPath = path.join(__dirname, '../data/election-data.json');
fs.writeFileSync(outputPath, JSON.stringify(electionData, null, 2), 'utf-8');

console.log('Data import complete!');
console.log(`Total electoral zones: ${electionData.regions.reduce((sum, r) => sum + r.districts.length, 0)}`);
console.log(`Total eligible voters: ${electionData.totalEligibleVoters.toLocaleString()}`);
console.log(`Total actual voters: ${electionData.totalActualVoters.toLocaleString()}`);
console.log(`Turnout: ${((electionData.totalActualVoters / electionData.totalEligibleVoters) * 100).toFixed(2)}%`);
console.log('\nBreakdown by region:');
electionData.regions.forEach(region => {
  const turnout = ((region.totalActualVoters / region.totalVoters) * 100).toFixed(2);
  console.log(`  ${region.regionName}: ${region.districts.length} zones, ${region.totalVoters.toLocaleString()} eligible, ${region.totalActualVoters.toLocaleString()} voted (${turnout}%)`);
});
