import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSession } from 'src/app/models/user-session.model';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css'],
})
export class DialogUserComponent implements OnInit {
  editUserForm: FormGroup;
  userSession: UserSession = JSON.parse(localStorage.getItem('userSession'));

  constructor(
    private dialogRef: MatDialogRef<DialogUserComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.editUserForm = this.formBuilder.group({
      username: [this.userSession.username],
      first_name: [this.userSession.first_name, Validators.required],
      last_name: [this.userSession.last_name, Validators.required],
      email: [
        this.userSession.email,
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ],
      ],
      projects: [this.userSession.projects],
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.userService
      .updateUser(this.userSession.id, this.editUserForm.value)
      .subscribe((user) => {
        console.log('Updated user from api', user);
        this.userSession = { ...this.userSession, ...user };
        localStorage.setItem('userSession', JSON.stringify(this.userSession));
        this.alertService.addAlert('success', 'Updated User Details', 'Close');
      });
    this.dialogRef.close();
  }
}
