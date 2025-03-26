import {Component, signal} from '@angular/core';
import {CtaComponent} from "../../shared/cta/cta.component";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppPaths} from "../../app.routes";
import {Router} from "@angular/router";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SignupRequestDTO} from "../../model/signupRequestDTO";
import {PostedResourceDTO} from "../../model/postedResourceDTO";
import {AuthControllerService} from "../../api/api/authController.service";

@Component({
  selector: 'app-signup',
  standalone: true,
    imports: [
        CtaComponent,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatSuffix,
        ReactiveFormsModule
    ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
    readonly email = new FormControl('', [Validators.required, Validators.email]);
    readonly username = new FormControl('', [Validators.required]);
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
        merge(this.username.statusChanges, this.username.valueChanges)
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.updateErrorMessage(this.username));
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


    performSignup() {
        if(this.email.invalid || this.username.invalid || this.password.invalid){
            console.error("Invalid form data");
            return;
        }
        let signupRequestDTO: SignupRequestDTO = {
            email: this.email.value!,
            username: this.username.value!,
            password: this.password.value!
        }
        this.authController.registerUser(signupRequestDTO).subscribe((p:PostedResourceDTO)=>{
            if(p.success){
                this.router.navigate([AppPaths.LOGIN]);
            }else{
                console.error("Failed to register user");
            }
        })
    }
}
