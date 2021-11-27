import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'

import { parseCookies } from 'nookies'
import { firebaseAdmin } from '../../lib/firebaseAdmin'

export default async function meApi(req: Req, res: Res) {
  // Cookieに保存されているセッションIDを取得する
  const sessionId = parseCookies({ req }).session

  if (req.method !== 'GET') return res.status(404).send('Not Found')
  if (!sessionId) return res.json({})

  const auth = firebaseAdmin.auth()

  // セッションIDから認証情報を取得する
  const user = await auth.verifySessionCookie(sessionId, true).catch(() => null)

  res.json(user ? { user: { email: user.email } } : {})
}
