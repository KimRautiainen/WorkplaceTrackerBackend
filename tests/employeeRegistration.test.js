const bcrypt = require('bcryptjs');
const employeeModel = require('../models/employeeModel');
const { postEmployee } = require('../controllers/employeeController');
const fs = require('fs');

process.env.JWT_SECRET = 'your_jwt_secret_for_testing';

jest.mock('bcryptjs');
jest.mock('../models/employeeModel');
jest.mock('fs');

describe('postEmployee', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {
                businessId: '123',
                name: 'ABC Corp',
                address: '123 Street',
                email: 'abc@example.com',
                phone: '555-5555',
                picture: 'logo.jpg',
                password: 'password123'
            },
            file: {
                filename: 'logo.jpg',
                path: 'uploads/logo.jpg'
            }
        };

        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        bcrypt.genSalt.mockResolvedValue('someSaltValue');
        bcrypt.hash.mockResolvedValue('hashedPassword');

        employeeModel.checkEmail.mockResolvedValue([]);
        employeeModel.insertEmployee.mockResolvedValue({ id: 1, ...mockReq.body, password: 'hashedPassword' });

        fs.unlink.mockImplementation((path, callback) => callback(null));
    });

    it('should register a new employee and return 201 status', async () => {
        await postEmployee(mockReq, mockRes);

        expect(employeeModel.checkEmail).toHaveBeenCalledWith(mockReq.body.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(mockReq.body.password, 'someSaltValue');
        expect(employeeModel.insertEmployee).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Employee created" });
    });

    it('should return a 409 status if the email already exists', async () => {
        employeeModel.checkEmail.mockResolvedValue([{ id: 1, email: mockReq.body.email }]);

        await postEmployee(mockReq, mockRes);

        expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('logo.jpg'), expect.any(Function));
        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Email already in use" });
    });

    // Additional tests to cover other scenarios and edge cases can be added here
});