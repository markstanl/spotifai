import { NextRequest, NextResponse } from 'next/server';
import { URLSearchParams } from 'url';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = 'http://localhost:3000/api/callback';

export async function GET(req: NextRequest) {
    console.log('API route hit'); // Log to indicate the API route was accessed
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private ugc-image-upload';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: 'some-state'
    });

    console.log('Redirecting to Spotify authorization');
    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
