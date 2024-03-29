import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptor } from './services/jwt-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './services/auth-guard.service';
import { MainComponent } from './components/main/main.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectService } from './services/project.service';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { DialogDeleteComponent } from './components/dialogs/dialog-delete/dialog-delete.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { SectionComponent } from './components/section/section.component';
import { DialogSectionComponent } from './components/dialogs/dialog-section/dialog-section.component';
import { SectionService } from './services/section.service';
import { TaskComponent } from './components/task/task.component';
import { DialogTaskComponent } from './components/dialogs/dialog-task/dialog-task.component';
import { TaskService } from './services/task.service';
import { NoteComponent } from './components/note/note.component';
import { NoteService } from './services/note.service';
import { DialogSettingsComponent } from './components/dialogs/dialog-settings/dialog-settings.component';
import { BackgroundService } from './services/background.service';
import { DialogUserComponent } from './components/dialogs/dialog-user/dialog-user.component';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavBarComponent,
    NewProjectComponent,
    ProjectListComponent,
    ProjectCardComponent,
    EditProjectComponent,
    DialogDeleteComponent,
    ProjectPageComponent,
    SectionComponent,
    DialogSectionComponent,
    TaskComponent,
    DialogTaskComponent,
    NoteComponent,
    DialogSettingsComponent,
    DialogUserComponent,
  ],
  entryComponents: [DialogDeleteComponent, DialogSectionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatRadioModule,
  ],
  providers: [
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    AuthGuardService,
    ProjectService,
    SectionService,
    TaskService,
    NoteService,
    BackgroundService,
    UserService,
    AlertService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
