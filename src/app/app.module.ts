import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CapitalizePipe } from './capitalize.pipe';
import { MatSelectModule } from '@angular/material/select';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    AddTaskComponent,
    CapitalizePipe,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DragDropModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }