import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tile } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  baseUrl: string = "https://tajniacy-backend-production.up.railway.app"

  constructor(private http: HttpClient) { }

  getRoundInfo() {
    return this.http.get<RoundDto>(this.baseUrl + "/game");
  }

  newGame() {
    return this.http.post(this.baseUrl + "/game", null);
  }

  pickTile(tileName: string) {
    return this.http.post(this.baseUrl + "/tiles?tileName=" + tileName, null);
  }
}

export interface RoundDto {
  gameName: string;
  tiles: Tile[];
}