process.env.NODE_ENV = 'test'

const app = require('../../../app')
const request = require('supertest')

// jest.mock('../../../models')

describe('Pets', () => {
  // FIX IT: add as environment variable
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoibHVmZnlAbWFpbC5jb20iLCJpYXQiOjE3MTA5NzU5MjgsImV4cCI6MTc0MjUxMTkyOH0.f-2HggfgWfuD1J9d3SeuCbRH7FrPEKV2Hpi9YDFEV-Q'

  let petId

  const petObject = {
    name: 'Cotton',
    birthday: new Date('2023-01-01'),
    size: 'Mini',
    personality: 'He chatty and cute.',
    species: 'Dog',
    status: 'New',
    profilePictureUrl: 'http://images.com/cotton',
    shelter_id: 1
  }

  describe('GET /api/pets', () => {
    it('should list all pets', async () => {
      const res = await request(app)
        .get('/api/pets')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.headers['content-type']).toMatch(/json/)
      expect(res.status).toEqual(200)
      // expect(res.body).toHaveLength(1)
    })

    it('should show 10 results per page', async () => {

      const res = await request(app)
        .get('/api/pets/?page=1')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toEqual(200)
      // expect(res.body).toHaveLength(10)
    })
  })

  describe('POST /api/pets', () => {
    it('should create a new pet', async () => {
      const res = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(petObject)
        .expect(200)

      petId = res.body.id
    })

    it('should return an error if the request body is empty', async () => {
      const res = await request(app)
        .post('/api/pets')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})

      expect(res.status).toBe(422)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toEqual('empty request body')
    })
  })

  describe('GET /api/pets/{id}', () => {
    it('should return one pet', async () => {
      const res = await request(app)
        .get(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.name).toEqual('Cotton')
    })

    it('should return status 404 if any data is found', async () => {
      const pet = await request(app)
        .get('/api/pets/0')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(pet.status).toBe(404)
      expect(pet.body).toHaveProperty('error')
      expect(pet.body.error).toEqual('Error: Pet not found')
    })
  })

  describe('PUT /api/pets/{id}', () => {
    it('should update some fields', async () => {
      const res = await request(app)
        .put(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Jack',
          status: 'Available',
        })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('pet updated')
    })

    test.each([
      ['empty body', {}],
      ['undefined field', { somefield: 'some value' }]
    ])('should not update if provided an %s', async (_, param) => {
      const res = await request(app)
        .put(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(param)

      expect(res.status).toBe(204)
    })
  })

  describe('PATCH /api/pets/{id}', () => {
    it('should update only one field', async () => {
      const res = await request(app)
        .patch(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'Quarentine'
        })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('pet updated')
    })

    it('should return an error if try update more than one field', async () => {
      const res = await request(app)
        .patch(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          species: 'Cat',
          personality: 'She is very cute'
        })

      expect(res.status).toBe(422)
    })

    test.each([
      ['empty body', {}],
      ['undefined field', { somefield: 'some value' }]
    ])('should return an error if provided an %s', async (_, param) => {
      const res = await request(app)
        .put(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(param)

      expect(res.status).toBe(204)
    })
  })

  describe('DELETE /api/pets/{id}', () => {
    it('should delete one pet', async () => {
      await request(app)
        .delete(`/api/pets/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })

  describe('POST /api/pets/{id}/adoption', () => {
    it('should do an adoption', async () => {

      const reqTutor = await request(app)
        .get('/api/tutors')
        .set('Authorization', `Bearer ${accessToken}`)

      const reqPet = await request(app)
        .get('/api/pets')
        .set('Authorization', `Bearer ${accessToken}`)

      const tutor = reqTutor.body[1]
      const pet = reqPet.body[reqPet.body.length - 1]

      const res = await request(app)
        .post(`/api/pets/${pet.id}/adoption`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          animal: Number(pet.id),
          tutor: Number(tutor.id),
          date: '2023-01-01'
        })

      expect(res.status).toBe(200)
      expect(res.body.adoption).toHaveProperty('id')
    })
  })

  describe('DELETE /api/pets/:id/adoption/cancel', () => {
    it('should cancel one adoption', async () => {
      const reqPet = await request(app)
        .get('/api/pets')
        .set('Authorization', `Bearer ${accessToken}`)

      const pet = reqPet.body[reqPet.body.length - 1]

      await request(app)
        .delete(`/api/pets/${pet.id}/adoption/cancel`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })

})