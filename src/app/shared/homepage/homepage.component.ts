import {Component, ElementRef, HostListener} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatButton,
    MatCardTitle,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  isLoggedIn: boolean = false;

  constructor(
      private elementRef: ElementRef,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn()
  }

  ngAfterViewInit(): void {
    this.addAnimations();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Trigger animations on scroll if needed
  }

  private addAnimations() {
    const sections = ['hero-section', 'features-section', 'genai-section', 'customers-section', 'about-section'];
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
              observer.unobserve(entry.target); // Stop observing once animation is applied
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    sections.forEach((section) => {
      const element = this.elementRef.nativeElement.querySelector(`.${section}`);
      if (element) {
        observer.observe(element);
      }
    });
  }
}
