import { inject, Injectable } from '@angular/core';
import { IUsuario, UserByStorage } from '../interfaces/usuario';
import { ILogin, IResLogin } from '../interfaces/login';
import { IRegister } from '../interfaces/register';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {
  usuario: IUsuario | UserByStorage | undefined;
  router = inject(Router);

  constructor() {
    this.setUserByStorage();
   }


  async login(loginData: ILogin, remember: boolean) {
    const res = await fetch(environment.API_URL + "login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (res.status !== 200) return;

    const resJson: IResLogin = await res.json();

    if (!resJson.token) return;

    this.usuario = {
      username: loginData.username,
      token: resJson.token,
      esAdmin: false
    };

    
    if (remember) {
      sessionStorage.setItem("authToken", resJson.token);
      sessionStorage.setItem("username", this.usuario.username);
    } else {
      localStorage.setItem("authToken", resJson.token);
      localStorage.setItem("username", this.usuario.username);
    }

    await this.fetchUserDetails(loginData.username, resJson.token);
    return res;
  }

  private async fetchUserDetails(username: string, token: string) {
    const userDetailsRes = await fetch(environment.API_URL + `usuarios/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (userDetailsRes.status !== 200) {
      if (!this.usuario) {
        this.usuario = { username: '', token: '', esAdmin: false }; 
      } else {
        this.usuario.esAdmin = false
      }
    } else {
      const userDetailsResJson = await userDetailsRes.json();
      if (!this.usuario) {
        this.usuario = { username: '', token: token, esAdmin: true }; 
      }
      this.usuario.esAdmin = userDetailsResJson.esAdmin; 
  }}

  async register(registerData: IRegister) {
    const res = await fetch(environment.API_URL + 'register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    });

    if (res.status !== 201) return;
    return res;
  }

  clearToken() {
    this.usuario = undefined;
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken"); 
  }

  async setUserByStorage() {
    let token = localStorage.getItem("authToken");
    let username = localStorage.getItem("username");

    if (!token) {
      token = sessionStorage.getItem("authToken");
      username = sessionStorage.getItem("username");
      if (!token) return;
    }

    const cfg = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const res = await fetch(environment.API_URL + `usuarios/${username}`, cfg);
    if (res.ok) {
      const data = await res.json();
      this.usuario = { ...data, token }; 
      this.router.navigate(["/parking-state"]);
    }
  }
}