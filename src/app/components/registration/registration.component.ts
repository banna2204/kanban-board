import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trimValidator, sequenceValidator } from '../validators';
import { User } from '../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  constructor(private router: Router) {}

  registrationForm = new FormGroup({
    name: new FormControl('',sequenceValidator([Validators.required, trimValidator()]),),
    email: new FormControl('',sequenceValidator([Validators.required,Validators.email,    trimValidator(),
      ]),
    ),
    password: new FormControl('',sequenceValidator([Validators.required, trimValidator()]),),
  });
  onInput() {
    this.registrationForm.get('name')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        const trimmedValue = value.trim(); 

        if (trimmedValue !== value) {
          this.registrationForm.get('name')?.setValue(trimmedValue, {
            emitEvent: false,
          });
        }
      }
    });
    this.registrationForm.get('email')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        const trimmedValue = value.trim(); 

        if (trimmedValue !== value) {
          this.registrationForm.get('email')?.setValue(trimmedValue, {
            emitEvent: false,
          });
        }
      }
    });
    this.registrationForm.get('password')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        const trimmedValue = value.trim(); 

        if (trimmedValue !== value) {
          this.registrationForm.get('password')?.setValue(trimmedValue, {
            emitEvent: false,
          });
        }
      }
    });
  }

  onSubmit() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExist = users.some(
      (u: User) => u.email === this.registrationForm.get('email')?.value,
    );
    if (userExist) {
      alert('User already exist!!');
      return;
    }
    users.push(this.registrationForm.value);
    localStorage.setItem('users', JSON.stringify(users));
    alert('register successfully!!');
    this.router.navigate(['/']);
  }
}
