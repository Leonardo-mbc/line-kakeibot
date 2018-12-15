import { Group } from "./group";

export interface User {
  group: Group;
  loginId: string;
  name: string;
}
