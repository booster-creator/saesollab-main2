const axios = require('axios');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '허용되지 않는 메소드' })
    };
  }

  try {
    const { query, maxResults = 30 } = JSON.parse(event.body);
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    // 검색 요청
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        order: 'relevance',
        maxResults
      }
    });

    const videos = searchResponse.data.items;
    const detailedData = await Promise.all(
      videos.map(async (video) => {
        try {
          const [videoStats, channelStats] = await Promise.all([
            getVideoStats(video.id.videoId, YOUTUBE_API_KEY),
            getChannelStats(video.snippet.channelId, YOUTUBE_API_KEY)
          ]);

          const viewCount = parseInt(videoStats.viewCount) || 0;
          const likeCount = parseInt(videoStats.likeCount) || 0;
          const commentCount = parseInt(videoStats.commentCount) || 0;
          const subscriberCount = parseInt(channelStats.subscriberCount) || 0;
          const totalVideos = parseInt(channelStats.videoCount) || 0;

          // 비율 계산
          const subscriberViewRatio = subscriberCount > 0 ? (viewCount / subscriberCount).toFixed(3) : 'N/A';
          const viewLikeRatio = viewCount > 0 ? (likeCount / viewCount).toFixed(3) : 'N/A';
          const viewCommentRatio = viewCount > 0 ? (commentCount / viewCount).toFixed(3) : 'N/A';

          return {
            title: video.snippet.title,
            videoId: video.id.videoId,
            publishedAt: video.snippet.publishedAt,
            viewCount,
            likeCount,
            commentCount,
            channelTitle: video.snippet.channelTitle,
            subscriberCount,
            totalVideos,
            subscriberViewRatio,
            viewLikeRatio,
            viewCommentRatio,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            tension: parseFloat(subscriberViewRatio) || 0
          };
        } catch (error) {
          console.error(`Error processing video ${video.id.videoId}:`, error);
          return null;
        }
      })
    );

    // null 값 제거 및 tension 기준으로 정렬
    const filteredData = detailedData
      .filter(item => item !== null)
      .sort((a, b) => b.tension - a.tension);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(filteredData)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '서버 오류가 발생했습니다.',
        details: error.message 
      })
    };
  }
};

async function getVideoStats(videoId, apiKey) {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      key: apiKey,
      id: videoId,
      part: 'statistics'
    }
  });
  return response.data.items[0].statistics;
}

async function getChannelStats(channelId, apiKey) {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
    params: {
      key: apiKey,
      id: channelId,
      part: 'statistics'
    }
  });
  return response.data.items[0].statistics;
} 