import serve from 'instaserve'
import FS from 'node:fs'

const {parent, port, type} = process.env
const followers = []
let state = {}

if(type !== 'readonly') {
  state = JSON.parse(FS.readFileSync('./rant.db', 'utf-8'))
  console.log('loaded ' + state)  
} else {
  if(!parent) throw new Error('readonly nodes must specify a parent')
  const f = await fetch(`${parent}/all/${port}`)
  state = await f.json()
}

async function sendToFollowers(json) {
  followers.forEach(async follower => {
	const f  = await fetch(`${f}/update/${json}`)
        if(!f.ok) throw Error(`Error sending to ${follower}`)
  })
}

serve({
  /*
     /update/myid/stateval/{"a":"1"}
  */
  update ({url}, s) {
     if(type === 'readonly') throw new Error('not implemented')
     const [id, data] = url.split('/').splice(2, 3)
     console.log(id, JSON.parse(unescape(data)))
     const jdata = JSON.parse(unescape(data))
     
     if(state[id] && (state[id]._state_ !== data._state_))
       return {error: 'state is incorrect'}
     
     state[id] = jdata
     FS.writeFileSync('./rant.db', JSON.stringify(state, null, 2))
     sendToFollowers()
     return jdata
  },
  /*
     /get/myid
  */
  get ({url}) {
     const id = url.split('/').pop()
     return state[id] 
  },
  all ({socket, url}) {
    if(type === 'readonly') throw new Error('not implemented')
    
    const remotePort = url.split('/').pop()
    const remoteIP = socket.remoteAddress
    if(!followers.includes(`${remoteIP}:${remotePort}`))
       followers.push(`${remoteIP}:${remotePort}`)

    return state
  }
})

