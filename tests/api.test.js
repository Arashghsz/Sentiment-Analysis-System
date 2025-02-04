import { app } from '../server.js';
import request from 'supertest';
import { jest } from '@jest/globals';

// Increase timeout for all tests
jest.setTimeout(10000);

// Silence console logs during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('Sentiment Analysis API', () => {
  test('POST /analyze with custom model', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        text: 'This is amazing!',
        model: 'custom'
      })
      .timeout(10000); // Increase timeout specifically for this test

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sentiment');
    expect(response.body).toHaveProperty('confidence');
  });

  test('POST /analyze with llama model', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        text: 'This is terrible!',
        model: 'llama'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sentiment');
    expect(response.body).toHaveProperty('confidence');
  });

  test('POST /analyze with empty text', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        text: '',
        model: 'custom'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /analyze with invalid model', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        text: 'Test text',
        model: 'invalid'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
