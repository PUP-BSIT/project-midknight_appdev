import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private countriesUrl = 'assets/data/countries.json';
  private citiesUrl = 'assets/data/cities.json';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get(this.countriesUrl);
  }

  getCities(countryCode: string): Observable<any> {
    return this.http.get(this.citiesUrl);
  }
}
