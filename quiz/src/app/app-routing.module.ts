import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';
import { StartComponent } from './components/start/start.component';

const routes: Routes = [
  {path: 'quiz', component: QuizComponent},
  {path: '', component: StartComponent},
  {path: 'results', component: ResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
