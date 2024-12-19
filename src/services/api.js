const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// YouTube API 관련 상수
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 키워드별 메트릭 데이터
const keywordMetrics = {
  '먹방': {
    searchVolume: '3.5M',
    volumeGrowth: '15.7%',
    competition: '높음',
    competitorCount: 2800,
    relatedKeywords: ['맛집', '요리', '브이로그', '레시피', 'mukbang', '일상', '리뷰', '푸드', 'ASMR', '맛집투어']
  },
  '게임': {
    searchVolume: '4.2M',
    volumeGrowth: '18.3%',
    competition: '매우 높음',
    competitorCount: 3500,
    relatedKeywords: ['리뷰', '실황', '공략', '스트리밍', '하이라이트', '게임방송', 'e스포츠', '플레이', '리그', '게임리뷰']
  },
  '맛집': {
    searchVolume: '2.8M',
    volumeGrowth: '10.5%',
    competition: '중간',
    competitorCount: 1800,
    relatedKeywords: ['맛집투어', '먹방', '브이로그', '맛집리뷰', '맛집추천', '카페', '음식', '레스토랑', '맛집지도', '맛집vlog']
  }
};

// 기본 메트릭 데이터
const defaultMetrics = {
  searchVolume: '2.3M',
  volumeGrowth: '12.3%',
  competition: '중간',
  competitorCount: 1200,
  relatedKeywords: [
    '브이로그', '일상', '데일리', '여행', '먹방',
    '리뷰', '게임', '요리', '뷰티', '패션'
  ]
};

// YouTube API 관련 함수 추가
async function fetchVideoDetails(videoId) {
  const url = `${YOUTUBE_API_BASE_URL}/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=statistics,snippet`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch video details');
  }
  const data = await response.json();
  return data.items[0];
}

async function fetchChannelDetails(channelId) {
  const url = `${YOUTUBE_API_BASE_URL}/channels?key=${YOUTUBE_API_KEY}&id=${channelId}&part=statistics`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch channel details');
  }
  const data = await response.json();
  return data.items[0];
}

export async function analyzeKeyword(keyword) {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    // 키워드별 메트릭 반환 또는 기본값 사용
    const metrics = keywordMetrics[keyword] || defaultMetrics;

    return {
      ...metrics,
      keyword
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('키워드 분석 중 오류가 발생했습니다.');
  }
}

// YouTube 데이터 분석 함수 추가
export async function analyzeYouTubeData(videoId) {
  try {
    const videoDetails = await fetchVideoDetails(videoId);
    const channelDetails = await fetchChannelDetails(videoDetails.snippet.channelId);
    
    const stats = videoDetails.statistics;
    const channelStats = channelDetails.statistics;

    // 비율 계산
    const viewCount = parseInt(stats.viewCount) || 0;
    const subscriberCount = parseInt(channelStats.subscriberCount) || 0;
    const likeCount = parseInt(stats.likeCount) || 0;
    const commentCount = parseInt(stats.commentCount) || 0;

    return {
      video: {
        title: videoDetails.snippet.title,
        publishedAt: videoDetails.snippet.publishedAt,
        viewCount,
        likeCount,
        commentCount,
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      channel: {
        title: videoDetails.snippet.channelTitle,
        subscriberCount,
        totalVideos: parseInt(channelStats.videoCount) || 0
      },
      metrics: {
        subscriberViewRatio: subscriberCount > 0 ? (viewCount / subscriberCount).toFixed(3) : 'N/A',
        viewLikeRatio: viewCount > 0 ? (likeCount / viewCount).toFixed(3) : 'N/A',
        viewCommentRatio: viewCount > 0 ? (commentCount / viewCount).toFixed(3) : 'N/A'
      }
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw new Error('YouTube 데이터 분석 중 오류가 발생했습니다.');
  }
}