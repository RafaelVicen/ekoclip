# EkoClip Secure Backend API

Backend seguro em Go para o projeto EkoClip, implementando validação server-side, proteção CSRF, rate limiting e outras medidas de segurança avançadas.

## 🛡️ Recursos de Segurança

### Proteções Implementadas

- **Rate Limiting**: 10 requisições por minuto por IP
- **Proteção CSRF**: Tokens obrigatórios para mutações
- **Validação de Entrada**: Sanitização e validação rigorosa
- **Headers de Segurança**: CSP, HSTS, X-Frame-Options, etc.
- **Limitação de Tamanho**: Máximo 1MB por requisição
- **Bloqueio de IP**: Detecção automática de atividades suspeitas
- **Logs de Segurança**: Monitoramento estruturado de violações

### Prevenção de Ataques

- **XSS (Cross-Site Scripting)**: Sanitização de entrada e headers seguros
- **CSRF (Cross-Site Request Forgery)**: Tokens obrigatórios
- **Injection Attacks**: Validação e sanitização de dados
- **DoS (Denial of Service)**: Rate limiting e limites de tamanho
- **Clickjacking**: X-Frame-Options: DENY
- **MIME Sniffing**: X-Content-Type-Options: nosniff

## 🚀 Instalação e Execução

### Pré-requisitos

- Go 1.21 ou superior
- Docker (opcional, para containerização)

### Inicialização Rápida

```bash
# Clone o repositório e navegue para o backend
cd backend

# Execute o script de inicialização
chmod +x init.sh
./init.sh
```

### Execução Manual

```bash
# Instalar dependências
go mod tidy

# Executar testes
go test -v

# Construir aplicação
go build -o bin/ekoclip-api

# Executar servidor
./bin/ekoclip-api
```

### Com Docker

```bash
# Construir imagem
docker build -t ekoclip-backend:latest .

# Executar container
docker run -p 8080:8080 ekoclip-backend:latest
```

### Com Docker Compose

```bash
# Executar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f ekoclip-api
```

## 📡 API Endpoints

### Health Check

```http
GET /api/v1/health
```

Retorna status da API e timestamp.

**Resposta:**

```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Obter Token CSRF

```http
GET /api/v1/csrf-token
```

Gera e retorna um token CSRF para proteção contra ataques CSRF.

**Resposta:**

```json
{
  "success": true,
  "data": {
    "csrf_token": "base64-encoded-token"
  }
}
```

### Formulário de Contato

```http
POST /api/v1/contact
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Corpo da Requisição:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "subject": "parceria_conteudo",
  "message": "Mensagem detalhada...",
  "csrf": "csrf-token"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso!"
}
```

### Pedido de Ebook

```http
POST /api/v1/ebook-order
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Corpo da Requisição:**

```json
{
  "ebook_name": "Nome do Ebook",
  "price": 25.0,
  "email": "cliente@example.com",
  "csrf": "csrf-token"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "message": "Pedido processado com sucesso!",
  "data": {
    "download_url": "/download/nome-do-ebook"
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 8080)
- `REDIS_PASSWORD`: Senha do Redis (para docker-compose)

### Configurações de Segurança

As configurações de segurança podem ser ajustadas no código fonte:

```go
config := SecurityConfig{
    RateLimitRequests: 10,           // Requisições por janela
    RateLimitWindow:   time.Minute,  // Janela de tempo
    CSRFSecretLength:  32,           // Tamanho do token CSRF
    MaxRequestSize:    1024 * 1024,  // Tamanho máximo da requisição
}
```

## 📊 Monitoramento

### Logs de Segurança

O sistema registra automaticamente violações de segurança:

```
SECURITY VIOLATION [HIGH]: Invalid CSRF Token - IP: 192.168.1.1 - POST /api/v1/contact - Invalid token format
SECURITY VIOLATION [MEDIUM]: Rate Limit Exceeded - IP: 192.168.1.1 - POST /api/v1/contact - Too many requests
```

### Health Check

```bash
curl http://localhost:8080/api/v1/health
```

### Métricas (Futuras Implementações)

- Contadores de requisições por endpoint
- Taxa de violações de segurança
- Performance e latência
- Uso de recursos

## 🧪 Testes

### Executar Testes

```bash
go test -v ./...
```

### Testes de Segurança

```bash
# Teste de rate limiting
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"test","message":"test"}'

# Teste de validação
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid","subject":"","message":""}'
```

## 🚀 Deploy

### Netlify Functions (Recomendado)

1. Copie os arquivos Go para `netlify/functions/`
2. Configure o `netlify.toml`:

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[functions.ekoclip-api]
  runtime = "go"
```

### Docker Production

```bash
docker build -t ekoclip-backend:latest .
docker run -d --name ekoclip-api -p 8080:8080 ekoclip-backend:latest
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ekoclip-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ekoclip-api
  template:
    metadata:
      labels:
        app: ekoclip-api
    spec:
      containers:
        - name: api
          image: ekoclip-backend:latest
          ports:
            - containerPort: 8080
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 1000
```

## 🔐 Boas Práticas de Segurança

### Desenvolvimento

- ✅ Validação server-side sempre
- ✅ Sanitização de todas as entradas
- ✅ Uso de prepared statements (para bancos de dados)
- ✅ Logs de segurança estruturados
- ✅ Princípio do menor privilégio

### Produção

- ✅ HTTPS obrigatório
- ✅ Headers de segurança configurados
- ✅ Rate limiting ativo
- ✅ Monitoramento contínuo
- ✅ Backups regulares

### Manutenção

- 🔄 Atualização regular de dependências
- 🔄 Revisão de logs de segurança
- 🔄 Testes de penetração periódicos
- 🔄 Monitoramento de vulnerabilidades

## 📝 Licença

Este projeto é parte do EkoClip - Portal da Cultura Angolana.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/seguranca-melhorada`)
3. Commit suas mudanças (`git commit -am 'Adiciona validação avançada'`)
4. Push para a branch (`git push origin feature/seguranca-melhorada`)
5. Abra um Pull Request

## 📞 Suporte

Para questões de segurança, entre em contato através do formulário de contato do site ou abra uma issue no repositório.
