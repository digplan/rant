//import os from 'node:os'
//console.log(os.networkInterfaces())

/*
(can be written to, sends updates to all nodes and must get full acceptance to commit)
write-nopersist    write-nopersist   write-nopersist

(only receives incoming updates, can be read from)
read-nopersist    read-nopersist    read-nopersist
*/

const {ip, port, network, peers, subset, persist, read, write} = process.env
if (!ip) throw Error('must specify an IP')
if (!port) throw Error('must specify an port')
if (!network) throw Error('must specify an network')
if (!peers) throw Error('must specify peers')
if (!persist) throw Error('must specify persist')
if (!read) throw Error('must specify read')
if (!write) throw Error('must specify write')

const db = {}

import serve from 'instaserve'
serve({
    api(r, s, data) {
        
    }
}, port, ip)