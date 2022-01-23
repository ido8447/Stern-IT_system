import { Customer } from "./customer";

export class User {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Roles: string[];
  CustomerName: string;
}
export class Role {
  Id: string;
  Name: string;
}
export class UserInfo {
  Id: string;
  Email: string;
  Roles: string[];
  CustomerId: number;
}
