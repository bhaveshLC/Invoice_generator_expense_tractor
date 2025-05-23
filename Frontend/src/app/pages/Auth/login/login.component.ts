import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/Auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/service/Toast/toast.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router)
  toastService = inject(ToastService)
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.status === 'success') {
        this.toastService.showAlert('success', "Login Successful", '')
        localStorage.setItem('token', res.data.token)
        this.router.navigateByUrl('/dashboard')
      }
    }, (err) => {
      console.log(err)
      this.toastService.showAlert('error', "Error", err.error.message)
      // alert(err.error.message)
    })
  }
}
