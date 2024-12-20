const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// YouTube API 관련 상수
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
if (!YOUTUBE_API_KEY) {
  console.error('YouTube API key is not loaded from environment variables');
}
console.log('API Key status:', !!YOUTUBE_API_KEY);
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
  if (!videoId) {
    throw new Error('Video ID is required');
  }
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

// YouTube 검색 API 함수 추가
async function searchYouTubeVideos(keyword) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API 키가 설정되지 않았습니다. 관리자에게 문의하세요.');
  }
  const url = `${YOUTUBE_API_BASE_URL}/search?key=${YOUTUBE_API_KEY}&q=${keyword}&part=snippet&type=video&maxResults=15`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search videos');
  }
  const data = await response.json();
  return data.items;
}

async function getRelatedKeywords(keyword) {
  const searchResults = await searchYouTubeVideos(keyword);
  const relatedTerms = new Set();
  
  searchResults.forEach(video => {
    // 제목과 설명에서 키워드 추출
    const terms = video.snippet.title.split(/\s+/)
      .concat(video.snippet.description.split(/\s+/))
      .filter(term => term.length > 1)
      .map(term => term.toLowerCase());
    
    terms.forEach(term => relatedTerms.add(term));
  });

  return Array.from(relatedTerms).slice(0, 10); // 상위 10개만 반환
}

// YouTube 검색어 자동완성 API 함수 추가
async function getYouTubeSuggestions(keyword) {
  try {
    const response = await fetch(
      `/.netlify/functions/youtube-suggestions?keyword=${encodeURIComponent(keyword)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error('Suggestions API Error:', error);
    return [];
  }
}

// 매력도(Tension) 계산 함수 추가
function calculateTension(video) {
  const {
    viewCount,
    subscriberCount,
    likeCount,
    commentCount
  } = video;

  // 구독자 수 대비 조회수 비율
  const viewSubRatio = subscriberCount > 0 ? (viewCount / subscriberCount) : 0;
  // 조회수 대비 상호작용(좋아요 + 댓글) 비율
  const engagementRatio = viewCount > 0 ? ((likeCount + commentCount) / viewCount) : 0;

  // 종합 매력도 점수 (0-100)
  return Math.min(100, (viewSubRatio * 50) + (engagementRatio * 50));
}

// 매력도 등급 계산
function getTensionLevel(tension) {
  if (tension >= 80) return { level: '매우 높거움', color: '#FF4444' };
  if (tension >= 60) return { level: '뜨거움', color: '#FF8C00' };
  if (tension >= 40) return { level: '적정', color: '#FFD700' };
  if (tension >= 20) return { level: '미온', color: '#98FB98' };
  return { level: '차가움', color: '#87CEEB' };
}

export async function analyzeKeyword(keyword) {
  try {
    const [searchResults, suggestions] = await Promise.all([
      searchYouTubeVideos(keyword).catch(error => {
        console.error('YouTube search failed:', error);
        return [];
      }),
      getYouTubeSuggestions(keyword).catch(error => {
        console.error('Suggestions failed:', error);
        return [];
      })
    ]);

    if (searchResults?.length > 0) {
      let videoAnalyses = await Promise.all(
        searchResults.map(async (video) => {
          try {
            const analysis = await analyzeYouTubeData(video.id.videoId);
            if (!analysis) return null;

            const tension = calculateTension({
              viewCount: analysis.video.viewCount || 0,
              subscriberCount: analysis.channel.subscriberCount || 0,
              likeCount: analysis.video.likeCount || 0,
              commentCount: analysis.video.commentCount || 0
            });

            const tensionInfo = getTensionLevel(tension);
            return {
              metrics: {
                subscriberViewRatio: analysis.metrics.subscriberViewRatio || 'N/A',
                viewLikeRatio: analysis.metrics.viewLikeRatio || 'N/A',
                viewCommentRatio: analysis.metrics.viewCommentRatio || 'N/A'
              },
              video: {
                title: video.snippet.title,
                viewCount: analysis.video.viewCount || 0,
                likeCount: analysis.video.likeCount || 0,
                commentCount: analysis.video.commentCount || 0,
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`
              },
              channel: {
                title: video.snippet.channelTitle,
                subscriberCount: analysis.channel.subscriberCount || 0
              },
              thumbnail: video.snippet.thumbnails.medium.url,
              tension,
              tensionLevel: tensionInfo.level,
              tensionColor: tensionInfo.color
            };
          } catch (error) {
            console.error(`Analysis failed for video ${video.id.videoId}:`, error);
            return null;
          }
        })
      );

      // null 값 제거 및 정렬
      videoAnalyses = videoAnalyses
        .filter(Boolean)
        .sort((a, b) => (b.tension || 0) - (a.tension || 0));

      return {
        keyword,
        suggestedKeywords: suggestions?.slice(0, 10) || [],
        youtubeData: videoAnalyses
      };
    }

    return {
      keyword,
      suggestedKeywords: [],
      youtubeData: []
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
    if (!videoDetails) {
      throw new Error('비디오 정보를 찾을 수 없습니다.');
    }
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