import { Roles } from "../constants/Roles";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Roles;
  permissions: string[];
}

export interface getUserQuery {
  q?: string;
}
