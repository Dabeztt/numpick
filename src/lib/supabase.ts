import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[Supabase] Chưa cấu hình PUBLIC_SUPABASE_URL hoặc PUBLIC_SUPABASE_ANON_KEY trong file .env. Bỏ qua lưu database.'
    );
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (err) {
    console.error('[Supabase] Khởi tạo Supabase client thất bại:', err);
    return null;
  }
}

export interface GameSeatRecord {
  player_name: string;
  seat_number: number;
  formula: string;
  cards?: string[];
}

/**
 * Lưu kết quả bốc ghế của người chơi vào bảng `game_results`
 */
export async function saveSeatResult(record: GameSeatRecord) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase.from('game_results').insert([
      {
        player_name: record.player_name,
        seat_number: record.seat_number,
        formula: record.formula,
        cards: record.cards ?? []
      }
    ]);

    if (error) {
      console.error('[Supabase] Lỗi khi lưu kết quả:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Đã lưu kết quả thành công:', record);
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Ngoại lệ khi lưu kết quả:', err);
    return { success: false, error: String(err) };
  }
}
