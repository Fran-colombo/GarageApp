import { IEstacionamiento } from "./estacionamiento";

export interface ICochera{
    id: number;
    descripcion: string;
    deshabilitada: number;
    eliminada: number;
    estacionamiento: IEstacionamiento | undefined;
}