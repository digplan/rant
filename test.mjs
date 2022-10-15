import { readonly, writeonly, leader } from './module.mjs'

const myleader = new leader()
myleader.start()

// valid update to leader
await fetch('http://localhost:3000/candidate/test:mykey', { method: 'POST', body: JSON.stringify({a:1}) })

// bad update to leader
await fetch('http://localhost:3000/candidate/test:mykey2', { method: 'POST', body: JSON.stringify({ a: 1 }) })


myleader.stop()