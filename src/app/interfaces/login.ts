export interface ILogin{
    username: string
    password:string
}

export interface IResLogin {
    estado: string,
    mensaje: string,
    token?: string
}