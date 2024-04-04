const request = require("supertest");
const app = require("../app"); // Make sure this path matches the location of your app file

// Mocking passport authentication to bypass it in tests
jest.mock("../utils/passport", () => ({
    initialize: () => (req, res, next) => next(),
    authenticate: () => (req, res, next) => next(),
  }));

// Adjusting mocks to return numbers for ID fields
jest.mock('../models/worklogModel', () => ({
  getWorklogs: jest.fn().mockResolvedValue([{ id: 1, userId: 1, workareaId: 1, log: "Sample log" }]),
  getWorklogById: jest.fn().mockImplementation(id => Promise.resolve({ id: Number(id), userId: 1, workareaId: 1, log: "Detailed log for ID" })), // Ensure ID is returned as a number
  getWorkLogByIdForWorkareaId: jest.fn().mockImplementation((userId, workareaId) => Promise.resolve([{ userId: Number(userId), workareaId: Number(workareaId), log: "Log for specific user and workarea" }])), // Convert userId and workareaId to numbers
}));

describe('Worklog API Tests', () => {
  it('GET /worklogs - should return all worklogs', async () => {
    const res = await request(app).get('/worklogs');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        workareaId: expect.any(Number),
        log: expect.any(String)
      })
    ]));
  });

  it('GET /worklogs/:id - should return a worklog by id', async () => {
    const res = await request(app).get('/worklogs/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      id: 1,
      userId: 1,
      workareaId: 1,
      log: "Detailed log for ID"
    }));
  });

  it('GET /worklogs/:userId/:workareaId - should return worklogs for a specific user and workarea', async () => {
    const res = await request(app).get('/worklogs/1/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        userId: 1,
        workareaId: 1,
        log: "Log for specific user and workarea"
      })
    ]));
  });
});