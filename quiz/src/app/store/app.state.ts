import { createAction, createReducer, on, props } from "@ngrx/store";
import { Answer } from "../model/quiz-model";

// Model para o stado do quiz
export interface QuizState {
    score: number;
    selectAnswer: boolean;
    answerList: Array<Answer>
}

// Estado inicial do quiz
export const InitialQuizState: QuizState = {
    score: 0,
    selectAnswer: true,
    answerList: []
}

// Action para aumentar a pontuação do usuário
export const IncrasesScore = createAction('[quiz] Aumenta o score');

// Mapeamento do inicio de um novo jogo
export const resetQuiz = createAction('[Quiz] Inicia um novo jogo');

// Manipula os inputs das questões
export const selectAnswer = createAction('[quiz] Desabilita e habilita as opções');

//Armazena as respostas do usuário, junto com as perguntas e respostas corretas para cada questão
export const AddAnswered = createAction(
    '[quiz] Armazena as respostas do usuário',
    props<{ question: string; selectedAnswer: string, correctAnswer: string }>()
    );

// Reducer responsavel por armazenar a funcionalidade de cada Action
export const AppReducer = createReducer(
    InitialQuizState,
    on(resetQuiz, () => InitialQuizState),
    on(IncrasesScore, (state) => {

        state = {
            ...state,
            score: state.score + 1
        }
        return state;
    }),
    on(selectAnswer, (state) => {

        state = {
            ...state,
            selectAnswer: !state.selectAnswer
        }
        return state;
    }),
    on(AddAnswered, (state, { question, selectedAnswer, correctAnswer }) => {

        state = {
            ...state,
            answerList: [...state.answerList, new Answer(question, selectedAnswer, correctAnswer)]
        }

        return state;
    })
)