import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-new-words-dialog',
  templateUrl: 'add-new-words-dialog.html'
})
export class AddNewWordsDialog {
    newWordsForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddNewWordsDialog>,
        public dialog: MatDialog
        ) {
        this.newWordsForm = new FormGroup({
            content: new FormControl("", [Validators.required])
        });
    }

    parseWords() {
        const newWordsContent = this.newWordsForm.get('content')!.value as string;
        let words = this.getWords(newWordsContent);
        this.dialogRef.close(words);
    }

    getWords(newWordsContent: string) {
        let words: string[] = []
        newWordsContent.split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .forEach(line => {
                line.split(" ")
                    .map(word => word.trim())
                    .filter(word => word.length > 0)
                    .forEach(word => words.push(word))
            });
        return words;
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}