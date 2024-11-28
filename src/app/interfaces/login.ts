export interface ILogin{
    username: string
    password:string
}

export interface IResLogin {
    mensaje: string;
    status: string | number;
    token?: string;
    esAdmin: boolean;
}