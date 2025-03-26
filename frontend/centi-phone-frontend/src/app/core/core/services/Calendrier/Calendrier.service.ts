import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/calendrier';

  constructor(private http: HttpClient) {}

  // Récupérer les créneaux disponibles pour une date donnée
  getAvailableSlots(date: string): Observable<Date[]> {
    return this.http.get<{ slots: string[] }>(`${this.apiUrl}/available-slots?date=${date}`)
      .pipe(map(res => res.slots.map(slot => new Date(slot))));
  }
}
