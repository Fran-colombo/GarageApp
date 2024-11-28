import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { DataAuthService } from "../../services/data-auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authService = inject(DataAuthService);
  
  router = inject(Router);

  rememberMe = false; 
  errorLogin = false;
  async login(loginForm: NgForm){
    const {username, password} = loginForm.value;
    const loginData = {username, password};
    
    const res = await this.authService.login(loginData, this.rememberMe)

    if(res?.status === 200) this.router.navigate(['/parking-state']);
    
    else this.errorLogin = true, console.log(res?.status);
  }
}
