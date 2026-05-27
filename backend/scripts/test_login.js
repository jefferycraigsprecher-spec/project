const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'devadmin@midwestshipment.com',
      password: 'DevAdmin@123'
    });
    console.log('Login success:', res.data);
  } catch (err) {
    if (err.response) console.error('Login failed:', err.response.status, err.response.data);
    else console.error('Login error:', err.message);
    process.exit(1);
  }
})();
