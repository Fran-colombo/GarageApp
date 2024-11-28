import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DataAuthService } from '../../services/data-auth.service';
import { IUsuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  // esAdmin = true;
  // authService = inject(DataAuthService);
  // router = inject(Router);
  authService = inject(DataAuthService);
  router = inject(Router);
  isSignoutMenuVisible: boolean = false; 

  usuario: IUsuario = {
    esAdmin: this.authService.usuario?.esAdmin ?? false, 
    username: this.authService.usuario?.username || '',
    token: this.authService.usuario?.token || '' 
  };

  toggleSignoutMenu(): void {
    this.isSignoutMenuVisible = !this.isSignoutMenuVisible; 
  }


  cerrarSesion(){
    this.authService.clearToken();
    this.router.navigate(['/login']);
    
  }
}
