## Info

Este é um simples projeto criado com NextJs com a função de criar um convite virtual
para confirmação de convidados, neste caso foi utilizado para confirmação dos convidados de uma
festa de casamento, mas poderia ser utilizado para qualquer outro evento.

## Tecnologias

A base do projeto foi feita utilizando NextJs juntamente com typescript. Para estilização,
foi utilizado o chakra-ui, devido a sua facilidade e rapidez de se criar um projeto pequeno.
Como backend foi utilizado o Supabase SDK, que funciona como uma alternativa para o firebase,
porém como banco de dados utiliza Postgress o que torna muito mais facil o gerenciamento do banco.

## Instruções

- Faça uma o clone deste repositório e instale todas as dependências com o `yarn install`;
- Crie um arquivo `.env.local` com as seguintes informações:

```
  NEXT_PUBLIC_SUPABASE_KEY=`your supabase Api key`
  NEXT_PUBLIC_SUPABASE_URL=`your supabase Api URL`
```

- Crie uma tabela com o nome `guests` no seu projeto do Supabase com a seguinte estrutura:
  **Name**     | **Data Type** | **Format**
  id       | bigint    | int8
  check    | boolean   | bool
  familyId | bigint    | int8
  name     | text      | text

- Rode a aplicação local `yarn dev`
