const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '허용되지 않는 메소드' })
    };
  }

  try {
    const { credential } = JSON.parse(event.body);
    
    // Google 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    // JWT 토큰 생성
    const token = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        token,
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '인증 실패' })
    };
  }
}; 