import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.less']
})
export class StartComponent {
  constructor(
    private router: Router
  ) {}

  // Inicia o jogo
  startQuiz() {
    // Altera a rota para a página do jogo
    this.router.navigate(['quiz']);
  }
}
