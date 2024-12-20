const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { keyword } = event.queryStringParameters || {};
    if (!keyword) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Keyword is required' }) };
    }

    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(keyword)}`,
      { headers: { 'Accept': 'application/json' } }
    );

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suggestions: data[1] || [] })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suggestions: [] })
    };
  }
}; 