// Simple server starter with explicit environment variables
process.env.API_BASE_URL = 'https://api.nearblocks.io/v1';
process.env.API_KEY = '0D4F4E72DBAF40DAA36A536FB4EE4801';
process.env.PORT = '3001';
process.env.CACHE_TTL = '30';

console.log('Environment configured:');
console.log('API_BASE_URL:', process.env.API_BASE_URL);
console.log('API_KEY:', process.env.API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);

// Import and run the main server
import('./server.js');

