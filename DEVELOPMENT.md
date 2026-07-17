# Carsties Development Guide

Complete development documentation for the Carsties microservices application. This guide covers setup, architecture, common issues, and development workflows.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Workflows](#development-workflows)
- [Troubleshooting](#troubleshooting)
- [Service Endpoints](#service-endpoints)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Docker Desktop** | Latest | Container runtime and orchestration | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Git** | 2.0+ | Version control | [git-scm.com](https://git-scm.com/) |
| **mkcert** | Latest | Local SSL certificate generation | [github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert) |
| **Node.js** | 18+ | Frontend development (optional) | [nodejs.org](https://nodejs.org/) |

**System Requirements:**
- RAM: Minimum 4GB (8GB+ recommended)
- Disk Space: ~5GB for Docker images and volumes
- Time: ~10-15 minutes for initial setup and build

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rakeshmaharaj/Carsties-2024.git
cd Carsties-2024
```

### 2. Verify Prerequisites

```bash
# Check Docker is running
docker --version
docker ps

# Check Git is available
git --version

# Check mkcert is installed
mkcert -version
```

### 3. Build Docker Images

```bash
docker compose build
```

✅ **Verification**: Run `docker images` to confirm all images are built
```bash
docker images | grep trycatchlearn
```

Expected output should show images for: auction-svc, search-svc, identity-svc, gateway-svc, bid-svc, notify-svc, web-app

### 4. Start Services

```bash
docker compose up -d
```

✅ **Verification**: Run `docker ps` to confirm all containers are running
```bash
docker ps --filter "status=running"
```

### 5. Generate SSL Certificates

```bash
# Install mkcert root certificate
mkcert -install

# Navigate to devcerts directory
cd devcerts

# Generate certificates for all local domains
mkcert -key-file carsties.local.key -cert-file carsties.local.crt \
  app.carsties.local api.carsties.local id.carsties.local

cd ..
```

✅ **Verification**: Check certificate files exist
```bash
ls -la devcerts/*.crt devcerts/*.key
```

### 6. Configure Local DNS (Hosts File)

Add the following entry to your system's hosts file:

**Linux/macOS**: `/etc/hosts`
**Windows**: `C:\Windows\System32\drivers\etc\hosts`

```
127.0.0.1 id.carsties.local app.carsties.local api.carsties.local
```

✅ **Verification**: Test DNS resolution
```bash
ping app.carsties.local
```

### 7. Access the Application

- **Web App**: https://app.carsties.local
- **API Gateway**: https://api.carsties.local
- **Identity Service**: https://id.carsties.local

---

## Architecture Overview

### Microservices Overview

This project follows a microservices architecture with the following core services:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx Proxy (Reverse Proxy)                  │
│           Handles SSL/TLS termination and routing                │
└───────────────────────────────────────────────────────────────────┘
                  │                          │                    │
        ┌─────────▼──────────┐  ┌───────────▼────────┐   ┌────────▼─────┐
        │    Gateway Service │  │ Identity Service   │   │   Web App    │
        │   (Port 7001/80)   │  │   (Port 80)        │   │  (Port 3000) │
        │   API Routing      │  │ Authentication     │   │   Next.js    │
        └────────┬───────────┘  └─────────┬──────────┘   └──────────────┘
                 │                        │
        ┌────────▼─────────────────────────▼──────────────────────┐
        │  RabbitMQ Message Broker (Port 5672, 15672 Admin)       │
        │              Async Communication                        │
        └────────────────────────┬───────────────────────────────┘
                                 │
        ┌────────────────────────┼──────────────────────────────────┐
        │                        │                                 │
   ┌────▼─────────┐  ┌──────────▼────────┐  ┌──────────┬──────────▼──┐
   │ Auction Svc  │  │  Search Service   │  │  Bid Svc │ Notify Svc  │
   │ (Port 7777)  │  │   (Port 7002)     │  │Port 7003 │  (Port 7004)│
   │ PostgreSQL   │  │   MongoDB         │  │MongoDB   │ RabbitMQ    │
   └──────────────┘  └───────────────────┘  └──────────┴─────────────┘
```

### Service Responsibilities

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| **Gateway Service** | 7001 | — | API Gateway, request routing, authentication |
| **Auction Service** | 7777 | PostgreSQL | Auction management, core business logic |
| **Search Service** | 7002 | MongoDB | Search and indexing functionality |
| **Identity Service** | 80 | PostgreSQL | Authentication, user management |
| **Bidding Service** | 7003 | MongoDB | Bid management and processing |
| **Notification Service** | 7004 | — | User notifications, real-time updates |
| **Web App** | 3000 | — | Next.js frontend application |

### Communication Patterns

- **Synchronous**: Direct HTTP/gRPC calls between services
- **Asynchronous**: RabbitMQ message bus for event-driven communication
- **Protocol**: gRPC for auction-bid service communication

---

## Technology Stack

### Backend Services

| Technology | Version | Purpose |
|------------|---------|---------|
| **.NET** | 8.0 | Backend runtime |
| **ASP.NET Core** | 8.0 | Web framework |
| **Entity Framework Core** | 8.0 | ORM |
| **gRPC** | Latest | Inter-service communication |
| **MassTransit** | Latest | Message bus abstraction |

### Data Stores

| Database | Version | Purpose |
|----------|---------|---------|
| **PostgreSQL** | Latest | Relational data (auctions, users) |
| **MongoDB** | Latest | Document data (search, bids) |
| **RabbitMQ** | 3-management-alpine | Message broker |

### Frontend

| Framework | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | Latest | React meta-framework |
| **React** | Latest | UI library |
| **Bootstrap** | 4.5+ | CSS framework |
| **NextAuth.js** | Latest | Authentication client |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy, SSL termination |
| **mkcert** | Local SSL certificates |

---

## Project Structure

```
Carsties-2024/
├── src/
│   ├── AuctionService/          # Auction microservice
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Entities/
│   │   ├── Data/                # Entity Framework DbContext
│   │   ├── Protos/              # gRPC protocol definitions
│   │   └── Dockerfile
│   ├── SearchService/            # Search microservice
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   └── Dockerfile
│   ├── IdentityService/          # Identity/Auth microservice
│   │   ├── Controllers/
│   │   ├── Data/
│   │   └── Dockerfile
│   ├── GatewayService/           # API Gateway
│   │   ├── ocelot.json           # Routing configuration
│   │   └── Dockerfile
│   ├── BiddingService/           # Bidding microservice
│   │   ├── Controllers/
│   │   ├── Models/
│   │   └── Dockerfile
│   └── NotificationService/      # Notification microservice
│       ├── Consumers/
│       └── Dockerfile
├── frontend/
│   └── web-app/                  # Next.js frontend
│       ├── app/                  # Next.js App Router
│       ├── components/
│       ├── lib/
│       ├── public/
│       └── Dockerfile
├── devcerts/                     # Local SSL certificates
│   ├── carsties.local.crt
│   └── carsties.local.key
├── docker-compose.yml            # Service definitions
├── README.md                      # Quick start guide
└── DEVELOPMENT.md                # This file
```

---

## Configuration

### Environment Variables

Configuration is managed through `docker-compose.yml`. Key variables by service:

#### Auction Service
```yaml
ASPNETCORE_ENVIRONMENT: Development
ConnectionStrings__DefaultConnection: Server=postgres;User Id=postgres;Password=postgrespw;Database=auctions
RabbitMQ__Host: rabbitmq
IdentityServiceUrl: http://identity-svc
```

#### Search Service
```yaml
ConnectionStrings__MongoDbConnection: mongodb://root:mongopw@mongodb
AuctionServiceUrl: http://auction-svc
RabbitMQ__Host: rabbitmq
```

#### Identity Service
```yaml
ASPNETCORE_ENVIRONMENT: Docker
IssuerUri: https://id.carsties.local
ClientApp: https://app.carsties.local
ConnectionStrings__DefaultConnection: Server=postgres;User Id=postgres;Password=postgrespw;Database=identity
```

#### Web App
```yaml
AUTH_SECRET: "7vgUxWjehgeKTOFH2dZu0zSeKP61o9gl0b1vuHCqeMo="
AUTH_URL: https://app.carsties.local
API_URL: http://gateway-svc/
ID_URL: https://id.carsties.local
```

**Note**: Default credentials are:
- **PostgreSQL**: user=`postgres`, password=`postgrespw`
- **MongoDB**: user=`root`, password=`mongopw`

⚠️ **Security Warning**: These are development credentials only. Never use in production.

---

## Development Workflows

### Daily Development Workflow

#### Starting Development Session

```bash
# 1. Ensure Docker is running
docker ps

# 2. Start all services
docker compose up -d

# 3. Verify services are running
docker compose ps

# 4. Check service logs
docker compose logs -f [service-name]
```

#### Making Code Changes

For .NET services:
```bash
# 1. Make changes to service code
# 2. Rebuild the specific service
docker compose build auction-svc

# 3. Restart the service
docker compose up -d auction-svc

# 4. Check logs
docker compose logs -f auction-svc
```

For Next.js frontend:
```bash
# Option 1: Restart container
docker compose up -d web-app

# Option 2: Access container and run dev server
docker compose exec web-app npm run dev
```

#### Viewing Logs

```bash
# View all service logs
docker compose logs

# Follow specific service in real-time
docker compose logs -f auction-svc

# View last 100 lines of a service
docker compose logs auction-svc --tail=100

# View logs since a specific time
docker compose logs --since 5m
```

#### Database Debugging

```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres -d auctions

# Access MongoDB
docker compose exec mongodb mongosh -u root -p mongopw

# Access RabbitMQ Admin UI
# URL: http://localhost:15672
# Username: guest
# Password: guest
```

### Stopping Development Session

```bash
# Stop all services (containers remain)
docker compose stop

# Stop and remove containers (volumes persist)
docker compose down

# Complete cleanup (removes volumes too)
docker compose down -v
```

### Adding a New Microservice

1. **Create service directory structure** in `src/NewService/`
2. **Create Dockerfile** with .NET build configuration
3. **Add service definition** to `docker-compose.yml`:
   ```yaml
   new-svc:
     image: trycatchlearn/new-svc:latest
     build:
       context: .
       dockerfile: src/NewService/Dockerfile
     environment:
       - ASPNETCORE_ENVIRONMENT=Development
       - ASPNETCORE_URLS=http://+:80
       - RabbitMQ__Host=rabbitmq
     ports:
       - 7005:80
     depends_on:
       - rabbitmq
   ```
4. **Update Gateway routing** in `src/GatewayService/ocelot.json`
5. **Build and start**: `docker compose up -d --build new-svc`

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **docker compose build fails** | Docker not running or insufficient disk space | Restart Docker Desktop; Free up disk space; Run `docker system prune -a` |
| **Cannot reach app.carsties.local** | Hosts file not configured or DNS not resolved | Verify `/etc/hosts` entry; Restart browser; Clear DNS cache: `ipconfig /flushdns` (Windows) |
| **SSL certificate errors** | Certificate not installed or mkcert not run | Re-run `mkcert -install`; Regenerate certificates; Clear browser cache |
| **Port conflicts** | Port already in use | Run `lsof -i :PORT` (macOS/Linux) or `netstat -ano \| findstr :PORT` (Windows); Kill conflicting process |
| **Service fails to start** | Dependency issue or resource limits | Check `docker compose logs SERVICE_NAME`; Increase Docker memory allocation |
| **Database connection refused** | Database service not ready | Wait longer after `docker compose up`; Check service health: `docker compose ps` |
| **RabbitMQ connection timeout** | Message broker not running | Verify rabbitmq service in `docker compose ps`; Check network: `docker network ls` |
| **Cannot access RabbitMQ Admin UI** | Port mapping issue | Verify port 15672 mapping; Check firewall; Use http://localhost:15672 |
| **Frontend not reflecting changes** | Volume mounting issue or hot reload disabled | Rebuild image: `docker compose build web-app`; Check Dockerfile volumes |
| **gRPC communication error** | Port or protocol mismatch | Verify 7777 port open; Check Kestrel configuration in docker-compose.yml |

### Debug Checklist

When experiencing issues, work through this checklist:

- [ ] Docker Desktop is running
- [ ] All containers are running: `docker compose ps`
- [ ] No port conflicts: `docker ps --format "table {{.Ports}}"`
- [ ] Check service logs: `docker compose logs SERVICE_NAME --tail=50`
- [ ] Database is accessible: `docker compose exec postgres psql -U postgres`
- [ ] RabbitMQ is accessible: `curl http://localhost:15672`
- [ ] Network connectivity: `docker network inspect carsties-2024_default`
- [ ] Hostname resolution: `ping app.carsties.local`

### Getting Help

1. Check logs for error messages: `docker compose logs`
2. Verify all prerequisites are installed correctly
3. Try complete cleanup and rebuild:
   ```bash
   docker compose down -v
   docker system prune -a
   docker compose build --no-cache
   docker compose up -d
   ```
4. Review the original README.md for additional context
5. Check Udemy course discussions or GitHub issues

---

## Service Endpoints

### Internal Service Communication (Docker Network)

| Service | Internal URL | Port |
|---------|--------------|------|
| Auction Service | http://auction-svc | 80 |
| Auction gRPC | http://auction-svc | 7777 |
| Search Service | http://search-svc | 80 |
| Identity Service | http://identity-svc | 80 |
| Gateway Service | http://gateway-svc | 80 |
| Bidding Service | http://bid-svc | 80 |
| Notification Service | http://notify-svc | 80 |
| MongoDB | mongodb://root:mongopw@mongodb:27017 | 27017 |
| PostgreSQL | Server=postgres;... | 5432 |
| RabbitMQ | amqp://guest:guest@rabbitmq:5672 | 5672 |

### External Access (Host Machine)

| Service | External URL | Port |
|---------|--------------|------|
| Web App | https://app.carsties.local | 443 |
| API Gateway | https://api.carsties.local | 443 |
| Identity Service | https://id.carsties.local | 443 |
| RabbitMQ Admin | http://localhost:15672 | 15672 |
| PostgreSQL | localhost | 5432 |
| MongoDB | localhost | 27017 |

---

## Database Setup

### PostgreSQL Initialization

Databases are automatically created by Entity Framework migrations:

```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres

# List databases
\l

# Connect to auctions database
\c auctions

# List tables
\dt

# Exit
\q
```

#### Database: `auctions`
Contains: Auction entities, items, and bid history

#### Database: `identity`
Contains: User identities, roles, and claims

### MongoDB Initialization

MongoDB initializes with root user. Create additional databases as needed:

```bash
# Access MongoDB
docker compose exec mongodb mongosh -u root -p mongopw

# List databases
show dbs

# Switch to carsties database
use carsties

# List collections
show collections

# Exit
exit
```

#### Database: `carsties`
Collections:
- `items` - Searchable auction items
- `bids` - Bid history
- `notifications` - User notifications

### Database Migrations

For .NET services with Entity Framework:

```bash
# Migrations are automatically applied on service startup
# To manually apply migrations, access the service container:

docker compose exec auction-svc dotnet ef database update
```

---

## Testing

### Running Tests

```bash
# Run all tests for a service
docker compose exec auction-svc dotnet test

# Run specific test project
docker compose exec auction-svc dotnet test src/AuctionService.Tests

# Run tests with verbose output
docker compose exec auction-svc dotnet test --verbosity detailed
```

### Manual API Testing

#### Using cURL

```bash
# Get auctions
curl -k https://api.carsties.local/api/auctions

# Get specific auction
curl -k https://api.carsties.local/api/auctions/{id}

# Create auction (requires auth token)
curl -X POST -k https://api.carsties.local/api/auctions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"make":"Ferrari","model":"F8","year":2024}'
```

#### Using Postman/Insomnia

1. Create environment variables:
   - `base_url`: https://api.carsties.local
   - `auth_url`: https://id.carsties.local
   - `token`: [obtained from auth endpoint]

2. Example requests:
   - **GET** `{{base_url}}/api/auctions`
   - **POST** `{{base_url}}/api/auctions`
   - **GET** `{{base_url}}/api/auctions/{id}`

### RabbitMQ Message Monitoring

1. Access RabbitMQ Admin UI: http://localhost:15672
2. Login: guest / guest
3. View:
   - **Queues**: Message queues and depths
   - **Exchanges**: Message exchange points
   - **Connections**: Active connections
   - **Channels**: Message channels

---

## Contributing

### Code Standards

When writing functions, always follow these standards:

✅ **Add descriptive doc comments**
```csharp
/// <summary>
/// Retrieves an auction by its unique identifier.
/// </summary>
/// <param name="auctionId">The unique identifier of the auction</param>
/// <returns>The auction details or null if not found</returns>
public async Task<AuctionDto> GetAuctionByIdAsync(string auctionId)
```

✅ **Include input validation**
```csharp
if (string.IsNullOrWhiteSpace(auctionId))
    throw new ArgumentException("Auction ID cannot be null or empty", nameof(auctionId));
```

✅ **Use early returns for error conditions**
```csharp
if (!ModelState.IsValid)
    return BadRequest(ModelState);

var auction = await _context.Auctions.FindAsync(id);
if (auction == null)
    return NotFound();
```

✅ **Add meaningful variable names**
```csharp
var auctionStartTime = DateTime.UtcNow;
var auctionDurationMinutes = 1440; // 24 hours
```

✅ **Include usage examples in comments**
```csharp
/// <example>
/// <code>
/// var auction = await GetAuctionByIdAsync("abc123");
/// if (auction != null)
/// {
///     Console.WriteLine($"Auction ends at: {auction.EndTime}");
/// }
/// </code>
/// </example>
```

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following code standards
3. Test changes locally: `docker compose up -d --build`
4. Commit with descriptive messages: `git commit -m "feat: add new feature"`
5. Push branch: `git push origin feature/your-feature`
6. Create Pull Request with detailed description

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auction-service): add auction filtering by make and model

- Implement filter query parameters in auction controller
- Add database index on Make and Model columns
- Update SearchService to sync filtered results

Closes #123
```

---

## Additional Resources

- **Udemy Course**: [Build a Microservices app with .NET and Next.js](https://www.udemy.com/course/build-a-microservices-app-with-dotnet-and-nextjs-from-scratch/)
- **Original 2023 Version**: [TryCatchLearn/carsties](https://github.com/TryCatchLearn/carsties)
- **.NET Documentation**: [Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/)
- **Next.js Documentation**: [Next.js Docs](https://nextjs.org/docs)
- **Docker Documentation**: [Docker Docs](https://docs.docker.com/)
- **RabbitMQ Documentation**: [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html)

---

## License

This project is part of the Udemy course and follows the same license as the original repository.

---

**Last Updated**: July 2024  
**Documentation Version**: 1.0  
**Target Audience**: Developers, Contributors, Course Participants
