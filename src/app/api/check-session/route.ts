import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || '');
    res.json({ access_token: cookies.access_token, refresh_token: cookies.refresh_token });
}
