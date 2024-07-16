import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { QuizState, selectAnswer } from 'src/app/store/app.state';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent {

  constructor(
    private store: Store<{reducer: QuizState}>
  ) {

  }
  // Recebe a questão atual do componente pai
  @Input() question!: string;

  // recebe as opções para resposta
  @Input() options!: string[];

  // Recebe a resposta correta
  @Input() correctAnswer!: string;

  // Responsável por emitir um evento ao componente pai toda vez que o usuário selecionar uma opção
  @Output() answerSelected = new EventEmitter<string>();

  // Armazena o valor atual do formulário
  selectedOption!: string;

  // Utilizado na manipulação do disabled de cada input
  selectAnswer$ = this.store.select('reducer').
  pipe(
    map(e => e.selectAnswer)
  );

  // Emite o evento do click ao componente pai e desabilita os inputs
  onSelect(optionSelected: string) {
    this.selectedOption = optionSelected;
    this.store.dispatch(selectAnswer());
    this.answerSelected.emit(this.selectedOption);
  }
}
