import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;

  constructor(
    private formbuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.myForm = formbuilder.group({
      username: ['alex', Validators.required],
      password: ['9ZmvnqK1G4rgPrTCJX', Validators.required],
    });

    this.username = this.myForm.controls.username;
    this.password = this.myForm.controls.password;
  }

  ngOnInit(): void {}

  onSubmit(loginCredentials: any): void {
    console.log('you submitted value: ', loginCredentials);
    this.authenticationService
      .login(loginCredentials)
      .subscribe((userSession) => {
        if (userSession) {
          console.log('Logged in successfully'),
            this.snackBar.open('Login Successful', 'Close', { duration: 3000 }),
            this.router.navigate(['/main']);
        }
      });
  }
}
