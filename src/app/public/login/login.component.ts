import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CtaComponent } from "../../shared/cta/cta.component";
import { Router } from '@angular/router';
import { AppPaths } from '../../app.routes';
import {AuthControllerService} from "../../api/api/authController.service";
import {LoginRequestDTO} from "../../model/loginRequestDTO";
import {JwtResponseDTO} from "../../api/model/jwtResponseDTO";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CtaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  errorMessage = signal('');
  hide = signal(true);
  appPaths = AppPaths;

  constructor(
      public router: Router,
      public authController: AuthControllerService
  ){
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.email));
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.password));
  }


  updateErrorMessage(fc: FormControl<string | null>) {
    if (fc.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (fc.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  performLogin() {
    if(this.email.invalid || this.password.invalid) {
      console.error('Invalid form');
      return;
    }
    let loginRequestDTO: LoginRequestDTO = {
        email: this.email.value!,
        password: this.password.value!
    }
    this.authController.authenticateUser(loginRequestDTO).subscribe((jwt: JwtResponseDTO) => {
        console.log('Logged in with token: ' + jwt.token);
        this.router.navigate([AppPaths.DASHBOARD]);
    })
  }
    
}
