import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Question } from 'src/app/model/quiz-model';
import { QuizService } from 'src/app/services/quiz.service';
import { AddAnswered, IncrasesScore, QuizState, selectAnswer } from 'src/app/store/app.state';
import Swal from 'sweetalert2';

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
  )

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
          'Não é uma tarefa fácil chegar até aqui com tempo no relógio, a partir de agora você terá 20s de acréscimo no relógio mas nem tudo são flores, o nível irá aumentar. Boa sorte!',
          'info'
        );

        this.bonus = 20;
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
    this.quizService.getEasyQuestions().subscribe({
      // Tratamento da msn de sucesso
      next: (response: any) => {
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

        // Faz a requisição de dificuldade média
        this.getMediumQuestions();
      },
      // Tratamento de erro
      error: (error) => {
        // Avisa ao usuário e retorna para a tela principal
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel filtrar as perguntas, tente iniciar o jogo novamente!',
          'warning'
        );

        console.error('Error on getEasyQuestions:', error);

        this.router.navigate(['']);
      }
    })
  }

  // Filtra as questões de nivel médio
  getMediumQuestions() {
    this.quizService.getMediumQuestions().subscribe({
      next: (response: any) => {
        response.results.forEach((question: any) => {
          this.questions.push(
            new Question(
              question.question,
              question.correct_answer,
              [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)// Adiciona a resposta correta na lista de resposta erradas e aplica um sort() para mistara-las
            )
          )
        });

        // Inicia o filtro de nivel dificil
        this.getHardQuestions();
      },
      error: (error) => {
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel filtrar as perguntas, tente iniciar o jogo novamente!',
          'warning'
        );

        console.error('Error on getMediumQuestions:', error);

        this.router.navigate(['']);
      }
    })
  }

  getHardQuestions() {
    this.quizService.getHardQuestions().subscribe({
      next: (response: any) => {
        response.results.forEach((question: any) => {
          this.questions.push(
            new Question(
              question.question,
              question.correct_answer,
              [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)// Adiciona a resposta correta na lista de resposta erradas e aplica um sort() para mistara-las
            )
          )
        });
      },
      error: (error) => {
        Swal.fire(
          'Algo deu errado',
          'Não foi possivel filtrar as perguntas, tente iniciar o jogo novamente!',
          'warning'
        );

        console.error('Error on getHardQuestions:', error);

        this.router.navigate(['']);
      }
    })
  }

  // Avança para a próxima questão
  nextQuestion() {
    // Ativa o timer
    this.resumeTimer();

    // Habilita os inputs
    this.store.dispatch(selectAnswer());

    // Caso não tenha mais perguntas a rota é alterada p/ a tela de resultados
    if(this.currentQuestionIndex + 1 === this.questions.length) {
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
          this.router.navigate(['/results']);
        }
      }
    }, 1000);
  }
}
