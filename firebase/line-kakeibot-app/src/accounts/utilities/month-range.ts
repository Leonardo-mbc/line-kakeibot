import dayjs from "dayjs";

/**
 * グループの月設定に基づいて、表示月に対応するカレンダー月の範囲を返す
 * 
 * @param displayMonth - 表示上の月 (例: "2025-01")
 * @param monthStartDay - 月の開始日 (1-28)
 * @returns カレンダー月の配列 (例: ["2025-01", "2025-02"])
 */
export function getMonthRange(
  displayMonth: string,
  monthStartDay: number = 1
): string[] {
  if (monthStartDay === 1) {
    // デフォルト（1日始まり）の場合は従来通り
    return [displayMonth];
  }
  
  // 例: displayMonth = "2025-01", monthStartDay = 25
  // → 実際の期間: 2025-01-25 ~ 2025-02-25（未満）
  
  const nextMonth = dayjs(displayMonth).add(1, "month").format("YYYY-MM");
  
  return [displayMonth, nextMonth];
}

/**
 * 日付が指定された表示月に属するかを判定
 * 
 * @param boughtAt - レシートの日付 (例: "2025-01-28 15:30:00")
 * @param displayMonth - 表示上の月 (例: "2025-01")
 * @param monthStartDay - 月の開始日 (1-28)
 * @returns 表示月に含まれる場合 true
 */
export function isInDisplayMonth(
  boughtAt: string,
  displayMonth: string,
  monthStartDay: number = 1
): boolean {
  const date = dayjs(boughtAt);
  
  if (monthStartDay === 1) {
    return date.format("YYYY-MM") === displayMonth;
  }
  
  // 例: displayMonth = "2025-01", monthStartDay = 25
  // → 2025-01-25 00:00:00 ~ 2025-02-25 00:00:00 の範囲
  
  const rangeStart = dayjs(`${displayMonth}-01`)
    .date(monthStartDay)
    .startOf("day");
    
  const rangeEnd = dayjs(`${displayMonth}-01`)
    .add(1, "month")
    .date(monthStartDay)
    .startOf("day");
  
  // isSameOrAfter の代わりに比較演算子を使用
  return (date.isAfter(rangeStart) || date.isSame(rangeStart)) && date.isBefore(rangeEnd);
}

/**
 * 月の範囲をフォーマットして表示用の文字列を返す
 * 
 * @param displayMonth - 表示上の月 (例: "2025-01")
 * @param monthStartDay - 月の開始日 (1-28)
 * @returns 期間表示文字列 (例: "1/25 ~ 2/24")
 */
export function formatMonthRange(
  displayMonth: string,
  monthStartDay: number = 1
): string | null {
  if (monthStartDay === 1) {
    return null; // デフォルトの場合は表示不要
  }
  
  const rangeStart = dayjs(`${displayMonth}-01`)
    .date(monthStartDay);
    
  const rangeEnd = dayjs(`${displayMonth}-01`)
    .add(1, "month")
    .date(monthStartDay)
    .add(-1, "day");
  
  return `${rangeStart.format("M/D")} ~ ${rangeEnd.format("M/D")}`;
}

