# Loomi Bank Microservices

Sistema bancário baseado em microsserviços para gerenciamento de usuários e transações financeiras.

## 📋 Sobre o Projeto

O Loomi Bank é uma aplicação bancária modular construída com arquitetura de microsserviços, permitindo escalabilidade, manutenção simplificada e desenvolvimento independente de cada componente. O sistema é composto por dois serviços principais:

- **Users Service**: Gerenciamento de usuários, autenticação e dados pessoais
- **Transactions Service**: Processamento de transações financeiras e histórico

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express.js** (Users Service)
- **NestJS** (Transactions Service)
- **PostgreSQL** (Banco de dados relacional)
- **TypeORM** (ORM para PostgreSQL)
- **Redis** (Cache)
- **RabbitMQ** (Message broker para comunicação entre serviços)
- **Jest** (Framework de testes)
- **Swagger/OpenAPI** (Documentação de API)

### DevOps
- **Docker** e **Docker Compose** (Containerização)
- **Git** (Controle de versão)

## 🏗️ Arquitetura

O projeto segue uma arquitetura de microsserviços com comunicação síncrona (HTTP) e assíncrona (eventos via RabbitMQ):

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Users Service  │◄────►  Transactions   │
│                 │     │    Service      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   PostgreSQL    │     │    RabbitMQ     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

### Padrões de Projeto
- **Repository Pattern**: Abstração da camada de dados
- **Service Layer**: Lógica de negócios encapsulada
- **DTO Pattern**: Transferência de dados entre camadas
- **Dependency Injection**: Inversão de controle
- **Event-Driven Architecture**: Comunicação assíncrona entre serviços

## 🛠️ Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Node.js (v18+)
- npm ou yarn

### Passos para Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/develany/loomi-bank-microservices.git
   cd loomi-bank-microservices
   ```

2. **Instale as dependências**
   ```bash
   npm install
   cd users-service && npm install
   cd ../transactions-service && npm install
   cd ..
   ```

3. **Inicie os serviços com Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Acesse os serviços**
   - Users Service: http://localhost:3001
   - Transactions Service: http://localhost:3002
   - RabbitMQ Management: http://localhost:15672 (usuário: loomibank, senha: loomibank123)

## 🧪 Testes

Execute os testes com o comando:

```bash
npm test
```

Para testes com cobertura:

```bash
npm run test:cov
```

## 🤖 Ferramentas de IA Utilizadas

Durante o desenvolvimento deste projeto, foram utilizadas diversas ferramentas de IA para auxiliar no processo de desenvolvimento:

### 1. ChatGPT (OpenAI)
- **Uso principal**: Quebra de tarefas, planejamento do projeto e criação de cards para o Trello
- **Benefícios**: Ajudou a estruturar o projeto em etapas gerenciáveis e a criar uma visão clara do fluxo de trabalho

### 2. Claude (Anthropic)
- **Uso principal**: Criação da base do projeto, revisão de código, sugestões de branches e criação de testes
- **Benefícios**: Forneceu uma estrutura inicial sólida e ajudou a manter a qualidade do código através de revisões

## 📝 Exemplos de Prompts e Resultados

### Exemplo 1: Code Review
**Prompt utilizado**:
```
Faça uma revisão do código do git diff. Durante a revisão, considere os
seguintes princípios e práticas:
SOLID: Verifique se as classes e componentes seguem os princípios SOLID.
DRY: Identifique trechos de código duplicados e sugira maneiras de
refatorá-los para que o código não se repita.
Code Green: Avalie se o código é sustentável a longo prazo, considerando
sua legibilidade, a facilidade de adicionar novas funcionalidades e a
colaboração entre a equipe. Sugira maneiras de tornar o código mais
"verde".
Estrutura do Projeto: Avalie a estrutura do diretório e a organização dos
arquivos. Recomende como organizar melhor os componentes, estilos e
utilitários.
Desempenho: Verifique se existem oportunidades para otimizar a
performance do aplicativo, como melhorar a eficiência de consultas ao
banco de dados.
Testes: Comente sobre a cobertura de testes e recomende práticas de teste
adequadas, como testes de unidade e integração.
Legibilidade e Manutenibilidade: Avalie a clareza do código e forneça
sugestões para melhorar a legibilidade e a manutenibilidade (nomes de
variáveis, uso de comentários, etc.).
Boas Práticas Específicas do Express.js: Verifique a utilização de boas
práticas relacionadas ao framework e a linguagem de programação utilizada
```

**Resultado**: A IA forneceu uma análise detalhada do código, identificando problemas de acoplamento no serviço de usuários e sugerindo a implementação de interfaces para melhorar a injeção de dependências, além de recomendar melhorias na estrutura de tratamento de erros.

### Exemplo 2: Criação de Mensagens de Commit
**Prompt utilizado**:
```
Crie uma mensagem do git diff. No seguinte formato verbo(contexto): mensagem, 
por exemplo feat(storeBoard): mensagem. Não precisa ser muito grande a mensagem 
e deve ser em ingles
```

**Resultado**: A IA gerou mensagens de commit concisas e padronizadas como `feat(userService): add user profile update functionality` e `fix(transactionRepository): correct transaction history pagination`.

## 🧠 Decisões Tomadas com Base nas Sugestões da IA

1. **Arquitetura de Microsserviços**: A decisão de separar o sistema em serviços de usuários e transações foi reforçada pela análise da IA sobre escalabilidade e manutenção.

2. **Padrões de Projeto**: A implementação do Repository Pattern e Service Layer foi aprimorada após revisões de código da IA que identificaram problemas de acoplamento.

3. **Estratégia de Testes**: A abordagem de testes foi refinada com base nas sugestões da IA para aumentar a cobertura e focar em testes unitários para lógica de negócios crítica.

4. **Tratamento de Erros**: Foi implementada uma estrutura centralizada de tratamento de erros após a IA identificar inconsistências na manipulação de exceções.

5. **Comunicação entre Serviços**: A estratégia de comunicação assíncrona via eventos foi aprimorada com base nas análises da IA sobre os potenciais gargalos de desempenho.

## 📄 Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request