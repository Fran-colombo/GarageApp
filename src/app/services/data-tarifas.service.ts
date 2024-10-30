import { inject, Injectable } from '@angular/core';
import { ITarifa } from '../interfaces/tarifa';
import { DataAuthService } from './data-auth.service';
import { environment } from '../../environments/environment';
import { IPrecios } from '../interfaces/precios';

@Injectable({
  providedIn: 'root'
})
export class DataTarifasService {
  tarifas: ITarifa[] = []
  authService = inject(DataAuthService);
  precios: IPrecios[] = []



  constructor() { 
    this.getTarifas()
    this.getPrices()
    this.loadPrices()
  }



  async getTarifas(){
    const res = await fetch(environment.API_URL+'tarifas',{
      headers: {
        authorization:'Bearer '+localStorage.getItem("authToken")
      },
    })
    if(res.status !== 200) {
      console.log("Error")
    } else {
      this.tarifas = await res.json();
    }
  }
  async getPrices(){
    const res = await fetch(environment.API_URL+'tarifas',{
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem("authToken")
      }
    }
    );
    if(res.status !== 200) return;
    const resJson: IPrecios[] = await res.json();
    this.precios = resJson;
  }

  async updatePrice(id:string, valor:number){
     const newPrice = {"valor": valor}
     const url = environment.API_URL+'tarifas/' + id;
     const res = await fetch(url, {
       method: 'PUT',
       headers: {
         'Content-type': 'application/json',
         authorization: 'Bearer ' + localStorage.getItem("authToken")
       },
       body: JSON.stringify(newPrice)
     }
     );
     if (res.status === 200) {
      return res.json(); 
    } else {
      console.error("Error al actualizar el precio:", res.status);
      return null;
    }

  }

  loadPrices() {
    this.getPrices();
}
}
