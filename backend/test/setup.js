// Mock de la base de datos para los tests
const mockQuery = jest.fn();
const mockRawQuery = jest.fn();

const db = {
  query: mockQuery,
  rawQuery: mockRawQuery,
};

// Limpiar mocks antes de cada test
beforeEach(() => {
  mockQuery.mockClear();
  mockRawQuery.mockClear();
});

module.exports = { db, mockQuery, mockRawQuery };
