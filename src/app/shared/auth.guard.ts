import {inject, Injectable} from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import {AppPaths} from "../app.routes";
import {AuthService} from "./services/auth.service";

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean | UrlTree {
        if (this.authService.isLoggedIn()) {
            return true;
        } else {
            return this.router.createUrlTree([AppPaths.LOGIN]); // Redirect to login page
        }
    }
}

export const authGuard: CanActivateFn = () => {
    return inject(AuthGuard).canActivate();
};
