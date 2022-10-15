import serve from 'instaserve'
import FS from 'node:fs'

export class leader {
    server
    db
    followers = []
    constructor() {
        this.db = JSON.parse(FS.readFileSync('./rant.db'))
    }
    async start() {
        const db = this.db
        this.server = serve({
            state(r, s) {
                followers.push(r.socket.ip)
                return db
            },
            candidate(r, s, data) {
                console.log('leader candidate ' + data, db)
                const key = r.url.split('/').pop()
                if(db[key] && (!db[key].__state__) || (!data.__state__) || (db[key].__state__ !== data.__state__)) {
                    throw Error('invalid state')
                }
                return db[key] = data
            }
        })
    }
    stop() {
        this.server.stop()
    }
}

export class readonly {
    db
    server
    async start() {
        const f = await fetch(`http://${parent}/state`)
        if (!f.ok) throw new Error('could not get state from parent')
        this.db = await f.json()
        this.server = serve({
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
    stop() {
        this.server.stop()
    }
}

export class writeonly {
    server
    async start() {
        const getstate = await fetch(`http://${leader}/state`)
        if (!getstate.ok) throw new Error('could not get state from leader')
        this.db.__state__ = getstate.__state__
        this.server = serve({
            async post(r, s, data) {
                const resp = await fetch(`http://${leader}/candidate`, { body: data })
                if (resp.ok) {
                    followers.forEach(follower => {
                        const resp = fetch(`http://${follower}/nupdate`, { body: data })
                        if (!resp.ok) {
                            throw new Error('could not update follower ' + follower)
                        }
                    })
                } else {

                }
            },
            nupdate(r, s, data) {
                const key = r.url.split('/').pop()
                db[key] = data
            }
        })
    }
    stop() {
        console.log(this.server)
        this.server.stop()
    }
}
