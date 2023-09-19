import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { QuizState, resetQuiz } from 'src/app/store/app.state';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent {
  constructor(
    private store: Store<{reducer: QuizState}>,
    private router: Router
  ) {}

  // Armazena a pontuação total do usuário
  score$ = this.store.select('reducer').
  pipe(
    map(e => e.score)
  )

  // Armazena a lista de respostas do usuário
  answerList$ = this.store.select('reducer').
      pipe(
        map(e => e.answerList)
      );

  // Volta para a página inicial
  goToHome() {
    this.store.dispatch(resetQuiz());
    this.router.navigate(['']);
  }
}
