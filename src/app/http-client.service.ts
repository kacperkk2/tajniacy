import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tile, Word } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  baseUrl: string = "https://tajniacy-backend-production.up.railway.app"

  constructor(private http: HttpClient) { }

  getRoundInfo() {
    return this.http.get<RoundDto>(this.baseUrl + "/game");
  }

  getWords() {
    return this.http.get<WordsDto>(this.baseUrl + "/words");
  }

  newGame() {
    return this.http.post(this.baseUrl + "/game", null);
  }

  resetWords() {
    return this.http.post(this.baseUrl + "/words/reset", null);
  }

  saveWords(words: Word[]) {
    return this.http.post(this.baseUrl + "/words", {words: words} );
  }

  pickTile(tileName: string) {
    return this.http.post(this.baseUrl + "/tiles?tileName=" + tileName, null);
  }
}

export interface RoundDto {
  gameName: string;
  tiles: Tile[];
}

export interface WordsDto {
  words: Word[];
}