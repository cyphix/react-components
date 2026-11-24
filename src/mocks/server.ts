import { createServer, Response } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    routes() {
      const initialUser = { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', disabled: false, hasPassword: true, passkeyCount: 1, oidcLinked: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }
      let users = [{ ...initialUser }, { ...initialUser, id: 2, username: 'alice', email: 'alice@example.com', role: 'user' }]
      let session: typeof initialUser | null = { ...initialUser }
      let passkeys = [{ id: 1, name: 'Laptop', createdAt: initialUser.createdAt, lastUsedAt: null }]
      let nextId = 3
      const missing = () => new Response(404, {}, { message: 'User not found' })
      this.get('/auth/config', () => ({ passwordLogin: true, passkeys: true, oidcMode: 'disabled', oidcProviders: [], devAutoLogin: false }))
      this.get('/auth/me', () => session ?? new Response(401, {}, { message: 'Not signed in' }))
      this.patch('/auth/me', (_schema, request) => {
        if (!session) return new Response(401, {}, { message: 'Not signed in' })
        Object.assign(session, JSON.parse(request.requestBody), { updatedAt: new Date().toISOString() })
        return session
      })
      this.post('/auth/login', (_schema, request) => {
        const input = JSON.parse(request.requestBody)
        const user = users.find(user => user.username === input.identifier || user.email === input.identifier)
        if (!user || input.password !== 'DemoPassword123!') return new Response(401, {}, { message: 'Use admin / DemoPassword123!' })
        session = { ...user }
        return user
      })
      this.post('/auth/logout', () => { session = null; return new Response(204) })
      this.post('/auth/password', () => new Response(204))
      this.get('/auth/admin/users', () => users)
      this.post('/auth/admin/users', (_schema, request) => {
        const input = JSON.parse(request.requestBody)
        if (users.some(user => user.username === input.username)) return new Response(409, {}, { message: 'Username already exists' })
        const user = { ...initialUser, id: nextId++, username: input.username, email: input.email || null, role: input.role || 'user', hasPassword: !!input.password, passkeyCount: 0 }
        users.push(user)
        return user
      })
      this.patch('/auth/admin/users/:id', (_schema, request) => {
        const user = users.find(user => user.id === Number(request.params.id))
        if (!user) return missing()
        const { password, ...input } = JSON.parse(request.requestBody)
        Object.assign(user, input, { updatedAt: new Date().toISOString() }, password ? { hasPassword: true } : {})
        return user
      })
      this.delete('/auth/admin/users/:id', (_schema, request) => {
        users = users.filter(user => user.id !== Number(request.params.id))
        return new Response(204)
      })
      this.get('/auth/passkeys', () => passkeys)
      this.delete('/auth/passkeys/:id', (_schema, request) => {
        passkeys = passkeys.filter(key => key.id !== Number(request.params.id))
        return new Response(204)
      })
      // Browser credential ceremonies require a real relying party; demos return a clear error.
      for (const path of ['login', 'register']) {
        for (const stage of ['begin', 'finish']) {
          this.post(`/auth/passkey/${path}/${stage}`, () => new Response(400, {}, { message: 'Passkey ceremonies require a real goauth server.' }))
        }
      }
      let hasAvatar = false
      const avatar = () => hasAvatar
        ? new Response(200, { 'Content-Type': 'image/svg+xml' }, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="teal"/><text x="12" y="42" fill="white" font-size="28">AD</text></svg>')
        : new Response(404)
      this.get('/api/me/avatar', avatar)
      this.get('/api/admin/users/:id/avatar', avatar)
      this.get('/admin/users/:id/avatar', avatar)
      this.put('/api/me/avatar', () => { hasAvatar = true; if (session) session.updatedAt = new Date().toISOString(); return new Response(204) })
      this.delete('/api/me/avatar', () => { hasAvatar = false; if (session) session.updatedAt = new Date().toISOString(); return new Response(204) })
      this.namespace = 'api'
      // Small delay so loading states are observable in stories.
      this.timing = 400
    },
  })
}
