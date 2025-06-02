# ==============================================================================
# Makefile para Automatización de PostgreSQL
# ==============================================================================

# ------------------------------------------------------------------------------
# Configuración desde variables de entorno (con valores por defecto)
# ------------------------------------------------------------------------------
DB_NAME     ?= tfggii
DB_USER     ?= bfpwebeditor
DB_HOST     ?= localhost
DB_PORT     ?= 5432
INIT_SQL    ?= init_db.sql
SCHEMA_FILE ?= esquema.sql

# Archivo de configuración de entorno
ENV_FILE = .env

# ------------------------------------------------------------------------------
# Configuración de colores para output (si la terminal lo soporta)
# ------------------------------------------------------------------------------
BLUE    = \033[0;34m
GREEN   = \033[0;32m
YELLOW  = \033[0;33m
RED     = \033[0;31m
NC      = \033[0m # No Color

# ------------------------------------------------------------------------------
# Comandos principales
# ------------------------------------------------------------------------------
.PHONY: all help setup init createdb dropdb resetdb createuser \
        grant-permissions getschema clean test-connection check-env \
        create-env-template show-config backup restore

# Comando por defecto: mostrar ayuda
all: help

# Mostrar ayuda
help:
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)           Makefile para Gestión de PostgreSQL                 $(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponibles:$(NC)"
	@echo "  $(GREEN)setup$(NC)              - Configuración completa (usuario + BD + tablas)"
	@echo "  $(GREEN)init$(NC)               - Solo inicializar tablas en BD existente"
	@echo "  $(GREEN)createuser$(NC)         - Crear usuario de aplicación"
	@echo "  $(GREEN)createdb$(NC)           - Crear base de datos"
	@echo "  $(GREEN)dropdb$(NC)             - Eliminar base de datos"
	@echo "  $(GREEN)resetdb$(NC)            - Recrear todo desde cero"
	@echo "  $(GREEN)grant-permissions$(NC)  - Aplicar permisos mínimos al usuario"
	@echo "  $(GREEN)getschema$(NC)          - Exportar esquema de BD"
	@echo "  $(GREEN)backup$(NC)             - Crear backup completo"
	@echo "  $(GREEN)restore$(NC)            - Restaurar desde backup"
	@echo "  $(GREEN)test-connection$(NC)    - Probar conexión a PostgreSQL"
	@echo "  $(GREEN)show-config$(NC)        - Mostrar configuración actual"
	@echo "  $(GREEN)create-env-template$(NC) - Crear archivo .env de ejemplo"
	@echo "  $(GREEN)clean$(NC)              - Limpiar archivos temporales"
	@echo ""
	@echo "$(YELLOW)Variables de entorno (archivo .env):$(NC)"
	@echo "  DB_NAME, DB_USER, DB_PASSWORD, POSTGRES_PASSWORD"
	@echo "  DB_HOST, DB_PORT, INIT_SQL, SCHEMA_FILE"
	@echo ""
	@echo "$(YELLOW)Uso típico:$(NC)"
	@echo "  1. make create-env-template"
	@echo "  2. Editar .env con tus credenciales"
	@echo "  3. make setup"

# ------------------------------------------------------------------------------
# Gestión de configuración
# ------------------------------------------------------------------------------

# Crear archivo .env de ejemplo
create-env-template:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "$(YELLOW)📄 Creando archivo .env de ejemplo...$(NC)"; \
		echo "# Configuración de Base de Datos" > $(ENV_FILE); \
		echo "DB_NAME=tfggii" >> $(ENV_FILE); \
		echo "DB_USER=bfpwebeditor" >> $(ENV_FILE); \
		echo "DB_PASSWORD=tu_password_aqui" >> $(ENV_FILE); \
		echo "POSTGRES_PASSWORD=tu_postgres_password_aqui" >> $(ENV_FILE); \
		echo "DB_HOST=localhost" >> $(ENV_FILE); \
		echo "DB_PORT=5432" >> $(ENV_FILE); \
		echo "INIT_SQL=init_db.sql" >> $(ENV_FILE); \
		echo "SCHEMA_FILE=esquema.sql" >> $(ENV_FILE); \
		echo "$(GREEN)✅ Archivo .env creado. ¡Edítalo con tus credenciales!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  El archivo .env ya existe.$(NC)"; \
	fi

# Verificar que existe el archivo de configuración
check-env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "$(RED)❌ Error: No se encontró el archivo .env$(NC)"; \
		echo "$(YELLOW)💡 Ejecuta: make create-env-template$(NC)"; \
		exit 1; \
	fi

# Mostrar configuración actual
show-config: check-env
	@echo "$(BLUE)📋 Configuración actual:$(NC)"
	@echo "  Base de datos: $(DB_NAME)"
	@echo "  Usuario: $(DB_USER)"
	@echo "  Host: $(DB_HOST)"
	@echo "  Puerto: $(DB_PORT)"
	@echo "  Script SQL: $(INIT_SQL)"
	@echo "  Archivo esquema: $(SCHEMA_FILE)"

# ------------------------------------------------------------------------------
# Comandos de configuración y prueba
# ------------------------------------------------------------------------------

# Probar conexión a PostgreSQL
test-connection: check-env
	@echo "$(BLUE)🔍 Probando conexión a PostgreSQL...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	if PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "SELECT version();" > /dev/null 2>&1; then \
		echo "$(GREEN)✅ Conexión exitosa como superusuario$(NC)"; \
	else \
		echo "$(RED)❌ Error: No se pudo conectar como postgres$(NC)"; \
		exit 1; \
	fi

# ------------------------------------------------------------------------------
# Gestión de usuarios
# ------------------------------------------------------------------------------

# Crear usuario si no existe
createuser: check-env test-connection
	@echo "$(BLUE)🔐 Creando usuario '$(DB_USER)' si no existe...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	if ! PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$(DB_USER)'" | grep -q 1; then \
		PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "CREATE USER $(DB_USER) WITH PASSWORD '$$DB_PASSWORD' NOSUPERUSER NOCREATEDB NOCREATEROLE;"; \
		echo "$(GREEN)✅ Usuario '$(DB_USER)' creado$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Usuario '$(DB_USER)' ya existe$(NC)"; \
	fi

# ------------------------------------------------------------------------------
# Gestión de base de datos
# ------------------------------------------------------------------------------

# Crear base de datos si no existe
createdb: check-env createuser
	@echo "$(BLUE)🛠️  Creando base de datos '$(DB_NAME)' si no existe...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	if ! PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$(DB_NAME)'" | grep -q 1; then \
		PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER);"; \
		echo "$(GREEN)✅ Base de datos '$(DB_NAME)' creada$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Base de datos '$(DB_NAME)' ya existe$(NC)"; \
	fi
	@$(MAKE) grant-permissions

# Eliminar base de datos
dropdb: check-env
	@echo "$(RED)🗑️  Eliminando base de datos '$(DB_NAME)'...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "DROP DATABASE IF EXISTS $(DB_NAME);"
	@echo "$(GREEN)🧹 Base de datos eliminada.$(NC)"

# ------------------------------------------------------------------------------
# Inicialización y permisos
# ------------------------------------------------------------------------------

# Ejecutar script de inicialización
init: check-env createdb
	@echo "$(BLUE)📦 Ejecutando script de inicialización...$(NC)"
	@if [ ! -f $(INIT_SQL) ]; then \
		echo "$(RED)❌ Error: No se encontró el archivo $(INIT_SQL)$(NC)"; \
		exit 1; \
	fi
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$DB_PASSWORD" psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f $(INIT_SQL)
	@echo "$(GREEN)✅ Base de datos inicializada$(NC)"
	@$(MAKE) grant-permissions

# Configuración completa
setup: check-env init
	@echo "$(GREEN)🎉 Configuración completa finalizada$(NC)"

# Recrear todo desde cero
resetdb: check-env dropdb setup
	@echo "$(GREEN)🔄 Base de datos recreada completamente$(NC)"

# Aplicar permisos mínimos
grant-permissions: check-env
	@echo "$(BLUE)🔒 Aplicando permisos mínimos a '$(DB_USER)'...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT CONNECT ON DATABASE $(DB_NAME) TO $(DB_USER);" && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT USAGE ON SCHEMA public TO $(DB_USER);" && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $(DB_USER);" && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $(DB_USER);" && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $(DB_USER);" && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO $(DB_USER);"
	@echo "$(GREEN)✅ Permisos aplicados correctamente$(NC)"

# ------------------------------------------------------------------------------
# Utilidades
# ------------------------------------------------------------------------------

# Exportar esquema
getschema: check-env
	@echo "$(BLUE)📄 Exportando esquema de '$(DB_NAME)'...$(NC)"
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$POSTGRES_PASSWORD" pg_dump -U postgres -h $(DB_HOST) -p $(DB_PORT) --format=plain --schema-only --file=$(SCHEMA_FILE) $(DB_NAME)
	@echo "$(GREEN)✅ Esquema exportado a $(SCHEMA_FILE)$(NC)"

# Crear backup completo
backup: check-env
	@echo "$(BLUE)💾 Creando backup de '$(DB_NAME)'...$(NC)"
	@TIMESTAMP=$$(date +%Y%m%d_%H%M%S); \
	BACKUP_FILE="backup_$(DB_NAME)_$$TIMESTAMP.sql"; \
	if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$POSTGRES_PASSWORD" pg_dump -U postgres -h $(DB_HOST) -p $(DB_PORT) --format=plain --file=$$BACKUP_FILE $(DB_NAME); \
	echo "$(GREEN)✅ Backup creado: $$BACKUP_FILE$(NC)"

# Restaurar desde backup (requiere especificar BACKUP_FILE)
restore: check-env
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)❌ Error: Especifica el archivo de backup$(NC)"; \
		echo "$(YELLOW)💡 Uso: make restore BACKUP_FILE=tu_backup.sql$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(BACKUP_FILE)" ]; then \
		echo "$(RED)❌ Error: No se encontró el archivo $(BACKUP_FILE)$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔄 Restaurando desde $(BACKUP_FILE)...$(NC)"
	@$(MAKE) dropdb
	@$(MAKE) createdb
	@if [ -f $(ENV_FILE) ]; then set -a; . ./$(ENV_FILE); set +a; fi; \
	PGPASSWORD="$$DB_PASSWORD" psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f $(BACKUP_FILE)
	@echo "$(GREEN)✅ Restauración completada$(NC)"

# Limpiar archivos temporales
clean:
	@echo "$(BLUE)🧹 Limpiando archivos temporales...$(NC)"
	@rm -f *.tmp *.log
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

# ------------------------------------------------------------------------------
# Reglas de validación
# ------------------------------------------------------------------------------

# Verificar que los archivos necesarios existen
validate-files:
	@if [ ! -f $(INIT_SQL) ]; then \
		echo "$(YELLOW)⚠️  Advertencia: No se encontró $(INIT_SQL)$(NC)"; \
	fi