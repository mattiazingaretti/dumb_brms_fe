import { Injectable } from '@angular/core';
import {AppPaths, LocalKeys} from "../../app.routes";
import {JwtResponseDTO} from "../../api/model/jwtResponseDTO";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  appPaths = AppPaths;

  constructor( public router: Router) {}


  isLoggedIn(): boolean {
    // Example: Check if a token exists in local storage
    return !!localStorage.getItem(LocalKeys.AUTH_TOKEN);
  }

  login(loginResp: JwtResponseDTO): void {
    localStorage.setItem(LocalKeys.AUTH_TOKEN, loginResp.token!);
    localStorage.setItem(LocalKeys.LOGGED_USER, JSON.stringify(loginResp));
  }

  logout(): void {
    localStorage.removeItem(LocalKeys.AUTH_TOKEN);
    localStorage.removeItem(LocalKeys.LOGGED_USER);
    this.router.navigate([this.appPaths.ROOT]);
  }


}
