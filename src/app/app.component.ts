import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TileStyler } from '@angular/material/grid-list/tile-styler';
import { HttpClientService } from './http-client.service';

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

  constructor(private httpClient: HttpClientService, private dialog: MatDialog) { }

  ngOnInit() {
    this.isLeader = false;
    this.redLeft = 0;
    this.blueLeft = 0;
    this.httpClient.getRoundInfo().subscribe(roundInfo => {
      if (roundInfo.gameName != this.currentGameName) {
        this.isLeader = false;
        this.currentGameName = roundInfo.gameName;
      }
      roundInfo.tiles.forEach(tile => tile.color = Color[tile.color as keyof typeof Color]);
      this.tiles = roundInfo.tiles;
      this.redLeft = this.tiles.filter(tile => tile.color == Color.RED && !tile.clicked).length;
      this.blueLeft = this.tiles.filter(tile => tile.color == Color.BLUE && !tile.clicked).length;
    });
  }

  leaderSwitch() {
    this.isLeader = true;
  }

  hideClicked() {
    this.areClickedHidden = !this.areClickedHidden;
  }

  getCardColor(tile: Tile) {
    if (this.areClickedHidden && tile.clicked) {
      return 'white';
    }
    if (this.isLeader) {
      if (tile.clicked) {
        return 'grey';
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
        return "#FAEACB";
      }
    }
  }

  getCardTextColor(tile: Tile) {
    if (this.areClickedHidden && tile.clicked || tile.color == Color.BLACK && tile.clicked || tile.color == Color.BLACK && this.isLeader) {
      return 'white';
    }
    else {
      return 'black';
    }
  }

  picked(tile: Tile) {
    if (this.isLeader) {
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

const Color = {
  "RED": "#E55451",
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