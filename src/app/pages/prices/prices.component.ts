import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTarifasService } from '../../services/data-tarifas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent {

  tarifaService = inject(DataTarifasService)

  async updatePrice(tarifaABuscar: string) {
    const { value: newPrice } = await Swal.fire({
      title: "Actualizar Precio",
      input: "number",
      inputLabel: "Nuevo Precio",
      inputPlaceholder: "Ingrese el nuevo precio",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      background: '#1a1a1a', 
      color: '#ffffff',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return "Ingrese un valor numérico válido y mayor a 0";
        }
        return null;
      }
    });
  
    if (newPrice) {
      const result = await this.tarifaService.updatePrice(tarifaABuscar, Number(newPrice));
      if (result) {
        Swal.fire("Precio Actualizado", `El nuevo precio es $${newPrice}`, "success");
        this.tarifaService.loadPrices();
      } else {
        Swal.fire("Error", "No se pudo actualizar el precio", "error");
      }
    }
  }
  

}
