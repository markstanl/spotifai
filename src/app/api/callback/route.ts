import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cookie from 'cookie';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = 'http://localhost:3000/api/callback';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
        return NextResponse.json({ error: 'Invalid callback parameters' }, { status: 400 });
    }

    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }).toString(),
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await axios(authOptions);
        const { access_token, refresh_token } = response.data;

        // Debugging: Log the tokens
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        if (!access_token || !refresh_token) {
            console.error('Access token or refresh token is missing');
            return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
        }

        // Set tokens in cookies
        const cookies = [
            cookie.serialize('access_token', access_token, { httpOnly: true, path: '/' }),
            cookie.serialize('refresh_token', refresh_token, { httpOnly: true, path: '/' })
        ];

        return NextResponse.redirect('http://localhost:3000/spotifai', {
            headers: {
                'Set-Cookie': cookies.join('; ')
            }
        });
    } catch (error) {
        console.error('Error getting access token', error);
        return NextResponse.json({ error: 'Error getting access token' }, { status: 500 });
    }

}
