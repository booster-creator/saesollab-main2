const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { keyword } = event.queryStringParameters;
    if (!keyword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Keyword is required' })
      };
    }

    // 캐싱을 위한 헤더 추가
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0' // 필요한 경우
        }
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API responded with ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        suggestions: data[1] || [],
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Suggestion API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch suggestions',
        message: error.message
      })
    };
  }
}; 