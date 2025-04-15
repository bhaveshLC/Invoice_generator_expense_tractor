import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user/user.service';

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
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  user: any;
  isEdit: boolean = false;
  isLoading: boolean = false
  userForm: FormGroup;
  userService = inject(UserService);

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
          street: this.user.address.street,
          city: this.user.address.city,
          state: this.user.address.state,
          country: this.user.address.country,
          zip: this.user.address.zip
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
      this.userService.updateUser(this.userForm.value).subscribe({
        next: (res: any) => {
          this.user = res.data.user;
          this.isEdit = false;
        },
        error: (err) => {
          console.error('Error updating user:', err);
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
          street: this.user.address.street,
          city: this.user.address.city,
          state: this.user.address.state,
          country: this.user.address.country,
          zip: this.user.address.zip
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
}