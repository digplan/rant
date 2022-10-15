import serve from 'instaserve'
import { leader, readonly, writeonly } from './routes.mjs'

import FS from 'node:fs'

export class leader {
    __gstate__
    server
    db
    followers = []
    constructor() {
        this.db = JSON.parse(FS.readFileSync('./rant.db'))
    }
    async start() {
        const db = this.db
        this.server = serve(leader)
    }
}

export class readonly {
    __gstate__
    db
    server
    async start() {
        const f = await fetch(`http://${parent}/state`)
        if (!f.ok) throw new Error('could not get state from parent')
        this.db = await f.json()
        this.server = serve(readonly)
    }
}

export class writeonly {
    __gstate__
    server
    async start() {
        const getstate = await fetch(`http://${leader}/state`)
        if (!getstate.ok) throw new Error('could not get state from leader')
        this.db.__state__ = getstate.__state__
        this.server = serve(writeonly)
    }
}
