import { AuthClient } from '@cyphix/auth-react'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { makeServer } from './server'

let server: ReturnType<typeof makeServer>
const client = new AuthClient()
beforeEach(() => { server = makeServer({ environment: 'test' }) })
afterEach(() => server.shutdown())

it('serves config, session, and user management through the auth client', async () => {
 expect((await client.getConfig()).passwordLogin).toBe(true)
 expect((await client.me())?.role).toBe('admin')
 const user = await client.adminCreateUser({ username: 'newuser', role: 'user' })
 expect((await client.adminListUsers()).some(u => u.id === user.id)).toBe(true)
 expect((await client.adminUpdateUser(user.id, { disabled: true })).disabled).toBe(true)
 await client.adminDeleteUser(user.id)
 expect((await client.adminListUsers()).some(u => u.id === user.id)).toBe(false)
 expect((await client.updateProfile({ email: 'changed@example.com' })).email).toBe('changed@example.com')
})

it('handles empty passkeys, failed login, and session changes', async () => {
 await client.deletePasskey(1)
 expect(await client.listPasskeys()).toEqual([])
 await expect(client.login('admin', 'wrong')).rejects.toThrow('Use admin')
 await client.logout()
 expect(await client.me()).toBeNull()
 expect((await client.login('admin', 'DemoPassword123!')).username).toBe('admin')
})
