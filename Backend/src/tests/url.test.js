const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const connectDB = require('../db/db');
const redisClient = require('../db/redis');
const urlModel = require('../models/url.model');


describe('URL Shortener API', () => {

    beforeAll(async () => {
    await connectDB();

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
});

beforeEach(async () => {
    await urlModel.deleteMany({});
});

//TESTS
test("should create a short URL", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com"
        });

    expect(response.statusCode).toBe(201);
    expect(response.body.message)
        .toBe("short url created successfully");
    expect(response.body.shortURL)
        .toBeDefined();

    // Query MongoDB
    const url = await urlModel.findOne({
        originalURL: "https://www.google.com"
    });

    expect(url).not.toBeNull();
    expect(url.originalURL).toBe("https://www.google.com");
    expect(url.shortCode).toBeDefined();
    expect(url.clicks).toBe(0);

});

test("should reject an invalid URL", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "abc"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("pls provide a valid url");
});
test("should reject missing originalURL", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("original URL is required");

});
test("should reject empty originalURL", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: ""
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("original URL is required");

});
test("should create a short URL with custom alias", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.github.com",
            customAlias: "github"
        });

    expect(response.statusCode).toBe(201);

    const url = await urlModel.findOne({
        shortCode: "github"
    });

    expect(url).not.toBeNull();
    expect(url.shortCode).toBe("github");
    expect(url.originalURL).toBe("https://www.github.com");
});
test("should reject duplicate custom alias", async () => {

    // Create first URL
    await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.github.com",
            customAlias: "github"
        });

    // Try creating another URL with same alias
    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com",
            customAlias: "github"
        });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Custom alias is already in use.");
});
test("should reject empty custom alias", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com",
            customAlias: ""
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Custom alias cannot be empty.");

});
test("should reject invalid custom alias", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com",
            customAlias: "abc@123"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Invalid custom alias.");

});
test("should reject invalid expiration date", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com",
            expiresAt: "abcdef"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Invalid expiration date.");

});
test("should reject past expiration date", async () => {

    const response = await request(app)
        .post("/api/url/shorten")
        .send({
            originalURL: "https://www.google.com",
            expiresAt: "2020-01-01"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Expiration date must be in the future.");

});

afterAll(async () => {
    await mongoose.connection.close();

    if (redisClient.isOpen) {
        await redisClient.quit();
    }
});

})
