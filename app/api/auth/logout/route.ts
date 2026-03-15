import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error processing logout', error: error.message },
      { status: 500 }
    );
  }
}

