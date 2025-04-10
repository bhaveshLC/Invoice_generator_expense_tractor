import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/Auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup
  router = inject(Router)
  authService = inject(AuthService)
  isLoading: boolean = false
  constructor(
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      name: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }
  onSubmit() {
    this.isLoading = true

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false
          if (res.status == 'success') {
            this.router.navigate(['/login'])
          }
        }
        , error: (err) => {
          this.isLoading = false
          console.log(err)
        }
      })
    }
  }
}
