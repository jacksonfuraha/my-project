async function test() {
  const fetch = globalThis.fetch || (await import('node-fetch')).default;

  try {
    const response = await fetch('https://backend-4z3v.onrender.com/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'furaha@gmail.com',
        password: 'Jackson@123',
      }),
    });

    console.log('status', response.status);
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error('error', error.message);
  }
}

test();
