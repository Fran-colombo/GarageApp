import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DataCocherasService } from '../../services/data-cocheras.service';
import { DataAuthService } from '../../services/data-auth.service';
import { DataTarifasService } from '../../services/data-tarifas.service';
import { ICochera } from '../../interfaces/cochera';
import { min } from 'rxjs';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  authService = inject(DataAuthService);
  dataTarifasService = inject(DataTarifasService);
  dataCocherasService = inject(DataCocherasService)
  cochera: ICochera [] = []
  

  preguntarAgregarCochera(){
    Swal.fire({
      title: "Nueva cochera?",
      showCancelButton: true,
      confirmButtonText: "Agregar",
      denyButtonText: `Cancelar`,
      input: "text",
      inputLabel: "Nombre cochera",
      background: '#1a1a1a', 
      color: '#ffffff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.dataCocherasService.agregarCochera(result.value)
      } else if (result.isDenied) {
      }
    });
  }
  preguntarBorrarCochera(cocheraId: number) {
    if(this.authService.usuario?.esAdmin == true){
    Swal.fire({
      title: "Eliminar cochera?",
      text: "No se va a recuperar!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      background: '#1a1a1a', 
      color: '#ffffff', 
      customClass: {
        popup: 'futurista-modal' 
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.borrarFila(cocheraId);
        Swal.fire({
        title: "¡Borrada!", 
        text: "La cochera ha sido eliminada.", 
        icon: "success",
        background: '#1a1a1a', 
        color: '#ffffff', 
        confirmButtonColor: "#3085d6"
      });
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    })};
  }
  
  

  preguntarDeshabilitarCochera(cocheraId: number){
    if(this.authService.usuario?.esAdmin == true){
    Swal.fire({
      title: "Deshabilitar cochera?",
      showCancelButton: true,
      confirmButtonText: "Deshabilitar",
      denyButtonText: `Cancelar`,
      background: '#1a1a1a', 
      color: '#ffffff'
    }).then(async (result) => {
      
      if (result.isConfirmed) {
        await this.dataCocherasService.deshabilitarCochera(cocheraId)
          Swal.fire({
          title: "La cochera ha sido deshabilitada con éxito!", 
          text: "La cochera ha sido deshabilitada.", 
          icon: "success",
          background: '#1a1a1a', 
          color: '#ffffff', 
          confirmButtonColor: "#3085d6"
        });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    })};
  }

  preguntarHabilitarCochera(cocheraId: number){
    if(this.authService.usuario?.esAdmin == true){
    Swal.fire({
      title: "Hablitar cochera?",
      showCancelButton: true,
      confirmButtonText: "Habilitar",
      denyButtonText: `Cancelar`,
            background: '#1a1a1a', 
      color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.habilitarCochera(cocheraId)
            Swal.fire({
            title: "La cochera ha sido habilitada con éxito!", 
            text: "La cochera ha sido habilitada.", 
            icon: "success",
            background: '#1a1a1a', 
            color: '#ffffff', 
            confirmButtonColor: "#3085d6"
          });
      } else if (result.isDenied) {
         Swal.fire("Changes are not saved", "", "info");
      }
    })};
  }


abrirEstacionamiento(idCochera: number) {
  const idUsuarioIngreso = "ADMIN";
  Swal.fire({
    title: "Abrir Cochera",
    html: `<input type="text" id="patente" class="swal2-input" placeholder="Ingrese patente">`,
    showCancelButton: true,
    confirmButtonText: "Abrir",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      const patenteInput = document.getElementById("patente") as HTMLInputElement;
      if (!patenteInput || !patenteInput.value.trim()) {
        Swal.showValidationMessage("Por favor, ingrese una patente válida");
        return false;
      }

      const patenteIngresada = patenteInput.value.trim();
      const patenteOcupada = this.dataCocherasService.estacionamientos.find(
        (estacionamiento: any) =>
          estacionamiento.patente === patenteIngresada && estacionamiento.horaEgreso === null
      );

      if (patenteOcupada) {
        Swal.showValidationMessage(
          `La patente ${patenteIngresada} ya está ocupando una cochera activa.`
        );
        return false; 
      }

      return { patente: patenteIngresada };
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      const { patente } = result.value;
      await this.dataCocherasService.abrirEstacionamiento(patente, idUsuarioIngreso, idCochera);
      Swal.fire({
        icon: "success",
        title: "Cochera Abierta",
        text: "La cochera se abrió correctamente.",
      });
    }
  });
}


  cerrarEstacionamiento(cochera: ICochera) {
    const horario = cochera.estacionamiento?.horaIngreso;
    let fechaIngreso;
    let horasPasadas = 0; 
    let minutosPasados = 0; 
    let patente: string;
    let tarifaABuscar: string;
    let total;
    let tot;

    if (horario) {
        fechaIngreso = new Date(horario);

        if (fechaIngreso) {
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaActual.getTime() - fechaIngreso.getTime();
            horasPasadas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60));
            minutosPasados = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
        }

        patente = cochera.estacionamiento?.patente!;

        const totalMinutos = horasPasadas * 60 + minutosPasados;
        if (totalMinutos <= 30) {
            tarifaABuscar = "MEDIAHORA";
        } else if (totalMinutos <= 60) {
            tarifaABuscar = "PRIMERAHORA";
        } else {
            tarifaABuscar = "VALORHORA";
        }
/*tirar un if total = undefined, sino que siga*/
total = this.dataTarifasService.tarifas.find(t => t.id === tarifaABuscar)?.valor;
const horaFormateada = fechaIngreso ? fechaIngreso.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  if(total == undefined){
    Swal.close();
  }
  else{
      tot = parseFloat(total)
  
    if (horasPasadas > 1){
        total = tot * (horasPasadas + (minutosPasados /  60));
      }
    }
    Swal.fire({
        html: `
            <div style="text-align: left;">
                <h4>Horario de inicio: ${horaFormateada}</h4>
                <h4>Tiempo transcurrido: ${horasPasadas} horas y ${minutosPasados} minutos</h4>
                <hr style="border: 1px solid #ccc;">
                <h2 style="margin: 20px 0 10px; text-align: center;">Total a cobrar</h2>
                <div style="background-color: #28a745; color: white; font-size: 24px; padding: 10px; border-radius: 5px; text-align: center; margin: 0 auto; display: block; width: fit-content;">
                $${ total}
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="cobrar" class="swal2-confirm swal2-styled" style="background-color: #007bff; padding: 10px 24px;">Cobrar</button>
                    <button id="volver" class="swal2-cancel swal2-styled" style="background-color: #aaa; padding: 10px 24px;">Volver</button>
                </div>
            </div>`,
        showConfirmButton: false,
        background: '#1a1a1a', 
        color: '#ffffff',
        didOpen: () => {
            const cobrarButton = document.getElementById('cobrar');
            const volverButton = document.getElementById('volver');
            
            if (cobrarButton) {
                cobrarButton.addEventListener('click', async () => {
                    const idUsuarioEgreso = "ADMIN";
                    await this.dataCocherasService.cerrarEstacionamiento(patente, idUsuarioEgreso);
                    this.dataCocherasService.habilitarCochera;
                    
                    Swal.close();
                });
            }
            
            if (volverButton) {
                volverButton.addEventListener('click', () => {
                    Swal.close();
                });
            }
        }
    });}}
  } 
