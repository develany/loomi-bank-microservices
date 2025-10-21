# Decisões Iniciais – Desafio Loomi

## 🔧 Tecnologias Escolhidas

### Core
- **Runtime**: Node.js com TypeScript
  - Tipagem forte
  - Melhor DX (Developer Experience)
  - Ecossistema rico em bibliotecas

### Persistência e Mensageria
- **PostgreSQL**
  - Banco relacional robusto
  - Suporte a JSON quando necessário
  - Transações ACID
  - Ótimo suporte a TypeORM/Prisma

- **RabbitMQ**
  - Message broker maduro e confiável
  - Suporte a diferentes padrões de mensageria
  - Boa documentação e comunidade ativa

### DevOps e Infraestrutura
- **Docker + Docker Compose**
  - Containerização consistente
  - Ambiente de desenvolvimento isolado
  - Fácil configuração de múltiplos serviços

### Qualidade e Documentação
- **Jest**
  - Framework de testes completo
  - Boa integração com TypeScript
  - Suporte a mocks e snapshot testing

- **Swagger/OpenAPI**
  - Documentação interativa das APIs
  - Geração automática de clients
  - Facilita testes e integração

## 🧱 Estrutura do Projeto

### Microsserviços

#### Users Service (`users-service`)
- Gestão de usuários/clientes
- Autenticação e autorização
- Perfis e preferências
- Dados pessoais e financeiros básicos

#### Transactions Service (`transactions-service`)
- Processamento de transações
- Histórico financeiro
- Relatórios e extratos
- Validações financeiras

## 💬 Comunicação entre Serviços

### Sincrona (HTTP)
- Consultas em tempo real
- Validações imediatas
- APIs REST com versionamento

### Assíncrona (RabbitMQ)
Eventos principais:
- `user.created` - Novo usuário registrado
- `user.updated` - Dados do usuário atualizados
- `transaction.created` - Nova transação registrada
- `transaction.status.updated` - Status da transação alterado

## 🎯 Estratégia de Implementação

1. **Fase 1: Users Service**
   - Setup inicial
   - CRUD básico
   - Autenticação
   - Testes unitários

2. **Fase 2: Transactions Service**
   - Estrutura básica
   - Operações CRUD
   - Validações financeiras
   - Testes unitários

3. **Fase 3: Integração**
   - Configuração RabbitMQ
   - Implementação de eventos
   - Testes de integração
   - Documentação API

## 📈 Próximos Passos

- [ ] Setup inicial do projeto
- [ ] Configuração do ambiente Docker
- [ ] Implementação do Users Service
- [ ] Implementação do Transactions Service
- [ ] Integração entre serviços
- [ ] Documentação completa
- [ ] Testes automatizados