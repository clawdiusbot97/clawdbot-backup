# Plan de Conexión: Dashboard Ruby a AWS RDS

## 1) Supuestos

- Dashboard Ruby/Rails ya deployado en staging
- Infraestructura AWS existente (VPC, subnets)
- RDS/Aurora será la base de datos objetivo
- Acceso a AWS CLI con permisos necesarios
- Secrets Manager o SSM Parameter Store disponible
- Staging tiene conectividad de red a AWS (VPN, Direct Connect, o bastion)

---

## 2) Pasos Mínimos (MVP) para Conectar Staging a AWS DB

### 2.1 Crear/Configurar RDS (si no existe)

```bash
# Crear instancia RDS PostgreSQL (ejemplo)
aws rds create-db-instance \
  --db-instance-identifier qubika-bancard-staging \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password $(aws secretsmanager get-secret-value --secret-id staging/db/password --query SecretString --output text) \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name qubika-staging-subnet-group \
  --backup-retention-period 7 \
  --multi-az false
```

### 2.2 Configurar Security Group

```bash
# Crear SG para RDS
aws ec2 create-security-group \
  --group-name qubika-staging-db-sg \
  --description "Allow staging app connectivity to RDS" \
  --vpc-id vpc-xxxxxxxx

# Autorizar tráfico desde el SG del staging
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-staging-app-id
```

### 2.3 Guardar credenciales en SSM

```bash
# Guardar connection string
aws ssm put-parameter \
  --name "/qubika/bancard/staging/database/url" \
  --value "postgres://admin:password@qubika-bancard-staging.xxxxx.region.rds.amazonaws.com:5432/dashboard_db" \
  --type SecureString

# Guardar host separadamente
aws ssm put-parameter \
  --name "/qubika/bancard/staging/database/host" \
  --value "qubika-bancard-staging.xxxxx.region.rds.amazonaws.com" \
  --type SecureString
```

### 2.4 Actualizar aplicación

```bash
# Deploy con nueva configuración
RAILS_ENV=staging rails db:migrate
RAILS_ENV=staging rails db:seed  # si aplica
```

---

## 3) Configuración Ruby/Rails

### 3.1 Environment Variables

```ruby
# database.yml (staging)
staging:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("DB_POOL") { 10 } %>
  timeout: <%= ENV.fetch("DB_TIMEOUT") { 5000 } %>
  host: <%= ENV.fetch("DB_HOST") %>
  port: <%= ENV.fetch("DB_PORT") { 5432 } %>
  username: <%= ENV.fetch("DB_USER") %>
  password: <%= ENV.fetch("DB_PASSWORD") %>
  database: <%= ENV.fetch("DB_NAME") %>
  sslmode: <%= ENV.fetch("DB_SSLMODE") { "require" } %>
  sslrootcert: <%= ENV.fetch("DB_SSLROOTCERT") { Rails.root.join("config", "rds-ca-bundle.pem") } %>

# O usar DATABASE_URL (más simple)
DATABASE_URL=postgres://admin:password@host:5432/dbname?sslmode=require
```

### 3.2 Variables Críticas

| Variable | Valor Recomendado | Descripción |
|----------|-------------------|-------------|
| `DB_POOL` | 10-20 | Conexiones simultáneas |
| `DB_TIMEOUT` | 5000 | Timeout en ms |
| `DB_SSLMODE` | require | Obligatorio para RDS |
| `DB_CONNECT_TIMEOUT` | 10 | Timeout de conexión |
| `DB_IDLE_TIMEOUT` | 600 | Cerrar conexiones inactivas |

### 3.3 Connection Pool Config

```ruby
# config/database.yml
staging:
  <<: *default
  pool: 15
  checkout_timeout: 5
  idle_timeout: 300
  reconnect: true
```

---

## 4) Seguridad Recomendada

### 4.1 Security Groups (Defense in Depth)

```bash
# SG1: Base de datos - solo acepta del SG de la app
aws ec2 authorize-security-group-ingress \
  --group-id sg-rds-id \
  --protocol tcp \
  --port 5432 \
  --source-group sg-app-id

# SG2: App - puede salir a RDS
aws ec2 authorize-security-group-ingress \
  --group-id sg-app-id \
  --protocol tcp \
  --port 5432 \
  --source-group sg-rds-id
```

### 4.2 IAM para RDS (Authentication Token)

```ruby
# Ruby - usando IAM authentication
require 'aws-sdk-rds'

client = Aws::RDS::Client.new(region: 'us-east-1')
auth_token = [TOKEN](
  db_identifier: 'qubika-bancard-staging',
  username: 'app_user',
  hostname: 'qubika-bancard-staging.xxxxx.rds.amazonaws.com',
  port: 5432
)

# Usar token en lugar de password
```

### 4.3 Secrets Manager / SSM

```bash
# Crear secreto en Secrets Manager
aws secretsmanager create-secret \
  --name "qubika/bancard/staging/database" \
  --secret-string '{"username":"app_user","password":"[PASSWORD]","host":"xxx.rds.amazonaws.com","port":5432}'

# Rotación automática (30 días)
aws secretsmanager put-secret-version \
  --secret-id "qubika/bancard/staging/database" \
  --secret-string '{"username":"app_user","password":"[PASSWORD]","host":"xxx.rds.amazonaws.com","port":5432}'
```

### 4.4 Network Hardening

- **Private subnets**: RDS en private subnets, no exposición pública
- **VPC Endpoint**: SSM/Secrets Manager via VPCE para no salir a internet
- **NACLs**: Bloquear tráfico no necesario (puerto 5432 solo entre subnets)

---

## 5) Pruebas de Humo y Troubleshooting

### 5.1 Pruebas de Humo

```bash
# 1. Verificar conectividad de red
nc -zv qubika-bancard-staging.xxxxx.rds.amazonaws.com 5432

# 2. Test de conexión desde el servidor staging
PGPASSWORD=[PASSWORD] psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;"

# 3. Test desde Rails console
RAILS_ENV=staging rails c -e staging
ActiveRecord::Base.connection.execute("SELECT 1").to_a
# => [{"?column?"=>1}]

# 4. Verificar SSL
psql "sslmode=require host=$DB_HOST dbname=$DB_NAME user=$DB_USER" -c "SELECT ssl_is_used();"

# 5. Test de performance básico
RAILS_ENV=staging rails db:fixtures:load
```

### 5.2 Troubleshooting Común

| Problema | Causa Probable | Solución |
|----------|----------------|----------|
| `connection refused` | SG bloqueando puerto | Verificar inbound rules en SG |
| `timeout` | Routing/VPC peering | Revisar route tables, NAT gateways |
| `ssl handshake failure` | Certificado outdated | Descargar RDS CA bundle actualizado |
| `password auth failed` | Credenciales wrong | Verificar secrets en SSM/SM |
| `too many connections` | Pool saturado | Aumentar pool o verificar leaks |
| `connection timeout` | Network ACL | Revisar NACLs de subnets |

### 5.3 Diagnóstico de Red

```bash
# Desde el servidor staging
telnet $DB_HOST 5432
# Si conecta: network OK

# Verificar DNS
nslookup qubika-bancard-staging.xxxxx.rds.amazonaws.com

# Trazas (si hay conectividad)
traceroute -T -p 5432 $DB_HOST
```

---

## 6) Plan de Rollback

### 6.1 Antes del Deploy

```bash
# 1. Backup de la DB actual (antes de migraciones)
aws rds create-db-snapshot \
  --db-instance-identifier qubika-bancard-staging \
  --db-snapshot-identifier qubika-bancard-staging-pre-deploy-$(date +%Y%m%d)

# 2. Snapshot de volumen de staging si es relevante
aws ec2 create-snapshot \
  --volume-id vol-xxxxxxxx \
  --description "staging-pre-db-connect-$(date +%Y%m%d)"
```

### 6.2 Proceso de Rollback

```bash
# OPCIÓN A: Revertir configuración (si solo cambió connection string)
# Editar .env o variable de entorno
# Redeployear con config anterior

# OPCIÓN B: Restaurar snapshot RDS
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier qubika-bancard-staging-rollback \
  --db-snapshot-identifier qubika-bancard-staging-pre-deploy-$(date +%Y%m%d)

# OPCIÓN C: Si es solo rollback de datos (tablas específicas)
# Restaurar desde backup point-in-time
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier qubika-bancard-staging \
  --target-db-instance-identifier qubika-bancard-staging-pit \
  --restore-time 2024-01-15T10:00:00.000Z
```

### 6.3 Rollback de Aplicación

```bash
# Revertir a commit anterior
git checkout v1.0.0
git push origin staging --force

# O usar tags/deployments previos
cap production deploy:rollback

# Verificar que funciona
RAILS_ENV=staging rails health_check
```

---

## Checklist Rápido de Ejecución

- [ ] RDS creada con multi-AZ (opcional pero recomendado)
- [ ] SG configurado: puerto 5432 solo desde SG de app
- [ ] Credenciales en Secrets Manager/SSM
- [ ] Connection string testeado localmente
- [ ] Variables de entorno en pipeline CI/CD
- [ ] Migraciones verificadas en ambiente dev
- [ ] Snapshot pre-deploy creado
- [ ] Pruebas de humo pasan (conectividad, SSL, query básica)
- [ ] Monitoreo activo (CloudWatch: conexiones, latency)
- [ ] Documentar endpoint y credenciales en password manager

---

## Comandos One-Liner para Staging

```bash
# Test completo de conectividad
export DB_HOST=$(aws ssm get-parameter --name "/qubika/bancard/staging/database/host" --query "Parameter.Value" --output text) && \
export DB_USER=$(aws ssm get-parameter --name "/qubika/bancard/staging/database/user" --query "Parameter.Value" --output text) && \
export DB_NAME=$(aws ssm get-parameter --name "/qubika/bancard/staging/database/name" --query "Parameter.Value" --output text) && \
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id "qubika/bancard/staging/database" --query SecretString --output text | jq -r .password) && \
nc -zv $DB_HOST 5432 && \
PGPASSWORD=[PASSWORD] psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT version();"
```

---

*Documento preparado para Qubika - Cliente Bancard*
*Fecha: 2026-02-17*