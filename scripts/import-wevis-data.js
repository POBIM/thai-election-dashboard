const fs = require('fs');
const path = require('path');

const provinceZonesPath = path.join(__dirname, '../data/province_zones.json');
const provinceZones = JSON.parse(fs.readFileSync(provinceZonesPath, 'utf-8'));

const PROVINCE_REGION_MAP = {
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
  "กรุงเทพมหานคร": "Bangkok",
  "ชัยนาท": "Central", "นครนายก": "Central", "นครปฐม": "Central",
  "นนทบุรี": "Central", "ปทุมธานี": "Central", "พระนครศรีอยุธยา": "Central",
  "ลพบุรี": "Central", "สมุทรปราการ": "Central", "สมุทรสงคราม": "Central",
  "สมุทรสาคร": "Central", "สิงห์บุรี": "Central", "สุพรรณบุรี": "Central",
  "สระบุรี": "Central", "อ่างทอง": "Central", "จันทบุรี": "Central",
  "ฉะเชิงเทรา": "Central", "ชลบุรี": "Central", "ตราด": "Central",
  "ปราจีนบุรี": "Central", "ระยอง": "Central", "สระแก้ว": "Central",
  "กาญจนบุรี": "Central", "ประจวบคีรีขันธ์": "Central", "เพชรบุรี": "Central",
  "ราชบุรี": "Central",
  "กระบี่": "South", "ชุมพร": "South", "ตรัง": "South", "นครศรีธรรมราช": "South",
  "นราธิวาส": "South", "ปัตตานี": "South", "พังงา": "South", "พัทลุง": "South",
  "ภูเก็ต": "South", "ยะลา": "South", "ระนอง": "South", "สงขลา": "South",
  "สตูล": "South", "สุราษฎร์ธานี": "South"
};

const regions = {
  "Bangkok": { regionName: "Bangkok", totalVoters: 0, districts: [] },
  "Central": { regionName: "Central", totalVoters: 0, districts: [] },
  "North": { regionName: "North", totalVoters: 0, districts: [] },
  "Northeast": { regionName: "Northeast", totalVoters: 0, districts: [] },
  "South": { regionName: "South", totalVoters: 0, districts: [] }
};

provinceZones.data_list.forEach(province => {
  const provinceName = province.province_name;
  const region = PROVINCE_REGION_MAP[provinceName];
  
  if (!region) {
    console.log(`Warning: No region mapping for ${provinceName}`);
    return;
  }
  
  province.zone_list.forEach((zone, index) => {
    const zoneNumber = index + 1;
    const zoneName = `${provinceName} เขต ${zoneNumber}`;
    
    const amphoeList = zone.split('$').map(part => {
      return part.replace(/^\d+\.\s*/, '').replace(/^เขต/, '').trim();
    }).filter(Boolean);
    
    const estimatedVoters = 120000 + Math.floor(Math.random() * 50000);
    
    regions[region].districts.push({
      name: zoneName,
      province: provinceName,
      voterCount: estimatedVoters,
      zoneDescription: zone.replace(/\$/g, ', '),
      amphoeList: amphoeList
    });
    
    regions[region].totalVoters += estimatedVoters;
  });
});

const electionData = {
  totalEligibleVoters: Object.values(regions).reduce((sum, r) => sum + r.totalVoters, 0),
  lastUpdated: new Date().toISOString(),
  regions: Object.values(regions)
};

const outputPath = path.join(__dirname, '../data/election-data-from-wevis.json');
fs.writeFileSync(outputPath, JSON.stringify(electionData, null, 2), 'utf-8');

console.log('Data transformation complete!');
console.log(`Total electoral zones: ${electionData.regions.reduce((sum, r) => sum + r.districts.length, 0)}`);
console.log(`Total provinces: ${provinceZones.data_list.length}`);
console.log('\nBreakdown by region:');
electionData.regions.forEach(region => {
  console.log(`  ${region.regionName}: ${region.districts.length} zones, ${region.totalVoters.toLocaleString()} voters`);
});
console.log(`\nOutput file: ${outputPath}`);
