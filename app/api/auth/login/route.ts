import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get credentials from server-side environment variables
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ADMIN_USER || !ADMIN_PASS) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Create a simple session token (in production, use a proper JWT library)
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      // Set HTTP-only cookie (secure in production with HTTPS)
      const cookieStore = await cookies();
      cookieStore.set('auth-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json(
        {
          success: true,
          user: {
            id: '1',
            username: username,
            name: username,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error processing login', error: error.message },
      { status: 500 }
    );
  }
}

