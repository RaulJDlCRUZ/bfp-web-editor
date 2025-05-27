# ------------------------------
# Configuración
# ------------------------------
DB_NAME     = tfggii
DB_USER     = bfpwebeditor
DB_PASSWORD = @twe1234 # dummy passwd, replace with your own
DB_HOST     = localhost
DB_PORT     = 5432
INIT_SQL    = init_db.sql

# ------------------------------
# Comandos
# ------------------------------
.PHONY: all init createdb dropdb resetdb createuser getpass grant-permissions getschema

# Flujo completo: usuario + base de datos + tablas
all: getpass createuser init

# Crea usuario si no existe y le asigna contraseña
createuser:
	$(MAKE) getpass
	@echo "🔐 Creando usuario '$(DB_USER)' si no existe..."
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$(DB_USER)'" | grep -q 1 || \
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "CREATE USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)' NOSUPERUSER NOCREATEDB NOCREATEROLE;"
	@echo "✅ Usuario listo."

# Crea la base de datos si no existe y le da permisos al usuario
createdb:
	@echo "🛠️  Creando base de datos '$(DB_NAME)' si no existe..."
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$(DB_NAME)'" | grep -q 1 || \
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER);"
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER);"
	@echo "✅ Base de datos asegurada."

# Ejecuta el script de inicialización
init: createdb
	@echo "📦 Ejecutando script de inicialización en '$(DB_NAME)'..."
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f $(INIT_SQL)
	@echo "✅ Base de datos inicializada"
	$(MAKE) grant-permissions

# Borra la base de datos (requiere superusuario)
dropdb:
	@echo "🗑️  Eliminando base de datos '$(DB_NAME)'..."
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d postgres -c "DROP DATABASE IF EXISTS $(DB_NAME);"
	@echo "🧹 Base de datos eliminada."

# Borra y recrea todo
resetdb: dropdb all

# Otorgar al usuario solo los permisos mínimos necesarios
grant-permissions:
	@echo "🔒 Otorgando permisos mínimos a '$(DB_USER)'..."
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT CONNECT ON DATABASE $(DB_NAME) TO $(DB_USER);"
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c "GRANT USAGE ON SCHEMA public TO $(DB_USER);"
	psql -U postgres -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -c 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $(DB_USER);'
	@echo "✅ Permisos aplicados."

# Obtiene el esquema de la base de datos
getschema:
	$(MAKE) getpass
	pg_dump --username=postgres --host=$(DB_HOST) --port=$(DB_PORT) --format=plain --schema-only --file=esquema.sql $(DB_NAME)

# Exporta la clave de PostgreSQL para evitar pedirla al ejecutar psql
getpass:
	export PGPASSWORD="twe2025"