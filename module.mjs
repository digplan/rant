import serve from 'instaserve'
import get from 'instax'

const { type, parent, subset } = process.env
let db = {}

const servertypes = {}

if (type === 'readonly') {
    db = get(`http://${parent}/state/${subset}`)

    serve({
        get(r, s, data) {
            const key = r.url.split('/').pop()
            return db[key]
        },
        nupdate(r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        }
    })
}

if (type === 'writeonly') {
    serve({
        post(r, s, data) {
            const key = r.url.split('/').pop()
            return db[key]
        },
    update(r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        },
    delete(r, s, data) {
            const key = r.url.split('/').pop()
            return db[key]
        },
    nupdate(r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        })
}

if (type === 'leader') {
    serve({
        candidate(r, s, data) {
            const key = r.url.split('/').pop()
            db[key] = data
        })
}