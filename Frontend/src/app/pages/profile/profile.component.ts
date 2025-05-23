import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user/user.service';
import { ToastService } from '../../core/service/Toast/toast.service';
import { LoaderComponent } from "../../core/shared/loader/loader.component";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileLogo: string;
  address: Address;
}


@Component({
  selector: "app-profile",
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  user: any;
  isEdit: boolean = false;
  isLoading: boolean = false
  userForm: FormGroup;
  userService = inject(UserService);
  toastService = inject(ToastService)
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zip: ['', [Validators.required]]
      })
    });
  }
  isUploading: boolean = false
  ngOnInit() {
    this.isLoading = true
    this.userService.getSelf().subscribe((res: any) => {
      this.user = res.data.user;
      this.isLoading = false
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: {
          street: this.user.address?.street,
          city: this.user.address?.city,
          state: this.user.address?.state,
          country: this.user.address?.country,
          zip: this.user.address?.zip
        }
      });
    });
  }

  toggleEdit() {
    this.isEdit = true;
  }
  changeProfilePicture() {
    const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
    fileInput.click()
  }
  updateProfile() {
    if (this.userForm.valid && this.user) {
      this.isLoading = true
      this.userService.updateUser(this.userForm.value).subscribe({
        next: (res: any) => {
          this.user = res.data.user;
          this.isEdit = false;
          this.toastService.showAlert('success', 'Success', 'Profile updated successfully.')
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.toastService.showAlert('error', 'Error', err.error.message)
        },
        complete: () => {
          this.isLoading = false
        }
      });
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }
  cancelEdit() {
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: {
          street: this.user.address?.street,
          city: this.user.address?.city,
          state: this.user.address?.state,
          country: this.user.address?.country,
          zip: this.user.address?.zip
        }
      });
    }
    this.isEdit = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  updateProfilePicture(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true
      this.userService.updateUserProfile(file).subscribe({
        next: (res: any) => {
          this.user.profileLogo = res.data.url;
          this.toastService.showAlert('success', 'Success', 'Profile picture updated successfully.')
        },
        error: (err) => {
          console.error('Error updating profile picture:', err);
          this.toastService.showAlert('error', 'Error', err.error.message)
        },
        complete: () => {
          this.isUploading = false
        }
      });
    }
  }
}