// Write your tests here
const server = require('./server');
const db = require('../data/dbConfig');
const request = require('supertest');

const testUser1 = { username: "Lorem", password: "Ipsum"}
const testUser2 = {username: "HC", password: "Andersen"}

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


test('[0] sanity', () => {
  expect(true).not.toBe(false)
})


describe('server.js', () => {
  describe('User endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').insert(testUser1)
        await db('users').insert(testUser2)
      })
      test('[1.a] return 400 when user already exist', async () => {
        const res = await request(server).post('/api/auth/register').send({ username: "Lorem", password: "guest" })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
      test('[1.b] return 400 when usersername is not defined', async () => {
        const res = await request(server).post('/api/auth/register').send({ password: 'guest' })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })

    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').insert(testUser1)
        await db('users').insert(testUser2)
      })
      test('[2.a] return 400 when password is missing', async () => {
        const res = await request(server).post('/api/auth/login').send({ username: "Lorem" })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
      test('[2.b] return 400 when user does not exist', async () => {
        const res = await request(server).post('/api/auth/login').send({ username: "Henriette", password: "guest" })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })

    describe('[POST] /api/jokes', () => {
      beforeEach(async () => {
        await db('users').insert(testUser1)
        await db('users').insert(testUser2)
      })
      test('[3.a] return 200 when token is valid', async () => {
        const user = await request(server).post('/api/auth/login').send({ username: "Lorem", password: "Ipsum" })

        const res = await request(server).get('/api/jokes').set('Authorization', `${user.body.token}`)
        expect(res.status).toBeGreaterThanOrEqual(200);
      }, 750)

      test('[3.b] return 400 when token is invalid', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', `12345`)
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })
  })
})