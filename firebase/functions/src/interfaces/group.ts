export interface Group {
  name: string;
  enddate: string;
  users: string[];
  monthStartDay?: number; // 1-28の範囲、デフォルトは1
}
