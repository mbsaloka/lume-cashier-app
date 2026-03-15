import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // In a real application, you would verify the token here
    // For now, if the token exists, we consider the user authenticated
    // You could decode the token to get the username
    try {
      const decoded = Buffer.from(token.value, 'base64').toString('utf-8');
      const [username] = decoded.split(':');

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: '1',
            username: username,
            name: username,
          },
        },
        { status: 200 }
      );
    } catch {
      // Invalid token format
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}

