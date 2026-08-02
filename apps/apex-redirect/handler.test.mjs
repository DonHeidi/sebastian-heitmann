import { test, expect } from 'bun:test';
import { handle } from './handler.mjs';

test('redirects apex root to www with a 301', async () => {
  const res = await handle({ path: '/' });
  expect(res.statusCode).toBe(301);
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/');
});

test('preserves the path', async () => {
  const res = await handle({ path: '/imprint/' });
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/imprint/');
});

test('preserves a raw query string', async () => {
  const res = await handle({ path: '/', rawQueryString: 'ref=x' });
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/?ref=x');
});

test('preserves a query params map', async () => {
  const res = await handle({ path: '/imprint/', queryStringParameters: { a: '1', b: '2' } });
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/imprint/?a=1&b=2');
});

test('defaults path to / when absent', async () => {
  const res = await handle({});
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/');
});

test('forces a leading slash on a bare path', async () => {
  const res = await handle({ path: 'imprint' });
  expect(res.headers.Location).toBe('https://www.sebastian-heitmann.dev/imprint');
});
