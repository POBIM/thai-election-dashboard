import { NextRequest, NextResponse } from 'next/server';
import { ElectionData } from '@/app/types';
import { getElectionData, saveElectionData, updateDistrict, addDistrict, deleteDistrict } from '@/lib/electionData';

export async function GET() {
  try {
    const data = await getElectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching election data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch election data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, regionName, district, districtName, updates } = body;

    let result: ElectionData;
    switch (action) {
      case 'update':
        if (!regionName || !districtName || !updates) {
          return NextResponse.json(
            { error: 'Missing required fields for update' },
            { status: 400 }
          );
        }
        result = await updateDistrict(regionName, districtName, updates);
        break;

      case 'add':
        if (!regionName || !district) {
          return NextResponse.json(
            { error: 'Missing required fields for add' },
            { status: 400 }
          );
        }
        result = await addDistrict(regionName, district);
        break;

      case 'delete':
        if (!regionName || !districtName) {
          return NextResponse.json(
            { error: 'Missing required fields for delete' },
            { status: 400 }
          );
        }
        result = await deleteDistrict(regionName, districtName);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating election data:', error);
    return NextResponse.json(
      { error: 'Failed to update election data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    await saveElectionData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving election data:', error);
    return NextResponse.json(
      { error: 'Failed to save election data' },
      { status: 500 }
    );
  }
}
