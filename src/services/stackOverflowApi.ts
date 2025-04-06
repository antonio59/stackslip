import { format } from 'date-fns';

const SO_API_BASE = 'https://api.stackexchange.com/2.3';

export interface StackOverflowUser {
  reputation: number;
  badge_counts: {
    gold: number;
    silver: number;
    bronze: number;
  };
  answer_count: number;
  question_count: number;
  creation_date: number;
  display_name: string;
  user_id: number;
  accept_rate?: number;
  tags?: string[];
  view_count: number;
  up_vote_count: number;
  down_vote_count: number;
  last_access_date: number;
  reputation_change_year: number;
  reputation_change_month: number;
  reputation_change_week: number;
}

export async function fetchUserData(usernameOrId: string): Promise<StackOverflowUser> {
  try {
    const isUserId = /^\d+$/.test(usernameOrId);
    // Use the working filter
    const filter = '!BTeL)VRhXdb1';
    let url: string;

    if (isUserId) {
      url = `${SO_API_BASE}/users/${usernameOrId}?site=stackoverflow&filter=${filter}`;
    } else {
      url = `${SO_API_BASE}/users?site=stackoverflow&filter=${filter}&inname=${encodeURIComponent(usernameOrId)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.error_message || `HTTP error! status: ${response.status}`}`);
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('User not found');
    }

    // For username search, find exact match or take first result
    const user = isUserId ? data.items[0] : 
      data.items.find((item: any) => 
        item.display_name.toLowerCase() === usernameOrId.toLowerCase()
      ) || data.items[0];

    if (!user) {
      throw new Error('Invalid user data received');
    }

    return {
      reputation: user.reputation || 0,
      badge_counts: {
        gold: user.badge_counts?.gold || 0,
        silver: user.badge_counts?.silver || 0,
        bronze: user.badge_counts?.bronze || 0,
      },
      answer_count: user.answer_count || 0,
      question_count: user.question_count || 0,
      creation_date: user.creation_date || 0,
      display_name: user.display_name || 'Unknown User',
      user_id: user.user_id || 0,
      accept_rate: user.accept_rate,
      view_count: user.view_count || 0,
      up_vote_count: user.up_vote_count || 0,
      down_vote_count: user.down_vote_count || 0,
      last_access_date: user.last_access_date || 0,
      reputation_change_year: user.reputation_change_year || 0,
      reputation_change_month: user.reputation_change_month || 0,
      reputation_change_week: user.reputation_change_week || 0,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function fetchUserTags(userId: number): Promise<string[]> {
  try {
    const url = `${SO_API_BASE}/users/${userId}/tags?site=stackoverflow&order=desc&sort=popular&pagesize=5`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error_message || `HTTP error! status: ${response.status}`}`);
    }

    if (!data.items) {
      return [];
    }

    return data.items.map((tag: any) => tag.name);
  } catch (error) {
    console.error('Error fetching user tags:', error);
    return [];
  }
}