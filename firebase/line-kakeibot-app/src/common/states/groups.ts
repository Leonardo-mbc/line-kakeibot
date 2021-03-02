export interface Group {
  enddate: string;
  name: string;
  users: string[];
}

export interface Groups {
  [key: string]: Group;
}
