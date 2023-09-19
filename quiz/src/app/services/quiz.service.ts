import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private http: HttpClient
  ) { }

  // Filtra as perguntas de nivel facil
  getEasyQuestions() {
    let url = 'https://opentdb.com/api.php?amount=4&category=9&difficulty=easy&type=multiple'

    return this.http.get(url);
  }

  // Filtra as perguntas de nivel médio
  getMediumQuestions() {
    let url = 'https://opentdb.com/api.php?amount=4&category=9&difficulty=medium&type=multiple'

    return this.http.get(url);
  }

  // Filtra as perguntas de nivel dificil
  getHardQuestions() {
    let url = 'https://opentdb.com/api.php?amount=4&category=23&difficulty=hard&type=multiple'

    return this.http.get(url);
  }
}
