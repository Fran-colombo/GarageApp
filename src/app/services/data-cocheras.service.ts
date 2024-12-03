import { Inject, inject, Injectable } from '@angular/core';
import { ICochera } from '../interfaces/cochera';
import { IEstacionamiento } from '../interfaces/estacionamiento';
import { environment } from '../../environments/environment';
import { DataAuthService } from './data-auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataCocherasService {
  cocheras: ICochera[] = []
  estacionamientos: IEstacionamiento[] = []
  dataAuthService = Inject(DataAuthService)
  
  
  constructor() {
    this.loadData()
   }

  async loadData() {
    await this.getCocheras()
    await this.getEstacionamientos()
    this.asociarEstacionamientosConCocheras()
    
  }

  async getCocheras(){
    const res = await fetch(environment.API_URL+'cocheras',{
      headers: {
        authorization:'Bearer '+localStorage.getItem("authToken")
      },
    })
    if(res.status !== 200) return;
    const resJson: ICochera[] = await res.json();
    this.cocheras = resJson;
    return resJson;
  }

  async getEstacionamientos(){
    const res = await fetch(environment.API_URL+'estacionamientos',{
      headers: {
        authorization:'Bearer '+ localStorage.getItem("authToken")
      },
    })
    if(res.status !== 200) return;
    const resJson: IEstacionamiento[] = await res.json();
    this.estacionamientos = resJson;
  }

  
  asociarEstacionamientosConCocheras() {
    this.cocheras = this.cocheras.map(cochera => {
      const estacionamiento = this.estacionamientos.find(e => e.idCochera === cochera.id && e.horaEgreso == null)
      return {...cochera, estacionamiento}
    });
  }

  ultimoNumero = this.cocheras[this.cocheras.length-1]?.id || 0;
  
  async agregarCochera(nombreCochera:string){
    const cochera = {"descripcion" : nombreCochera};
    const res = await fetch(environment.API_URL+'cocheras',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+localStorage.getItem("authToken")
      },
      body: JSON.stringify(cochera)
    })
    if(res.status !== 200) {
      console.log("Error en la creacion de una nueva cochera")
    } else {
      console.log("Creacion de cochera exitosa")
      this.loadData();
    };
  }

  async borrarFila(index:number){
    const res = await fetch(environment.API_URL+`cocheras/${index}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+localStorage.getItem("authToken")
      }
    })
    if (res.status !== 200) {
      console.log('Error en la eliminacion de la cochera')
    } else {
      console.log('Cochera eliminada con exito')
      this.loadData()
    }
  }

  async deshabilitarCochera(idCochera:number){
    const res = await fetch(environment.API_URL+'cocheras/'+idCochera+'/disable',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+ localStorage.getItem("authToken")
      },
    })
    if(res.status === 200) {
      console.log("Cochera deshabilitada")
      this.loadData()
    } else {
      console.warn("Error deshabilitando cochera")
    };
  }

 
  async habilitarCochera(idCochera: number) {
    try {
        const res = await fetch(environment.API_URL + 'cocheras/' + idCochera + '/enable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('authToken')
            }
        });
        
        if (res.status === 200) {
            console.log("Cochera habilitada");
            this.loadData();
        } else {
            const errorMessage = await res.text();
            console.error("Error habilitando cochera:", errorMessage);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
async abrirEstacionamiento(patente: string, idUsuarioIngreso: string, idCochera: number) {
  const body = {patente, idUsuarioIngreso, idCochera};
  const res = await fetch(environment.API_URL+'estacionamientos/abrir',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization:'Bearer '+ localStorage.getItem("authToken")
    },
    body: JSON.stringify(body)
  })
  if(res.status !== 200) {
    console.log("Error en abrir estacionamiento")
  } else {
    console.log("Creacion de estacionamiento exitoso")
    this.loadData()
  };
}  
  async cerrarEstacionamiento(patente: string, idUsuarioEgreso: string) {
    const body = {patente, idUsuarioEgreso};
    const res = await fetch(environment.API_URL+'estacionamientos/cerrar',{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+localStorage.getItem("authToken")
      },
      body: JSON.stringify(body)
    })
    if(res.status !== 200) {
      console.log("Error en el cerrado del estacionamiento")
    } else {
      
      console.log("Cerrado del estacionamiento exitoso")
      this.loadData();
    };    
  }


}

