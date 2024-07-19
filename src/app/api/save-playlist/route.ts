import {NextApiResponse} from 'next';
import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';
import cookie from 'cookie';

const baseUrl = 'https://api.spotify.com';

const getUserId = async (access_token: string): Promise<string> => {
    try {
        const userOptions = {
            method: 'get',
            url: `${baseUrl}/v1/me`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        const response = await axios(userOptions);
        return response.data.id;
    } catch (error) {
        console.error('Error getting user ID', error);
        throw new Error('Error getting user ID');
    }
};

export async function POST(req: NextRequest, res: NextApiResponse) {
    if (req.method && req.body) {
        const requestBody = await req.json();
        const playlist: SavePlaylist = requestBody.playlist
        const {playlistImage, songs, playlistTitle} = playlist;

        const cookies = cookie.parse(req.headers.get('cookie') || '');
        const access_token = cookies.access_token;

        if (!access_token) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const userId: string = await getUserId(access_token);
        const songUris = songs.map(song => song.uri);

        const createPlaylistOptions = {
            method: 'post',
            url: `${baseUrl}/v1/users/${userId}/playlists`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: playlistTitle,
                description: 'Playlist generated with Jamming',
                public: false
            }
        };

        const createResponse = await axios(createPlaylistOptions);
        const playlistId = createResponse.data.id;

        // Add songs to the playlist
        const addSongsOptions = {
            method: 'post',
            url: `${baseUrl}/v1/playlists/${playlistId}/tracks`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                uris: songUris,
                position: 0
            }
        };

        console.log('Got to line 73')

        await axios(addSongsOptions);

        console.log('77')

        // Set the playlist image

        const base64Image = playlistImage.replace(/^data:image\/jpeg;base64,/, '');

        const setImageOptions = {
            method: 'put',
            url: `${baseUrl}/v1/playlists/${playlistId}/images`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'image/jpeg'
            },
            data: base64Image
        };

        console.log('89')

        try {
            await axios(setImageOptions);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error uploading playlist image:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            return NextResponse.json({ error: 'Error uploading playlist image'}, { status: 500 });
        }

        console.log('94')

        return NextResponse.json({message: 'Playlist saved'}, {status: 200});
    } else {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
}
