export interface Group {
  enddate: string;
  name: string;
  users: string[];
  tags: string[];
  monthStartDay?: number; // 1-28の範囲、デフォルトは1
}
