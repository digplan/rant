export const leader = {
    state(r, s) {
        this.followers.push(r.socket.ip)
        return this.db
    },
    async candidate(r, s, data) {
        console.log('leader candidate ' + data, db)
        const key = r.url.split('/').pop()
        if (db[key] && (!db[key].__state__) || (!data.__state__) || (db[key].__state__ !== data.__state__)) {
            throw Error('invalid state')
        }
        data.__state__ = +new Date()
        this.__gstate__ = +new Date()
        db[key] = data
        followers.forEach(follower => {
            fetch(`${follower}/nupdate/${key}`, {body: JSON.stringify(data)})
        })
    }
}

export const readonly = {
    get(r, s, data) {
        const key = r.url.split('/').pop()
        return db[key]
    },
    nupdate(r, s, data) {
        const key = r.url.split('/').pop()
        db[key] = data
    }
}

export const writeonly = {
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
}