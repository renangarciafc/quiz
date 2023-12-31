# quiz

# Importante
- Rode o comando ``npm install --force`` para baixar as dependências necessárias para executar o projeto.
- Rode o comando ``ng s -o`` dentro do repositório do aplicativo para executar e abrir a aplicação.


# Regras do Jogo
- Ao iniciar a partida, você começa com um saldo de 60 segundos para responder a 12 perguntas.
- A cada pergunta respondida um bônus de 5 segundos é adicionado ao seu tempo.
- Um simbolo de ``X`` aparece ao lado das respostas erradas selecionadas.
- Um simbolo de check aparece ao lado das respostas corretas.
- O botão responsável por avançar para a próxima questão fica desabilitado até que uma opção seja selecionada.
- O tempo é pausado toda vez que uma pergunta é respondida, e retomado com o avanço para a próxima questão.
- A dificuldade das perguntas aumenta de acordo com seu progresso no jogo, assim como o valor do bônus.
- Se seu tempo acabar é encerrado o jogo e você será redirecionado para a tela de resultados, onde poderá consultar seu progresso.
- Ao responder todas as perguntas, você será redirecionado para a tela de resultados, onde terá acesso a sua pontuação e ao histórico de perguntas.
- Após o termino do jogo, será possivel iniciar um outro.


# Considerações sobre o desenvolvimento

- Eu dei preferência a diversificação no desenvolvimento desta aplicação, para que assim eu pudesse utilizar o máximo de funcionalidades possiveis que o Angular nos permite e para que vocês tenham mais critérios para me avaliar, por conta disso pode não haver padronização em algumas partes do código mas isto foi proposital.
- Eu fiz a comunição entre o componente de questões com o componente principal utilizando ``@Input()``, ``@Output()`` e ``EventEmitter`` fazendo desnecessário o uso do mapeamento de estado feito pelo ``NGRX``. Ainda assim, é possível acompanhar todos os passos de ação do usuário atraves do ``Redux DevTools``, além disso, eu fiz a utilização desses dados em alguns momentos para que vocês tenham uma noção de como eu trabalho com outros métodos de desenvolvimento.
- É possível notar deformidades em algumas perguntas(a API retorna string quebradas em certos momentos), eu poderia tratar as string ou então trazer em base64 e converte-las para resolver o problema, no entanto, por ser em casos expecificos não considerei importante para a avaliação ao ponto de adicionar esta lógica a mais. Caso isto seja um problema eu posso corrigir.
  
