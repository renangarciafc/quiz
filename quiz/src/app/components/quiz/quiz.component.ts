import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { Question } from 'src/app/model/quiz-model';
import { QuizService } from 'src/app/services/quiz.service';
import { AddAnswered, IncrasesScore, QuizState, selectAnswer } from 'src/app/store/app.state';
import Swal from 'sweetalert2';
import { finalize, mergeMap, take } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.less']
})
export class QuizComponent {

  constructor(
    private store: Store<{reducer: QuizState}>,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    // Filtra as questões e inicia o timer
    this.getEasyQuestions();
    this.startTimer();
  }

  // Armazena as questões retornadas pela API
  questions: Array<Question> = [];

  // Variaveis responsaveis por manipular o timer
  timerInterval: any;
  remainingTime = 60;
  isTimerPaused = false;

  // Manipula o loading de filtro
  isLoading = false;

  // Valor do bonus em segundos para cada resposta respondida
  bonus: number = 5;

  // Armazena o index da pergunta atual
  currentQuestionIndex = 0;

  // Recebe o total de pontos diretamente do reducer
  score$ = this.store.select('reducer').
  pipe(
    map(e => e.score)
  );

  // Utilizado na manipulação do disabled do botão p/ avançar
  selectAnswer$ = this.store.select('reducer').
  pipe(
    map(e => e.selectAnswer)
  );

  // Função chamada toda vez que uma seleção é feita
  onAnswerSelected(answer: string) {

    // Avisa o usuário e altera os niveis de dificuldade de acordo com seu progresso
    switch (this.currentQuestionIndex) {
      // Altera o valor do bonus, avisa o usuário que o nivel aumentou
      case 3:
        Swal.fire(
          'Vamos deixar um pouco mais difícil?',
          'A partir de agora as perguntas serão um pouco mais dificeis e você terá um bônus de 7s a cada pergunta respondida.',
          'info'
        );

        this.bonus = 7;
        break;
      // Altera o valor do bonus, avisa o usuário que o nivel aumentou
      case 7:
        Swal.fire(
          'Parabéns!!!',
          'Não é uma tarefa fácil chegar até aqui com tempo no relógio, a partir de agora você terá 10s de acréscimo no relógio. Mas nem tudo são flores, o nível irá aumentar, Boa sorte!',
          'info'
        );

        this.bonus = 10;
        break;
      default:
        break;
    }

    // Pausa o timer e adiciona o bonus
    this.pauseTimer();

    // Armazena os dados necessários para mapeamento no NGRX
    let payload = {
      question: this.questions[this.currentQuestionIndex].question,
      selectedAnswer: answer,
      correctAnswer: this.questions[this.currentQuestionIndex].correctAnswer
    };

    // Atualiza as informações
    this.store.dispatch(AddAnswered(payload));

    // Armazena a questão atual
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Checa se a resposta do usuário esta correta
    if (answer === currentQuestion.correctAnswer) {
      // Aumenta a pontuação
      this.store.dispatch(IncrasesScore());
    }
  }

  // Filtra as questões de nivel facil
  getEasyQuestions() {
    // Ativa o loading
    this.isLoading = true;

    // Faz a requisição
    this.quizService.getEasyQuestions().pipe(
      take(1),
      mergeMap((response: any) => {
        // Desativa o loading
        this.isLoading = false;

        // Adiciona as questões na lista principal
        response.results.forEach((question: any) => {
          this.questions.push(
            new Question(
              question.question,
              question.correct_answer,
              [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5) // Adiciona a resposta correta na lista de resposta erradas e aplica um sort() para mistara-las
            )
          )
        });

        // Faz a requisição de dificuldade média e dificil
        let meddiumQuestions = new Promise((resolve, reject) => {
          setTimeout(() => {
            this.getMediumQuestions().toPromise().then((result: any) => {
              resolve(result);
            }).catch((error: any) => {
              reject(error);
            });
          }, 5000);
        });

        let hardQuestions = new Promise((resolve, reject) => {
          setTimeout(() => {
            this.getHardQuestions().toPromise().then((result: any) => {
              resolve(result);
            }).catch((error: any) => {
              reject(error);
            });
          }, 5000);
        });

        return forkJoin([hardQuestions, meddiumQuestions]);
      }),
      tap((response) => {
        // Adiciona as questões de dificuldade média e dificil na lista principal
        response.forEach((questions: any) => {
          questions.forEach((question: any) => {
            this.questions.push(question);
          });
        });
      }),
      finalize(() => {
        // Encerra o loading
        this.isLoading = false;
      }),
      catchError((error) => {
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel filtrar as perguntas, tente iniciar o jogo novamente!',
          'warning'
        );

        console.error('Error on getEasyQuestions:', error);

        this.router.navigate(['']);
        return of([]);
      })
    ).subscribe();
  }

  // Filtra as questões de nivel médio
  getMediumQuestions(): Observable<Question[]> {
    return this.quizService.getMediumQuestions().pipe(
      take(1),
      map((response: any) => response.results.map((question: any) => new Question(
        question.question,
        question.correct_answer,
        [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
      ))),
      catchError((error) => {
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel carregar as perguntas de dificuldade média',
          'warning'
        );
        console.error('Error on getMediumQuestions:', error);
        return of([]);
      }
      )
    );
  }

  getHardQuestions(): Observable<Question[]> {
    return this.quizService.getHardQuestions().pipe(
      map((response: any) => response.results.map((question: any) => new Question(
        question.question,
        question.correct_answer,
        [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
      ))),
      catchError((error) => {
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel carregar as perguntas de dificuldade dificil',
          'warning'
        );
        console.error('Error on getHardQuestions:', error);
        return of([]);
      }
      )
    );
  }

  // Avança para a próxima questão
  nextQuestion() {
    // Ativa o timer
    this.resumeTimer();

    // Habilita os inputs
    this.store.dispatch(selectAnswer());

    // Caso não tenha mais perguntas a rota é alterada p/ a tela de resultados
    if(this.currentQuestionIndex + 1 === this.questions.length) {
      this.pauseTimer();

      localStorage.setItem('totalQuestions', JSON.stringify(this.questions.length));

      this.router.navigate(['/results']);
    }

    // Altera a questão
    this.currentQuestionIndex++;
  }

  // Responsável por pausar o timer
  pauseTimer() {
    this.isTimerPaused = true;
    this.remainingTime += this.bonus;
  }

  // Rresponsavel por reativar o timer
  resumeTimer() {
    this.isTimerPaused = false;
  }

  // Inicia o timer
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isTimerPaused) {
        this.remainingTime--;

        if (this.remainingTime == 0) {
          this.pauseTimer();

          localStorage.setItem('totalQuestions', JSON.stringify(this.questions.length));

          this.router.navigate(['/results']);
        }
      }
    }, 1000);
  }
}
