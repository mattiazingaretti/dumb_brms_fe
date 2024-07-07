import { Component } from '@angular/core';
import { CtaComponent } from "../cta/cta.component";
import { Router } from '@angular/router';
import {AppPaths} from "../../app.routes"


@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    imports: [CtaComponent]
})
export class NavbarComponent {

    appPaths = AppPaths;
    
    constructor(public router: Router){

    }
}
