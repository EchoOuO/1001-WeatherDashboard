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

  public units = 'imperial';
  public tempUnit = '℉';
  public tempDecimals = '2.1-1';
  public windSpeedUnit = 'mile/hr';

  constructor(private weatherService: WeatherService) {}

  resetUnit(): void {
    this.units = 'imperial';
    this.tempUnit = '℉';
    this.windSpeedUnit = 'mile/hr';
  }

  onSearchingCity(): void {
    if (!this.searchingText) {
      return;
    }

    if (this.searchingText.length > 2) this.searchGeog(this.searchingText);
  }
  searchGeog(city: string): void {
    this.weatherService.getGeogData(city).subscribe((geog) => {
      // Only when the response is not empty array, update geogData
      if (geog.length > 0) {
        this.geogData = geog;
        console.log('Searching city: ', this.searchingText);
        console.log('City data: ', this.geogData);
      }
    });
  }
  searchWeather(
    name: string,
    country: string,
    lat: number,
    lon: number,
    state?: string,
    units?: string
  ): void {
    this.weatherService.getWeatherData(lat, lon, units).subscribe((weather) => {
      this.weatherData = {
        name: name,
        state: state,
        country: country,
        ...weather,
      };
      console.log(`Weather data (units: ${this.units}): `, this.weatherData);
    });

    // when user select city by clicking then close searching area
    this.searchingText = '';
  }

  temperature_unit_C_to_F(temp: number): number {
    return (temp * 9) / 5 + 32;
  }

  temperature_unit_F_to_C(temp: number): number {
    return ((temp - 32) * 5) / 9;
  }

  onClickUnitsChange(): void {
    if (this.units === 'imperial') {
      this.units = 'metric';
      this.tempUnit = '℃';
      this.windSpeedUnit = 'm/s';

      this.searchWeather(
        this.weatherData.name,
        this.weatherData.country,
        this.weatherData.lat,
        this.weatherData.lon,
        this.weatherData.state,
        this.units
      );
    } else {
      this.units = 'imperial';
      this.tempUnit = '℉';
      this.windSpeedUnit = 'mile/hr';

      this.searchWeather(
        this.weatherData.name,
        this.weatherData.country,
        this.weatherData.lat,
        this.weatherData.lon,
        this.weatherData.state,
        this.units
      );
    }
  }
}
