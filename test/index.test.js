'use strict'
const test = require('brittle')
const b4a = require('b4a')
const sodium = require('sodium-native')
const IPC = require('pear-ipc')
const Iambus = require('iambus')
const { isWindows } = require('which-runtime')
const wakeups = require('..')

function pipeId (s) {
  const buf = b4a.allocUnsafe(32)
  sodium.crypto_generichash(buf, b4a.from(s))
  return b4a.toString(buf, 'hex')
}

test('wakeups()', async (t) => {
  t.plan(1)
  const kIPC = Symbol('test.ipc')
  const socketPath = isWindows ? `\\\\.\\pipe\\test-${pipeId(__dirname)}` : __dirname + '/test.sock' // eslint-disable-line
  const bus = new Iambus()
  const srv = new IPC.Server({
    socketPath,
    handlers: {
      messages (pattern) {
        const sub = bus.sub(pattern)
        bus.pub({ type: 'pear/wakeup', app: false, version: { fork: 0, length: 0, key: null }, info: null, updating: true, updated: false })
        setImmediate(() => sub.end())
        return sub
      }
    }
  })
  t.teardown(() => srv.close())
  await srv.ready()
  const ipc = new IPC.Client({ socketPath })
  t.teardown(() => ipc.close())
  await ipc.ready()
  class API {
    static IPC = kIPC
    get [kIPC] () { return ipc }
  }
  global.Pear = new API()

  const stream = wakeups()
  stream.on('data', (msg) => {
    t.alike({ type: 'pear/wakeup', app: false, version: { fork: 0, length: 0, key: null }, info: null, updating: true, updated: false }, msg)
  })
})

test('wakeups(listener)', async (t) => {
  t.plan(1)
  const kIPC = Symbol('test.ipc')
  const socketPath = isWindows ? `\\\\.\\pipe\\test-${pipeId(__dirname)}` : __dirname + '/test.sock' // eslint-disable-line
  const bus = new Iambus()
  const srv = new IPC.Server({
    socketPath,
    handlers: {
      messages (pattern) {
        const sub = bus.sub(pattern)
        bus.pub({ type: 'pear/wakeup', app: false, version: { fork: 0, length: 0, key: null }, info: null, updating: true, updated: false })
        setImmediate(() => sub.end())
        return sub
      }
    }
  })
  t.teardown(() => srv.close())
  await srv.ready()
  const ipc = new IPC.Client({ socketPath })
  t.teardown(() => ipc.close())
  await ipc.ready()
  class API {
    static IPC = kIPC
    get [kIPC] () { return ipc }
  }
  global.Pear = new API()

  wakeups((upd) => {
    t.alike({ type: 'pear/wakeup', app: false, version: { fork: 0, length: 0, key: null }, info: null, updating: true, updated: false }, upd)
  })
})
