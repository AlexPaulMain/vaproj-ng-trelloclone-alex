import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AbstractWebDriver } from 'protractor/built/browser';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;

  constructor(
    private formbuilder: FormBuilder,
    private authenticationService: AuthenticationService
    ) {
    this.myForm = formbuilder.group({
      username: ['alex', Validators.required],
      password: ['9ZmvnqK1G4rgPrTCJX', Validators.required]
    });

    this.username = this.myForm.controls['username'];
    this.password = this.myForm.controls['password'];
  }

  ngOnInit(): void {
  }

  onSubmit(loginCredentials: any): void {
    console.log('you submitted value: ', loginCredentials);
    this.authenticationService.login(loginCredentials)
    .subscribe(data => {
      if(data) {
        console.log("Valid times")
      }
    });
  }

}
