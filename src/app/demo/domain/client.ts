import { Mission } from "./mission";
import { User } from "./user";

export interface Client {
  id?: any;
  nom: any;
  adresse?: any;
  numero_telephone?: any;
  logo?: any;
  email: any;
  missions: Mission[];
  users: User[];

  }
  