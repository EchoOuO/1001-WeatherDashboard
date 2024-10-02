import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?`;

  private geogApiUrl = `http://api.openweathermap.org/geo/1.0/direct?`;

  constructor(private http: HttpClient) {}

  getWeatherData(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `${this.weatherApiUrl}lat=${lat}&lon=${lon}&appid=${environment.apiKey}`
    );
  }

  getGeogData(cityName: string, limit = 10): Observable<any> {
    return this.http.get(
      `${this.geogApiUrl}q=${cityName}&limit=${limit}&appid=${environment.apiKey}`
    );
  }
}
