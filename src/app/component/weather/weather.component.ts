import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../service/weather.service';
import { Geog, Weather } from '../../type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  public geogData!: Geog[];
  public weatherData!: Weather;

  public isSearching = false;
  public searchingText = '';

  public tempUnit = '℃';

  constructor(private weatherService: WeatherService) {}

  onSearchingCity(): void {
    if (!this.searchingText) {
      return;
    }

    console.log('Searching city: ', this.searchingText);

    if (this.searchingText.length > 2) this.searchGeog(this.searchingText);
  }
  searchGeog(city: string): void {
    this.weatherService.getGeogData(city).subscribe((geog) => {
      // Only when the response is not empty array, update geogData
      if (geog.length > 0) {
        this.geogData = geog;
        console.log('City data: ', this.geogData);
      }
    });
  }
  searchWeather(
    name: string,
    country: string,
    lat: number,
    lon: number,
    state?: string
  ): void {
    this.weatherService.getWeatherData(lat, lon).subscribe((weather) => {
      this.weatherData = {
        name: name,
        state: state,
        country: country,
        ...weather,
      };
      console.log('Weather data: ', this.weatherData);
    });

    // when user select city by clicking then close searching area
    this.searchingText = '';
  }

  onClickTemp(): void {
    if (this.tempUnit === '℃') {
      this.weatherData.current.temp =
        (this.weatherData.current.temp * 9) / 5 + 32;
      this.tempUnit = '℉';
    } else {
      this.weatherData.current.temp =
        ((this.weatherData.current.temp - 32) * 5) / 9;
      this.tempUnit = '℃';
    }
  }
}
