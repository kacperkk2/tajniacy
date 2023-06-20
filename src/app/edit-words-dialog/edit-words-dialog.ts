import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Word } from '../app.component';
import { HttpClientService, WordsDto } from '../http-client.service';
import { InfoDialog } from '../info-dialog/info-dialog';
import { AddNewWordsDialog } from '../add-new-words-dialog/add-new-words-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'edit-words-dialog',
  templateUrl: 'edit-words-dialog.html'
})
export class EditWordsDialog {
    wordsInUse: number = 0;
    
    constructor(
        public dialogRef: MatDialogRef<EditWordsDialog>,
        @Inject(MAT_DIALOG_DATA) public words: Word[],
        private httpClient: HttpClientService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar) {}

    
    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.words.sort((a,b) => (a.word > b.word) ? 1 : ((b.word > a.word) ? -1 : 0));
        this.wordsInUse = this.words.filter(word => word.inUse).length;
    }

    onReset() {
        const message = "Czy na pewno chcesz nadpisać bieżące hasła domyślnymi?"
        const dialogRef = this.dialog.open(ConfirmDialog, {data: message, autoFocus: false});
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.httpClient.resetWords().subscribe(result => {
                this.httpClient.getWords().subscribe((wordsDto: WordsDto) => {
                    if (wordsDto) {
                        this.words = wordsDto.words;
                        this.initData();
                    }
                });
            })
          }
        });
    }

    openSnackBar(msg: string) {
        this._snackBar.open(msg, 'Zamknij', {
            duration: 3000,
        });
    }

    toggle(word: Word) {
        word.inUse = !word.inUse;
        this.wordsInUse += word.inUse ? 1 : -1; 
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    onSave() {
        if (this.wordsInUse < 25) {
            this.dialog.open(InfoDialog, {data: "W użyciu nie może być mniej niż 25 haseł"});
            return;
        }
        const message = "Czy na pewno chcesz zapisać?"
        const dialogRef = this.dialog.open(ConfirmDialog, {data: message, autoFocus: false});
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.dialogRef.close(this.words);
          }
        });
    }

    onDeleteUnused() {
        if (this.wordsInUse < 25) {
            this.dialog.open(InfoDialog, {data: "W użyciu nie może być mniej niż 25 haseł"});
            return;
        }
        const message = "Czy na pewno chcesz usunąć nieużywane hasła?"
        const dialogRef = this.dialog.open(ConfirmDialog, {data: message, width: '90%', maxWidth: '650px', autoFocus: false});
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const prevLength = this.words.length;
            this.words = this.words.filter(word => word.inUse);
            this.openSnackBar("Usuniętych haseł: " + (prevLength - this.words.length))
          }
        });
    }

    onAddNew() {
        const dialogRef = this.dialog.open(AddNewWordsDialog, {width: '100%', autoFocus: false});
        dialogRef.afterClosed().subscribe((words: string[]) => {
            if (words) {
                words.forEach(word => this.words.push({"word": word.toUpperCase(), "inUse": true}));
                this.initData();
                this.openSnackBar("Dodanych haseł: " + (words.length))
            }
        });
    }

    onCheckAll() {
        this.words.forEach(word => word.inUse = true);
        this.wordsInUse = this.words.length;
    }

    onUncheckAll() {
        this.words.forEach(word => word.inUse = false);
        this.wordsInUse = 0;
    }
}