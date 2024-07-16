import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'http://localhost:3000/translate';

  constructor(private http: HttpClient) {}

  translate(texts: string[], targetLang: string, sourceLang: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      text: texts,
      source_lang: sourceLang ? sourceLang.toUpperCase() : undefined, // Opcional, apenas incluir se sourceLang for fornecido
      target_lang: targetLang.toUpperCase(),
    };

    return this.http.post(this.apiUrl, body, { headers: headers });
  }
}