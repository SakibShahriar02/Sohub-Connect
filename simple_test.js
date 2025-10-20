// Simple connection test
const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Testing server accessibility...');
    const response = await fetch('http://202.59.208.113:8000/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwODEwNDAwLCJleHAiOjE5MTg1NzY4MDB9._MBk9fPzT0YY3U-Ivk2FvazD06YTkkVjTPXFNJqbdns'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testServer();