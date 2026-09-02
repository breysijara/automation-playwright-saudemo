import * as dotenv from 'dotenv';
import * as path from 'path';

// Determina el ambiente objetivo (por defecto 'qa')
const targetEnv = (process.env.TEST_ENV || process.env.NODE_ENV || 'qa').toLowerCase();

// 1. Carga el archivo del ambiente específico (.env.qa o .env.prod)
const envFilePath = path.resolve(process.cwd(), `.env.${targetEnv}`);
dotenv.config({ path: envFilePath });

// 2. Carga .env como respaldo
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Validación estricta (Fail-Fast):
 * Asegura que ninguna credencial obligatoria falte en el ambiente activo.
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `[CONFIG CRITICAL ERROR] [Ambiente: ${targetEnv.toUpperCase()}] La variable '${key}' no está definida en '${envFilePath}' ni en las variables de entorno.`
    );
  }
  return value.trim();
}

function getOptionalEnv(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value && value.trim() !== '' ? value.trim() : defaultValue;
}

export const Config = {
  // Identificador del ambiente activo
  envName: targetEnv,

  // Parámetros técnicos del ambiente
  baseUrl: getOptionalEnv('BASE_URL', 'https://www.saucedemo.com'),
  browser: getOptionalEnv('BROWSER', 'chromium'),
  headless: getOptionalEnv('HEADLESS', 'true') !== 'false',
  defaultTimeout: parseInt(getOptionalEnv('DEFAULT_TIMEOUT', '15000'), 10),
  slowMo: parseInt(getOptionalEnv('SLOW_MO', '0'), 10),
  recordVideo: getOptionalEnv('RECORD_VIDEO', 'false'),
  trace: getOptionalEnv('TRACE', 'retain-on-failure'),

  // Credenciales seguras (resueltas desde process.env)
  credentials: {
    get standardUser(): string {
      return getRequiredEnv('SAUCE_STANDARD_USER');
    },
    get lockedUser(): string {
      return getRequiredEnv('SAUCE_LOCKED_USER');
    },
    get problemUser(): string {
      return getRequiredEnv('SAUCE_PROBLEM_USER');
    },
    get performanceUser(): string {
      return getRequiredEnv('SAUCE_PERFORMANCE_USER');
    },
    get defaultPassword(): string {
      return getRequiredEnv('SAUCE_PASSWORD');
    },
  },
};
