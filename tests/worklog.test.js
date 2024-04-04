const request = require("supertest");
const app = require("../app"); // Make sure this path matches the location of your app file

// Mocking passport authentication to bypass it in tests
jest.mock("../utils/passport", () => ({
  initialize: () => (req, res, next) => next(),
  authenticate: () => (req, res, next) => next(),
}));

// Adjusting mocks to return numbers for ID fields
jest.mock("../models/worklogModel", () => ({
  getWorklogs: jest
    .fn()
    .mockResolvedValue([
      { id: 1, userId: 1, workareaId: 1, log: "Sample log" },
    ]),
  getWorklogById: jest.fn().mockImplementation((id) =>
    Promise.resolve({
      id: Number(id),
      userId: 1,
      workareaId: 1,
      log: "Detailed log for ID",
    })
  ), // Ensure ID is returned as a number
  getWorkLogByIdForWorkareaId: jest
    .fn()
    .mockImplementation((userId, workareaId) =>
      Promise.resolve([
        {
          userId: Number(userId),
          workareaId: Number(workareaId),
          log: "Log for specific user and workarea",
        },
      ])
    ), // Convert userId and workareaId to numbers
}));

describe("Worklog API Tests", () => {
  it("GET /worklogs - should return all worklogs", async () => {
    const res = await request(app).get("/worklogs");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          userId: expect.any(Number),
          workareaId: expect.any(Number),
          log: expect.any(String),
        }),
      ])
    );
  });

  it("GET /worklogs/:userId - should return a worklog by id", async () => {
    const res = await request(app).get("/worklogs/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        userId: 1,
        workareaId: 1,
        log: "Detailed log for ID",
      })
    );
  });

  it("GET /worklogs/:userId/:workareaId - should return worklogs for a specific user and workarea", async () => {
    const res = await request(app).get("/worklogs/1/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: 1,
          workareaId: 1,
          log: "Log for specific user and workarea",
        }),
      ])
    );
  });
  it("should reject invalid userId with potential SQL injection", async () => {
    const maliciousUserId = "1; DROP TABLE users; --";
    const res = await request(app).get(`/worklogs/${maliciousUserId}`);
    expect(res.statusCode).toEqual(400);
    // Corrected expectation for error structure
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0]).toHaveProperty("msg", "User ID must be an integer");
  });

  it("should reject invalid workareaId with potential SQL injection", async () => {
    const maliciousWorkareaId = "1; DROP TABLE workarea; --";
    const res = await request(app).get(`/worklogs/1/${maliciousWorkareaId}`);
    expect(res.statusCode).toEqual(400);
    // Corrected expectation for error structure
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0]).toHaveProperty("msg", "Workarea ID must be an integer");
  });

  it("should reject invalid userId and workareaId with potential SQL injection", async () => {
    const maliciousUserId = "' OR '1'='1";
    const maliciousWorkareaId = "' OR '1'='1";
    const res = await request(app).get(`/worklogs/${maliciousUserId}/${maliciousWorkareaId}`);
    expect(res.statusCode).toEqual(400);
    // Corrected expectation for error structure
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0]).toHaveProperty("msg", "User ID must be an integer");
    expect(res.body.errors[1]).toHaveProperty("msg", "Workarea ID must be an integer");
  });
});


