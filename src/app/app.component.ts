import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EditWordsDialog } from './edit-words-dialog/edit-words-dialog';
import { HttpClientService, WordsDto } from './http-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tiles: Tile[] = [];
  isLeader: boolean = false;
  redLeft: number = 0;
  blueLeft: number = 0;
  currentGameName: string = "";
  areClickedHidden: boolean = false;
  secondsFromLastClick: number = 0;
  secondsThisGame: number = 0;
  clickedInThisGame: number = 0;

  constructor(private httpClient: HttpClientService, private dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isLeader = false;
    this.redLeft = 0;
    this.blueLeft = 0;
    this.secondsThisGame = 0;
    this.secondsFromLastClick = 0;
    this.clickedInThisGame = 0;
    setInterval(() => {
      this.fetchTiles();
    }, 1000);
    setInterval(() => {
      this.secondsFromLastClick++;
    }, 1000);
    setInterval(() => {
      this.secondsThisGame++;
    }, 1000);
  }

  editWords() {
    this.httpClient.getWords().subscribe((wordsDto: WordsDto) => {
      if (wordsDto) {
        const dialogRef = this.dialog.open(EditWordsDialog, {data: wordsDto.words, width: '100vw'});
        dialogRef.afterClosed().subscribe(words => {
          if (words) {
            this.httpClient.saveWords(words).subscribe();
          }
        });
      }
    });
  }

  openSnackBar() {
    const msg = 'Czas gry: ' + this.formatTime(this.secondsThisGame) + 
      '. Czas od ostatniego ruchu: ' + this.formatTime(this.secondsFromLastClick);
    this._snackBar.open(msg, 'Zamknij', {
      duration: 3000,
      panelClass: ['mat-toolbar']
    });
  }

  formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds  % 60;
    return (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs)
  }

  fetchTiles() {
    this.httpClient.getRoundInfo().subscribe(roundInfo => {
      if (roundInfo.gameName != this.currentGameName) {
        this.clickedInThisGame = 0;
        this.secondsFromLastClick = 0;
        this.secondsThisGame = 0;
        this.isLeader = false;
        this.currentGameName = roundInfo.gameName;
      }
      roundInfo.tiles.forEach(tile => tile.color = Color[tile.color as keyof typeof Color]);
      this.tiles = roundInfo.tiles;
      this.redLeft = this.tiles.filter(tile => tile.color == Color.RED && !tile.clicked).length;
      this.blueLeft = this.tiles.filter(tile => tile.color == Color.BLUE && !tile.clicked).length;
      const clickedTiles = this.tiles.filter(tile => tile.clicked).length;
      if (clickedTiles != this.clickedInThisGame) {
        this.secondsFromLastClick = 0;
        this.clickedInThisGame = clickedTiles;
      }
    });
  }

  leaderSwitch() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {data: "Na pewno chcesz zostać liderem?"});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLeader = true;
      }
    });
  }

  hideClicked() {
    this.areClickedHidden = !this.areClickedHidden;
  }

  getBorderColor(tile: Tile) {
    if (this.areClickedHidden && tile.clicked) {
      return '#282828';
    }
    else if (this.isLeader && tile.clicked) {
      return '0px 0px 0px 5px ' + tile.color + ' inset';
    }
    else {
      return 'none';
    }
  }

  getCardColor(tile: Tile) {
    if (this.areClickedHidden && tile.clicked) {
      return '#282828';
    }
    if (this.isLeader) {
      if (tile.clicked) {
        return '#282828';
      }
      else {
        return tile.color;
      }
    }
    else {
      if (tile.clicked) {
        return tile.color;
      }
      else {
        return "#ebd2a4";
      }
    }
  }

  getCardTextColor(tile: Tile) {
    if (this.areClickedHidden && tile.clicked) {
      return '#282828';
    }
    else if (!this.areClickedHidden && this.isLeader && tile.clicked) {
      return 'lightgrey';
    }
    else if (tile.color == Color.BLACK && tile.clicked && !this.isLeader) {
      return 'white';
    }
    else if (tile.color == Color.BLACK && !tile.clicked && this.isLeader) {
      return 'white';
    }
    else {
      return 'black';
    }
  }

  picked(tile: Tile) {
    if (this.isLeader && !tile.clicked) {
      const dialogRef = this.dialog.open(DialogContentComponent, {data: tile.text});

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.httpClient.pickTile(tile.text).subscribe();
        }
      });
    }
  }

  newGame() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {data: "Na pewno rozpocząć nową grę?"});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpClient.newGame().subscribe();
      }
    });
  }
}

export interface Tile {
  text: string;
  color: string;
  clicked: boolean;
}

export interface Word {
  word: string;
  inUse: boolean;
}

const Color = {
  "RED": "#f06a68",
  "BLUE": "lightblue",
  "BLANK": "#CDCDCD",
  "BLACK": "black"
}

@Component({
  selector: 'app-dialog-content',
  template: `
    <div fxLayout="column" fxLayoutAlign="space-around center" >
      <div mat-dialog-content>
        Na pewno zaznaczyć?
      </div>
      <div mat-dialog-content style="margin-top: 10px">
        {{word | uppercase}}
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Nie</button>
        <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Tak</button>
      </div>
    </div>
  `
})
export class DialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public word: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-content',
  template: `
    <div fxLayout="column" fxLayoutAlign="space-around center" >
      <div mat-dialog-content>
        {{text}}
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Nie</button>
        <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Tak</button>
      </div>
    </div>
  `
})
export class DialogConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public text: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}