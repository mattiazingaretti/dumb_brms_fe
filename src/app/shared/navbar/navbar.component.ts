import { Component } from '@angular/core';
import { CtaComponent } from "../cta/cta.component";
import { Router } from '@angular/router';
import {AppPaths, LocalKeys} from "../../app.routes"
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";


@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    imports: [CtaComponent, MatMenu, MatMenuItem, MatIconButton, MatIcon, MatMenuTrigger, NgIf, MatButton]
})
export class NavbarComponent {


    appPaths = AppPaths;

    constructor(
        public router: Router,
        public authService: AuthService
    ) {}

    get isLoggedIn(): boolean {
        return !!localStorage.getItem(LocalKeys.LOGGED_USER);
    }

    get username(): string {
        const user = localStorage.getItem(LocalKeys.LOGGED_USER);
        return user ? JSON.parse(user).username : '';
    }

    logout(): void {
        this.authService.logout()
    }

    navigateToSettings(): void {
        this.router.navigate([this.appPaths.SETTINGS]);
    }

    navigateToDashBoard() {
        this.router.navigate([this.appPaths.DASHBOARD]);
    }
}
