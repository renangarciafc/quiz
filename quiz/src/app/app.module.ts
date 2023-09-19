import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { AppReducer } from './store/app.state';
import { ResultsComponent } from './components/results/results.component';
import { StartComponent } from './components/start/start.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    QuizComponent,
    ResultsComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    [SweetAlert2Module.forRoot()],
    StoreModule.forRoot({reducer: AppReducer}),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
