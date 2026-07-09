import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sequenceValidator, trimValidator } from '../validators';
import { User } from '../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router : Router){}

    loginForm = new FormGroup({
      email : new FormControl('',sequenceValidator([Validators.required,Validators.email,trimValidator()])),
      password : new FormControl('',sequenceValidator([Validators.required,trimValidator()]))
    });

    onInput(){
      this.loginForm.get('email')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        const trimmedValue = value.trim(); 

        if (trimmedValue !== value) {
          this.loginForm.get('email')?.setValue(trimmedValue, {
            emitEvent: false,
          });
        }
      }
    });
    this.loginForm.get('password')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        const trimmedValue = value.trim(); 

        if (trimmedValue !== value) {
          this.loginForm.get('password')?.setValue(trimmedValue, {
            emitEvent: false,
          });
        }
      }
    });
    }
  
    onSubmit(){
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const isEmailTrue = users.some((u:User) => u.email === email);
      const isPassTrue = users.some((u:User) => u.password === password);
      if(!isEmailTrue){
        alert('Email is wrong!!');
        return;
      }
      if(!isPassTrue){
        alert('password is wrong!!');
        return;
      }
      const user = users.find((u:User) => u.email === email);
      user.isLoggedIn = true;
      localStorage.setItem('users',JSON.stringify(users));
      this.router.navigate(['/board'])
    }
}
