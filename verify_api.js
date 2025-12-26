fetch('http://localhost:3000/corporate/expenses', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ username: 'admin', password: 'admin' })
})
    .then(r => r.json())
    .then(d => console.log('Response:', d))
    .catch(e => console.error('Error:', e));
