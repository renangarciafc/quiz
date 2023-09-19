// Model das respostas
export class  Answer {
    constructor(
        public question: string,
        public selectedAnswer: string,
        public correctAnswer: string
    ) {}
}

// Model das questões
export class  Question {
    constructor(
        public question: string,
        public correctAnswer: string,
        public options: Array<string>
    ) {}
}