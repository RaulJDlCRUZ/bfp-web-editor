-- =====================================================
-- ELIMINAR OBJETOS EXISTENTES
-- =====================================================
DROP TABLE IF EXISTS APPENDICES CASCADE;

DROP TABLE IF EXISTS CHAPTERS CASCADE;

DROP TABLE IF EXISTS IMAGES CASCADE;

DROP TABLE IF EXISTS ACRONYMS CASCADE;

DROP TABLE IF EXISTS BASIC_INFO CASCADE;

DROP TABLE IF EXISTS TFG CASCADE;

DROP TABLE IF EXISTS USERS CASCADE;

DROP DOMAIN IF EXISTS month_tfg CASCADE;

DROP DOMAIN IF EXISTS csl_namefile CASCADE;

-- =====================================================
-- CREACIÓN DE DOMINIOS
-- =====================================================
-- Dominio para el mes de convocatoria
CREATE DOMAIN month_tfg AS VARCHAR(16) CHECK (
  VALUE IN (
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE'
  )
);

-- Dominio para el formato de bibliografía
CREATE DOMAIN csl_namefile AS VARCHAR(64) CHECK (
  VALUE IN (
    'acm-sig-proceedings',
    'iso690-author-date-cs',
    'iso690-numeric-en'
  )
);

-- =====================================================
-- CREACIÓN DE TABLAS
-- =====================================================
-- Tabla USERS
CREATE TABLE
  USERS (
    user_id VARCHAR(16) PRIMARY KEY,
    email VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(64) NOT NULL,
    lastname1 VARCHAR(64) NOT NULL,
    lastname2 VARCHAR(64),
    technology VARCHAR(128),
    phone INTEGER CHECK (
      phone IS NULL
      OR (
        phone BETWEEN 600000000 AND 749999999
        OR phone BETWEEN 800000000 AND 999999999
      )
    )
  );

-- Tabla TFG
CREATE TABLE
  TFG (
    bfp_id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    subtitle VARCHAR(128),
    tutor VARCHAR(64) NOT NULL,
    cotutor VARCHAR(64),
    department VARCHAR(64) NOT NULL,
    language VARCHAR(32) NOT NULL,
    csl csl_namefile NOT NULL,
    month month_tfg NOT NULL,
    year INTEGER NOT NULL CHECK (
      year >= 2025
      AND year <= 9999
    ),
    -- additional_i VARCHAR(16), -- ELIMINADO: Causa dependencia circular
    student VARCHAR(16) NOT NULL,
    -- Restricciones
    CONSTRAINT tfg_title_unique UNIQUE (title),
    CONSTRAINT tfg_student_unique UNIQUE (student), -- 1:1 relación TFG-USERS
    CONSTRAINT tfg_student_fk FOREIGN KEY (student) REFERENCES USERS (user_id) ON UPDATE CASCADE
  );

-- Tabla BASIC_INFO (entidad débil)
CREATE TABLE
  BASIC_INFO (
    cfg_id VARCHAR(16),
    tfg INTEGER NOT NULL,
    abstract VARCHAR(1024),
    ack VARCHAR(128),
    autorship VARCHAR(512),
    dedications VARCHAR(128),
    resumen VARCHAR(1024),
    -- Clave primaria compuesta (entidad débil)
    CONSTRAINT basic_info_pk PRIMARY KEY (cfg_id, tfg),
    -- Clave foránea con CASCADE
    CONSTRAINT basic_info_tfg_fk FOREIGN KEY (tfg) REFERENCES TFG (bfp_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

-- NOTA: Se eliminó la referencia TFG.additional_i → BASIC_INFO para evitar dependencia circular
-- La relación está implícita por la dependencia por identificación (BASIC_INFO.tfg → TFG.bfp_id)
-- Tabla ACRONYMS
CREATE TABLE
  ACRONYMS (
    acronym VARCHAR(32),
    tfg INTEGER,
    meaning VARCHAR(64) NOT NULL,
    -- Clave primaria compuesta
    CONSTRAINT acronyms_pk PRIMARY KEY (acronym, tfg),
    -- Clave foránea
    CONSTRAINT acronyms_tfg_fk FOREIGN KEY (tfg) REFERENCES TFG (bfp_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

-- Tabla IMAGES
CREATE TABLE
  IMAGES (
    img_id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(64) NOT NULL,
    data BYTEA NOT NULL,
    tfg INTEGER NOT NULL,
    -- Clave foránea
    CONSTRAINT images_tfg_fk FOREIGN KEY (tfg) REFERENCES TFG (bfp_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

-- Tabla CHAPTERS
CREATE TABLE
  CHAPTERS (
    chapter_id VARCHAR(64) PRIMARY KEY,
    ch_title VARCHAR(64) NOT NULL,
    number INTEGER NOT NULL CHECK (number != 0),
    content TEXT NOT NULL,
    tfg INTEGER NOT NULL,
    -- Restricción de unicidad para el número de capítulo por TFG
    CONSTRAINT chapters_number_tfg_unique UNIQUE (number, tfg),
    -- Clave foránea
    CONSTRAINT chapters_tfg_fk FOREIGN KEY (tfg) REFERENCES TFG (bfp_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

-- Tabla APPENDICES
CREATE TABLE
  APPENDICES (
    appx_id VARCHAR(64) PRIMARY KEY,
    ap_title VARCHAR(64) NOT NULL,
    number INTEGER NOT NULL CHECK (number != 0),
    content TEXT NOT NULL,
    tfg INTEGER NOT NULL,
    -- Restricción de unicidad para el número de anexo por TFG
    CONSTRAINT appendices_number_tfg_unique UNIQUE (number, tfg),
    -- Clave foránea
    CONSTRAINT appendices_tfg_fk FOREIGN KEY (tfg) REFERENCES TFG (bfp_id) ON DELETE CASCADE ON UPDATE CASCADE
  );