import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../service/weather.service';
import { Geog, Weather } from '../../type';
import { FormsModule } from '@angular/forms';
import { MsgService } from '../../service/msg.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
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

  public isDisplaying = false;
  public isLoading = false;
  public isError = false;

  constructor(
    private weatherService: WeatherService,
    private msgService: MsgService
  ) {}

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
    this.weatherService.getGeogData(city).subscribe(
      (geog) => {
        // Only when the response is not empty array, update geogData
        if (geog.length > 0) {
          this.geogData = geog;
          console.log('Searching city: ', this.searchingText);
          console.log('City data: ', this.geogData);
        }
        this.isSearching = true;
      },
      (error) => {
        console.log('Error msg: ', error.message);
        this.msgService.openMsgModal('Error', [
          'Error! Please check console.',
          `${error.message}`,
        ]);
        this.isError = true;
      }
    );
  }
  searchWeather(
    name: string,
    country: string,
    lat: number,
    lon: number,
    state?: string,
    units?: string
  ): void {
    this.weatherService.getWeatherData(lat, lon, units).subscribe(
      (weather) => {
        this.weatherData = {
          name: name,
          state: state,
          country: country,
          ...weather,
        };
        console.log(`Weather data (units: ${this.units}): `, this.weatherData);

        // while weather information is displaying, msg modal won't pop up if user changes units, but pop up if user searches another city
        if (!this.isDisplaying || this.isSearching) {
          this.isLoading = true;
          setTimeout(() => {
            this.msgService.openMsgModal('Success', [
              'Success!',
              `${name} ( ${state ? state + ',' : ''} ${country} )`,
            ]);

            this.isLoading = false;
            this.isDisplaying = true;
            this.isSearching = false;
          }, 1500);
        }
      },
      (error) => {
        console.log('Error msg: ', error.message);
        this.msgService.openMsgModal('Error', [
          'Error! Please check console.',
          `${error.message}`,
        ]);
        this.isError = true;
      }
    );

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
    this.msgService.openMsgModal('Change', [`Change units to ${this.units}`]);
  }
}
