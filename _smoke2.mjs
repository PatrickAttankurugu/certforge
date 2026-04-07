const URL = 'https://certforge-two.vercel.app'
const SUPA = 'https://nuaseaxwfwivyjtgoxjh.supabase.co'
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const r = await fetch(`${SUPA}/auth/v1/token?grant_type=password`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON },
  body: JSON.stringify({ email: 'test+smoketest@certforge.dev', password: 'TestSmoke123!' }),
})
const a = await r.json()
const cookie = `sb-nuaseaxwfwivyjtgoxjh-auth-token=${encodeURIComponent(JSON.stringify({access_token:a.access_token,refresh_token:a.refresh_token,expires_at:Math.floor(Date.now()/1000)+a.expires_in,expires_in:a.expires_in,token_type:'bearer',user:a.user}))}`
const hit = (p, o={}) => fetch(URL+p, {...o, headers:{Cookie:cookie,'Content-Type':'application/json',...(o.headers||{})}}).then(async x=>({s:x.status,b:(await x.text()).slice(0,250)}))

// Get a question id for explain/variants
import { createClient } from '@supabase/supabase-js'
const supa = createClient(SUPA, process.env.SUPABASE_SERVICE_ROLE_KEY)
const { data: qs } = await supa.from('questions').select('id,options').limit(1)
const q = qs[0]
console.log('using question', q.id)

console.log('\n--- explain ---')
console.log(await hit('/api/study/explain',{method:'POST',body:JSON.stringify({question_id:q.id,selected_answer:[q.options[0].id]})}))

console.log('\n--- tutor ---')
console.log(await hit('/api/study/tutor',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'What is an S3 bucket policy?'}]})}))

console.log('\n--- variants ---')
console.log(await hit('/api/study/questions/variants',{method:'POST',body:JSON.stringify({question_id:q.id})}))

console.log('\n--- socratic (if exists) ---')
console.log(await hit('/api/study/socratic',{method:'POST',body:JSON.stringify({question_id:q.id,user_answer:'I think A'})}))
