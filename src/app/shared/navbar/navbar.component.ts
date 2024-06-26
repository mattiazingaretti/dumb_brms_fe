import { Component } from '@angular/core';
import { CtaComponent } from "../cta/cta.component";

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    imports: [CtaComponent]
})
export class NavbarComponent {

}
