import http from 'node:http';
import { promisify } from 'node:util';
import { URL } from 'node:url';

const url = new URL('http://localhost:3000');
const options = {
  hostname: url.hostname,
  port: url.port,
  path: url.pathname,
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(body.slice(0, 400));
  });
});
req.on('error', (err) => console.error('error', err.message));
req.end();
