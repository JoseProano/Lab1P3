const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const spacesRoutes = require('../routes/spaces');

// Mock de la base de datos
jest.mock('../config/db', () => ({
  rawQuery: jest.fn(),
  query: jest.fn(),
}));

const db = require('../config/db');

// Configurar app de prueba
const app = express();
app.use(bodyParser.json());
app.use('/spaces', spacesRoutes);

describe('Spaces API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /spaces', () => {
    it('should return all spaces', async () => {
      const mockSpaces = [
        { id: 1, zone_id: 1, number: 'A-01', status: 'available' },
        { id: 2, zone_id: 1, number: 'A-02', status: 'occupied' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockSpaces });

      const response = await request(app).get('/spaces');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpaces);
      expect(db.rawQuery).toHaveBeenCalled();
    });

    it('should filter spaces by search query', async () => {
      const mockSpaces = [
        { id: 1, zone_id: 1, number: 'A-01', status: 'available' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockSpaces });

      const response = await request(app).get('/spaces?search=A-01');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpaces);
    });

    it('should handle errors', async () => {
      db.rawQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/spaces');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /spaces/:id', () => {
    it('should return a specific space', async () => {
      const mockSpace = { id: 1, zone_id: 1, number: 'A-01', status: 'available' };

      db.rawQuery.mockResolvedValue({ rows: [mockSpace] });

      const response = await request(app).get('/spaces/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpace);
    });

    it('should handle errors when getting space by id', async () => {
      db.rawQuery.mockRejectedValue(new Error('Space not found'));

      const response = await request(app).get('/spaces/999');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /spaces', () => {
    it('should create a new space', async () => {
      const newSpace = {
        zone_id: 1,
        number: 'A-03',
        status: 'available'
      };

      db.rawQuery.mockResolvedValue({});

      const response = await request(app)
        .post('/spaces')
        .send(newSpace);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Space created');
    });

    it('should handle errors when creating space', async () => {
      const newSpace = {
        zone_id: 1,
        number: 'A-03',
        status: 'available'
      };

      db.rawQuery.mockRejectedValue(new Error('Creation failed'));

      const response = await request(app)
        .post('/spaces')
        .send(newSpace);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /spaces/:id', () => {
    it('should update a space', async () => {
      const updatedSpace = {
        zone_id: 1,
        number: 'A-01',
        status: 'occupied'
      };

      db.rawQuery.mockResolvedValue({});

      const response = await request(app)
        .put('/spaces/1')
        .send(updatedSpace);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Space updated');
    });

    it('should handle errors when updating space', async () => {
      const updatedSpace = {
        zone_id: 1,
        number: 'A-01',
        status: 'occupied'
      };

      db.rawQuery.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/spaces/1')
        .send(updatedSpace);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /spaces/:id', () => {
    it('should delete a space', async () => {
      db.rawQuery.mockResolvedValue({});

      const response = await request(app).delete('/spaces/1');

      expect(response.status).toBe(200);
    });

    it('should handle errors when deleting space', async () => {
      db.rawQuery.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/spaces/1');

      expect(response.status).toBe(500);
    });
  });
});
