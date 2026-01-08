const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const zonesRoutes = require('../routes/zones');

// Mock de la base de datos
jest.mock('../config/db', () => ({
  rawQuery: jest.fn(),
  query: jest.fn(),
}));

const db = require('../config/db');

// Configurar app de prueba
const app = express();
app.use(bodyParser.json());
app.use('/zones', zonesRoutes);

describe('Zones API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /zones', () => {
    it('should return all zones', async () => {
      const mockZones = [
        { id: 1, name: 'Zone A', description: 'Description A' },
        { id: 2, name: 'Zone B', description: 'Description B' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockZones });

      const response = await request(app).get('/zones');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZones);
      expect(db.rawQuery).toHaveBeenCalled();
    });

    it('should filter zones by search query', async () => {
      const mockZones = [
        { id: 1, name: 'Zone A', description: 'Description A' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockZones });

      const response = await request(app).get('/zones?search=Zone A');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZones);
    });

    it('should handle errors', async () => {
      db.rawQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/zones');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /zones/:id', () => {
    it('should return a specific zone', async () => {
      const mockZone = { id: 1, name: 'Zone A', description: 'Description A' };

      db.rawQuery.mockResolvedValue({ rows: [mockZone] });

      const response = await request(app).get('/zones/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZone);
    });

    it('should handle errors when getting zone by id', async () => {
      db.rawQuery.mockRejectedValue(new Error('Zone not found'));

      const response = await request(app).get('/zones/999');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /zones', () => {
    it('should create a new zone', async () => {
      const newZone = {
        name: 'New Zone',
        description: 'New Description'
      };

      db.rawQuery.mockResolvedValue({});

      const response = await request(app)
        .post('/zones')
        .send(newZone);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Zone created');
    });

    it('should handle errors when creating zone', async () => {
      const newZone = {
        name: 'New Zone',
        description: 'New Description'
      };

      db.rawQuery.mockRejectedValue(new Error('Creation failed'));

      const response = await request(app)
        .post('/zones')
        .send(newZone);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /zones/:id', () => {
    it('should update a zone', async () => {
      const updatedZone = {
        name: 'Updated Zone',
        description: 'Updated Description'
      };

      db.rawQuery.mockResolvedValue({});

      const response = await request(app)
        .put('/zones/1')
        .send(updatedZone);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle errors when updating zone', async () => {
      const updatedZone = {
        name: 'Updated Zone',
        description: 'Updated Description'
      };

      db.rawQuery.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/zones/1')
        .send(updatedZone);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /zones/:id', () => {
    it('should delete a zone', async () => {
      db.rawQuery.mockResolvedValue({});

      const response = await request(app).delete('/zones/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Zone deleted');
    });

    it('should handle errors when deleting zone', async () => {
      db.rawQuery.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/zones/1');

      expect(response.status).toBe(500);
    });
  });
});
