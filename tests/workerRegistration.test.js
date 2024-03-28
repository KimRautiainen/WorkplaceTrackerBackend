

const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { postUser } = require('../controllers/workerController');
const fs = require('fs');



process.env.JWT_SECRET = 'your_jwt_secret_for_testing';
// Automatically mock bcryptjs, userModel, and fs

jest.mock('bcryptjs');
jest.mock('../models/userModel');
jest.mock('fs');

describe('postUser', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    // Setup mock request (req) and response (res) objects
    mockReq = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-5555',
        password: 'password123'
      },
      file: {
        filename: 'profilepic.jpg',
        path: 'uploads/profilepic.jpg'
      }
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining of status().json()
    };

    // Setup default mock implementations
    // Mock bcrypt.genSalt to return a promise that resolves with a specific salt value
    bcrypt.genSalt.mockResolvedValue('someSaltValue');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    
    userModel.checkEmail.mockResolvedValue([]);
    userModel.insertWorker.mockResolvedValue({ id: 1, ...mockReq.body, password: 'hashedPassword' });

    // Mock fs.unlink to simulate successful file deletion
    fs.unlink.mockImplementation((path, callback) => callback(null));
  });

  it('should register a new worker and return 201 status', async () => {
    await postUser(mockReq, mockRes);

    expect(userModel.checkEmail).toHaveBeenCalledWith(mockReq.body.email);
    // Adjusted expectation for bcrypt.hash to reflect dynamic salt usage
    expect(bcrypt.hash).toHaveBeenCalledWith(mockReq.body.password, 'someSaltValue');
    expect(userModel.insertWorker).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Worker created" });
  });


  it('should return a 409 status if the email already exists', async () => {
    userModel.checkEmail.mockResolvedValue([{ id: 1, email: mockReq.body.email }]); // Simulate existing email

    await postUser(mockReq, mockRes);

    // Adjusted to match the expectation with the absolute path
    expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('profilepic.jpg'), expect.any(Function));
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Email already in use" });
  });

  // Additional tests to cover other scenarios and edge cases can be added here
});