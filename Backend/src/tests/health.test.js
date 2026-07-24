const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const connectDB = require('../db/db');
const redisClient = require('../db/redis');
const urlModel = require('../models/url.model');


describe('Health Check API', () => {

    beforeAll(async () => {

        // Connect MongoDB
        await connectDB();

        // Connect Redis
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    });
    beforeEach(async () => {
        // Clear all URLs before every test
        await urlModel.deleteMany({});
    });

    afterAll(async () => {

        // Close MongoDB
        await mongoose.connection.close();

        // Close Redis
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    });

    test('should return health status', async () => {

        const response = await request(app)
            .get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.status).toBe('healthy');
    });

});