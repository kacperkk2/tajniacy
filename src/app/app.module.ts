import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogConfirmComponent, DialogContentComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditWordsDialog } from './edit-words-dialog/edit-words-dialog';
import { InfoDialog } from './info-dialog/info-dialog';
import { AddNewWordsDialog } from './add-new-words-dialog/add-new-words-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';

@NgModule({
  declarations: [
    AppComponent,
    DialogContentComponent,
    DialogConfirmComponent,
    EditWordsDialog,
    InfoDialog,
    AddNewWordsDialog,
    ConfirmDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
