import serve from 'instaserve'

const { type, parent, subset, leader } = process.env
let db = {}

const servertypes = {}
const followers = []

if (type === 'readonly') {
    const f = fetch(`http://${parent}/state`)
    if(!f.ok) throw new Error('could not get state from parent') 
    db = await f.json()

    serve({
        get (r, s, data) {
            const key = r.url.split('/').pop()
            return db[key]
        },
        nupdate (r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        }
    })
}

if (type === 'writeonly') {
    const getstate = await fetch(`http://${leader}/state`)
    if (!getstate.ok) throw new Error('could not get state from leader') 
    db.__state__ = getstate.__state__
    serve({
        post (r, s, data) {
            const resp = await fetch (`http://${leader}/candidate`, { body: data })
            if (resp.ok) {
                followers.forEach(follower => {
                    const resp = fetch(`http://${follower}/nupdate`, { body: data })
                    if(!resp.ok) {
                        throw new Error('could not update follower ' + follower)
                    }
                })
            } else {

            }
        },
        nupdate (r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        })
}

if (type === 'leader') {
    serve({
        state(r, s) {
            followers.push(r.socket.ip)
            return db
        },
        candidate (r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        })
}