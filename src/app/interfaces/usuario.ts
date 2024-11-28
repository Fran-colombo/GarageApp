export interface IUsuario{
    username: string,
    token: string,
    esAdmin : boolean
}
export interface UserByStorage {
    token: string;
    username: string;
    nombre: string;
    apellido: string;
    password: string;
    eliminado:boolean;
    esAdmin: boolean;
  }