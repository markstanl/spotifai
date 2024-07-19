import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('Request Body:', data);

        const { playlistImage, songs }: ServerPlaylist = data.playlist;

        if (!playlistImage || !Array.isArray(songs)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        return NextResponse.json({ title: 'Dummy Playlist Title' });

    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
