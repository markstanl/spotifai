import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cookie from 'cookie';

const baseUrl = 'https://api.spotify.com';

export async function GET(req: NextRequest) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const access_token = cookies.access_token;
    const query = req.nextUrl.searchParams.get('q'); // Use req.nextUrl.searchParams to access query parameters

    if (!access_token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (query) {
        try {
            const searchOptions = {
                method: 'get',
                url: `${baseUrl}/v1/search?q=${encodeURIComponent(query)}&type=track`,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };

            const response = await axios(searchOptions);
            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error searching tracks', error);
            return NextResponse.json({ error: 'Error searching tracks' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
}
