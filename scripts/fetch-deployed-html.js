import https from 'node:https';

const url = 'https://my-project-jackson-furaha-s-projects.vercel.app';
https.get(url, (res) => {
  console.log('status', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.slice(0, 600));
  });
}).on('error', (err) => {
  console.error('error', err.message);
});
