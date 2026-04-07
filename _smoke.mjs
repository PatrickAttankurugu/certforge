const URL = 'https://certforge-two.vercel.app'
const SUPA = 'https://nuaseaxwfwivyjtgoxjh.supabase.co'
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const email = 'test+smoketest@certforge.dev'
const password = 'TestSmoke123!'

// 1. Login via Supabase
const r = await fetch(`${SUPA}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: ANON },
  body: JSON.stringify({ email, password }),
})
const auth = await r.json()
if (!auth.access_token) { console.error('LOGIN FAIL', auth); process.exit(1) }
console.log('✓ login ok, user', auth.user.id)

// Build cookie for the SSR app — Supabase SSR uses sb-<projref>-auth-token
const projRef = 'nuaseaxwfwivyjtgoxjh'
const cookieValue = encodeURIComponent(JSON.stringify({
  access_token: auth.access_token,
  refresh_token: auth.refresh_token,
  expires_at: Math.floor(Date.now()/1000) + auth.expires_in,
  expires_in: auth.expires_in,
  token_type: 'bearer',
  user: auth.user,
}))
const cookie = `sb-${projRef}-auth-token=${cookieValue}`

async function hit(path, opts = {}) {
  const res = await fetch(`${URL}${path}`, {
    ...opts,
    headers: { Cookie: cookie, 'Content-Type': 'application/json', ...(opts.headers||{}) },
  })
  return { status: res.status, body: await res.text() }
}

// 2. Sanity: protected page
const study = await hit('/study')
console.log('GET /study →', study.status)

// 3. AI: question generate
console.log('\n--- AI: generate question ---')
const gen = await hit('/api/study/questions/generate', {
  method: 'POST',
  body: JSON.stringify({ domain_id: 'secure', difficulty: 3, question_type: 'single' }),
})
console.log('status', gen.status)
console.log(gen.body.slice(0, 500))

// 4. AI: compare
console.log('\n--- AI: compare ---')
const cmp = await hit('/api/study/compare', {
  method: 'POST',
  body: JSON.stringify({ service_a: 'S3', service_b: 'EBS' }),
})
console.log('status', cmp.status)
console.log(cmp.body.slice(0, 300))

// 5. AI: study plan
console.log('\n--- AI: study plan ---')
const sp = await hit('/api/study/study-plan', {
  method: 'POST',
  body: JSON.stringify({ target_date: '2026-06-01', daily_goal_minutes: 60, daily_goal_questions: 20 }),
})
console.log('status', sp.status)
console.log(sp.body.slice(0, 400))
