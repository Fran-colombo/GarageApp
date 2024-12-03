import { inject, Injectable } from '@angular/core';
import { DataCocherasService } from './data-cocheras.service';
import { IEstacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class DataEstacionamientosService {
  dataCocheraService = inject(DataCocherasService)
  ultimasTransacciones: IEstacionamiento[] = [];

  constructor() {
    this.getUltimasTransacciones();
   }

  // async getUltimasTransacciones(cantidad = 5) {
  //   if (!this.dataCocheraService.estacionamientos || this.dataCocheraService.estacionamientos.length === 0) {
  //     console.error("No hay estacionamientos disponibles");
  //   }

  //   const transaccionesFiltradas = this.dataCocheraService.estacionamientos.filter(estacionamiento => 
  //       estacionamiento.horaEgreso !== null && estacionamiento.horaEgreso !== undefined
  //   );
  //   console.log("Datos antes de ordenar:");
  //   transaccionesFiltradas.forEach(transaccion => {
  //     console.log({
  //       id: transaccion.id,
  //       horaIngreso: transaccion.horaIngreso,
  //       horaIngresoDate: new Date(transaccion.horaIngreso).toISOString(),
  //     });
  //   });
    
  //   const ultimasTransacciones = transaccionesFiltradas
  //       .sort((a, b) => new Date(b.horaIngreso.replace(" ", "T")).getTime() - new Date(a.horaIngreso.replace(" ", "T")).getTime())
  //       .slice(0, cantidad);

  //   this.ultimasTransacciones = ultimasTransacciones;
  // }
  async getUltimasTransacciones(cantidad = 6) {
    if (!this.dataCocheraService.estacionamientos || this.dataCocheraService.estacionamientos.length === 0) {
      console.error("No hay estacionamientos disponibles");
      return;
    }
  
    const transaccionesFiltradas = this.dataCocheraService.estacionamientos.filter(estacionamiento =>
      estacionamiento.horaEgreso !== null && estacionamiento.horaEgreso !== undefined
    );
  
    console.log("Datos antes de ordenar:");
    transaccionesFiltradas.forEach(transaccion => {
      console.log({
        id: transaccion.id,
        horaEgreso: transaccion.horaEgreso,
        horaEgresoDate: new Date(transaccion.horaEgreso).toISOString(),
      });
    });
  
    const ultimasTransacciones = transaccionesFiltradas
      .map(estacionamiento => ({
        ...estacionamiento,
        horaEgresoDate: new Date(estacionamiento.horaEgreso.replace(/[/]/g, "-")),
      }))
      .sort((a, b) => b.horaEgresoDate.getTime() - a.horaEgresoDate.getTime())
      .slice(0, cantidad);
  
    console.log("Datos ordenados:");
    ultimasTransacciones.forEach(transaccion => {
      console.log({
        id: transaccion.id,
        horaEgreso: transaccion.horaEgreso,
        horaEgresoDate: transaccion.horaEgresoDate,
      });
    });
  
    this.ultimasTransacciones = ultimasTransacciones.map(({ horaEgresoDate, ...resto }) => resto);
  }
  
}