const { login } = require('../controllers/authController');
const userModel = require('../models/userModel');
const employeeModel = require('../models/employeeModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('../models/employeeModel');
jest.mock('passport');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_jwt_token'),
}));

describe('Login Functionality', () => {
    const mockRequest = (sessionData, body) => ({
        session: { data: sessionData },
        body: body,
        path: '/auth/login', // or /auth/employee/login for employee tests
        login: jest.fn((userOrEmployee, options, callback) => callback()), // Mock req.login
    });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks in between tests
  });

  it('should authenticate a user successfully', async () => {
    // Setup
    const req = mockRequest({}, { email: 'user@example.com', password: 'password' });
    const res = mockResponse();
    passport.authenticate = jest.fn((strategy, options, callback) => () => callback(null, { id: 1 }, null));

    userModel.getUserLogin.mockResolvedValue([{ id: 1, email: 'user@example.com', password: '$2y$12$...' }]);

    // Execute
    await login(req, res);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      account: { id: 1 },
      token: 'mocked_jwt_token',
    });
  });

  it('should authenticate an employee successfully', async () => {
    // Setup
    const req = mockRequest({}, { email: 'employee@example.com', password: 'password' });
    req.path = '/auth/employee/login'; // Change path for employee login
    const res = mockResponse();
    passport.authenticate = jest.fn((strategy, options, callback) => () => callback(null, { id: 2 }, null));

    employeeModel.getEmployeeLogin.mockResolvedValue([{ id: 2, email: 'employee@example.com', password: '$2y$12$...' }]);

    // Execute
    await login(req, res);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      account: { id: 2 },
      token: 'mocked_jwt_token',
    });
  });

  // Add more tests here to cover failed logins, such as incorrect password, no user found, etc.
});