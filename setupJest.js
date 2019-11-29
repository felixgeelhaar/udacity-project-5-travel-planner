// Set node-fetch for Node environment to mock
const fetch = require('jest-fetch-mock')
jest.setMock('node-fetch', fetch)

// Set fetch globally
global.fetch = fetch
