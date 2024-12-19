import { createClient } from '@supabase/supabase-js';

// 개발 환경을 위한 기본값 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lofvjizltrcqythqavsf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZnZqaXpsdHJjcXl0aHFhdnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NjEyODMsImV4cCI6MjA1MDEzNzI4M30.Zkuk2cfmZPnrtLsRZAFAgKNmkRE504EPw-Yx-71TbBA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveSearch(data) {
  try {
    const { error } = await supabase
      .from('search_history')
      .insert([
        {
          user_id: data.userId,
          keyword: data.keyword,
          results: data.results,
        }
      ]);

    if (error) {
      console.error('Error saving search:', error);
      throw new Error('검색 기록을 저장하는데 실패했습니다.');
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

export async function getRecentSearches(userId) {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching searches:', error);
      throw new Error('검색 기록을 불러오는데 실패했습니다.');
    }

    return data || [];
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
} 