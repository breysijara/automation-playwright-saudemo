# 🚀 Framework de Automatización E2E: Playwright + BDD Cucumber + Page Object Model (SauceDemo)

[![Playwright](https://img.shields.io/badge/Playwright-v1.49-2EAD33?logo=playwright)](https://playwright.dev/)
[![Cucumber BDD](https://img.shields.io/badge/Cucumber-BDD-23D96C?logo=cucumber)](https://cucumber.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)

Este repositorio contiene mi arquitectura de pruebas End-to-End (E2E), diseñada para automatizar y validar de punta a punta las rutas críticas y el flujo transaccional core de **[SauceDemo](https://www.saucedemo.com)**.

El framework implementa una separación rigurosa de responsabilidades mediante **Page Object Model (POM)** con **Locators Desacoplados**, **BaseClass con Esperas Explícitas**, **BDD con Cucumber (Gherkin en Español)**, **Patrón Factory** para datos de prueba, **Hooks/Fixtures** para ciclo de vida y aislamiento total, **Soporte Multi-Ambiente (QA / PROD)**, y **Reportes de Ejecución Avanzados**.

---

## 📹 Video Explicativo y Guion
- **Enlace al Video (Loom / Drive)**: `[REGISTRA_TU_LINK_AQUI]`

---

## 🏛️ Estructura y Jerarquía del Proyecto

```
Playwright-SauceDemo/
├── .github/
│   └── workflows/
│       └── e2e-tests.yml          # Pipeline CI/CD en GitHub Actions
├── diagramas/
│   └── diagrama_integracion.md    # Diagramas de arquitectura, patrones, secuencia y modelo de datos
├── docs/
│   ├── casos-de-prueba.md         # Fichas de casos, matriz de trazabilidad y decisiones técnicas
├── features/                      # Casos de prueba en Gherkin (Lenguaje natural en español)
│   ├── 01_auth.feature            # HU-1: Autenticación y control de accesos (Sin credenciales)
│   ├── 02_e2e_purchase.feature    # HU-2 & HU-3: Compra E2E y consistencia de estado
│   └── 03_checkout_boundary.feature # HU-4: Partición de equivalencia y valores límite
├── src/
│   ├── base/
│   │   └── BasePage.ts            # BaseClass: Wrappers y gestión estricta de esperas explícitas
│   ├── config/
│   │   └── environment.ts         # Loader dinámico y validación Fail-Fast multi-ambiente
│   ├── factories/                 # Patrón Factory para datos de prueba
│   │   ├── UserFactory.ts         # Fábrica de credenciales seguras (leídas desde environment)
│   │   └── CheckoutDataFactory.ts # Fábrica de datos de cliente (válidos, límites BVA, inválidos EP)
│   ├── fixtures/                  # Ciclo de vida y aislamiento de contextos
│   │   ├── customWorld.ts         # CustomWorld de Cucumber (Page, BrowserContext, Pages)
│   │   └── hooks.ts               # Before/After, captura automática de screenshots, traces y videos
│   ├── locators/                  # Selectores desacoplados de la lógica de página (data-test)
│   │   ├── LoginLocators.ts
│   │   ├── InventoryLocators.ts
│   │   ├── CartLocators.ts
│   │   └── CheckoutLocators.ts
│   ├── page-objects/              # Page Objects con métodos de interacción
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── steps/                     # Step Definitions (Glue code entre Gherkin y POM)
│   │   ├── auth.steps.ts
│   │   ├── inventory.steps.ts
│   │   ├── cart.steps.ts
│   │   └── checkout.steps.ts
│   └── utils/                     # Utilidades transversales
│       ├── logger.ts              # Logger estructurado (Winston) con rotación de archivos
│       └── reportGenerator.ts     # Generador de reportes HTML enriquecidos
├── cucumber.js                    # Configuración central del test runner Cucumber
├── package.json                   # Dependencias y scripts npm
├── tsconfig.json                  # Configuración de compilación TypeScript
├── .env.qa                        # Variables de entorno para QA
├── .env.prod.example              # Plantilla para Producción
└── .gitignore                     # Protección de variables y artefactos
```

---

## 🎯 Principios y Decisiones Clave de Mi Arquitectura

### 1. BaseClass y Política Estricta de Esperas Explícitas
- **Prohibición de esperas implícitas o sleeps fijos**: Eliminé por completo el uso de `page.waitForTimeout(x)` o pausas arbitrarias.
- `BasePage` implementa el auto-waiting nativo de Playwright complementado con esperas explícitas de estado (`waitForLocator(..., 'visible')`, `toBeEditable()`, `toBeEnabled()`).
- Cada acción (`click`, `fill`, `type`, `selectOption`) valida automáticamente la interactuabilidad del elemento en el DOM antes de emitir el comando.

### 2. Desacoplamiento de Locators
- Los selectores residen en `src/locators/` utilizando constantes fuertemente tipadas y atributos semánticos dedicados (`data-test="username"`).
- Si el frontend modifica su estructura HTML o clases CSS, **únicamente se actualiza el archivo de Locators**, manteniendo los Page Objects y Step Definitions 100% intactos.

### 3. Aislamiento Total de Contexto (Anti-Flakiness)
- Cada escenario de Cucumber se ejecuta dentro de una instancia nueva y aislada de `BrowserContext` de Playwright.
- Esto garantiza **independencia total entre pruebas**: pueden ejecutarse en cualquier orden, en paralelo o repetidamente sin colisión de sesión, cookies o carrito.
- En caso de fallo, se captura y adjunta automáticamente un screenshot al reporte y se almacena la traza completa de Playwright (`trace.zip`).

### 4. Seguridad de Credenciales y Patrón Factory
- **Cero Credenciales en Features**: Siguiendo las mejores prácticas de BDD y DevSecOps, los archivos `.feature` de Gherkin no contienen contraseñas ni nombres de usuario explícitos.
- `UserFactory`: Centraliza y resuelve los perfiles de usuario leyendo de forma segura desde las variables de entorno (`Config.credentials`), aplicando el patrón **Fail-Fast** (falla inmediatamente en arranque si falta alguna variable obligatoria).
- `CheckoutDataFactory`: Provee datos para pruebas de frontera (BVA), caracteres especiales y particiones de equivalencia (EP).

---

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js**: v18.x o v20.x o superior (`node -v`)
- **npm**: v9.x o superior (`npm -v`)

### Paso a Paso de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd Playwright-SauceDemo

# 2. Instalar dependencias de Node
npm install

# 3. Descargar los navegadores de Playwright
npx playwright install chromium --with-deps
```

---

## 🚦 Comandos de Ejecución de Pruebas

### 1. Ejecución General y Suites
| Comando | Descripción |
| :--- | :--- |
| `npm test` | Ejecuta **toda la suite** de pruebas en paralelo (por defecto en QA) |
| `npm run test:smoke` | Ejecuta únicamente los escenarios críticos marcados con `@smoke` |
| `npm run test:regression` | Ejecuta la suite completa de regresión (`@regression`) |
| `npm run test:auth` | Ejecuta pruebas del módulo de Autenticación (`@auth`) |
| `npm run test:e2e` | Ejecuta el flujo transaccional de Compra E2E (`@e2e`) |
| `npm run test:boundary` | Ejecuta pruebas de valores límite y partición de equivalencia (`@boundary`) |
| `npm run report` | Genera el reporte HTML avanzado tras la ejecución |
| `npm run test:report` | Ejecuta las pruebas y compila el reporte HTML en un solo comando |

---

### 2. Soporte Multi-Ambiente (QA y PROD)

El framework detecta automáticamente el ambiente objetivo mediante la variable `TEST_ENV`:

```bash
# Ejecutar contra el ambiente de QA (lee .env.qa)
npm run test:qa

# Ejecutar contra el ambiente de Producción (corre únicamente Smoke Tests no destructivos)
npm run test:prod
```
---

## 📊 Generación y Visualización de Evidencias

Tras la ejecución, el framework genera múltiples capas de evidencia auditable:

1. **Reporte HTML Avanzado**:
   ```bash
   npm run report
   ```
   Abre el archivo generado en: `reports/html/advanced/index.html`.
2. **Screenshots automáticos en fallos**: Almacenados en `reports/screenshots/`.
3. **Playwright Traces**: Almacenados en `reports/traces/TRACE_<scenario>.zip`.
   - Para inspeccionar la traza paso a paso con línea de tiempo y capturas DOM:
     ```bash
     npx playwright show-trace reports/traces/<nombre_del_archivo>.zip
     ```
4. **Logs de Ejecución**: Almacenados en `logs/execution.log` con nivel de detalle paso a paso mediante Winston.

---

## 📋 Cobertura de Historias de Usuario (Matriz de Trazabilidad)

| Historia de Usuario | Descripción | Escenarios Automatizados | Técnica de Diseño |
| :--- | :--- | :--- | :--- |
| **HU-1: Autenticación** | Login exitoso, usuario bloqueado y validación de errores por credenciales inválidas o incompletas (sin claves quemadas). | `01_auth.feature` (`@tc-auth-01`, `@tc-auth-02`, `@tc-auth-03`) | Tabla de Decisión & Transición de Estados |
| **HU-2: Operación Principal** | Flujo completo: Catálogo $\rightarrow$ Carrito $\rightarrow$ Checkout. Adición/remoción de productos. | `02_e2e_purchase.feature` (`@tc-e2e-01`, `@tc-e2e-02`) | Pruebas de Flujo de Negocio (Use Case) |
| **HU-3: Verificación de Estado** | Verificación matemática de Subtotal, Impuestos (Tax) y Total, más pantalla de orden completada. | `02_e2e_purchase.feature` (`@tc-e2e-01`) | Validación de Consistencia Financiera |
| **HU-4: Casos Negativos y Borde**| Partición de equivalencia en campos obligatorios y valores límite en checkout. | `03_checkout_boundary.feature` (`@tc-boundary-01`, `@tc-boundary-02`) | Partición de Equivalencia (EP) & Análisis de Valores Límite (BVA) |

*Para consultar las fichas técnicas detalladas y respuestas de arquitectura, revisa [docs/casos-de-prueba.md](docs/casos-de-prueba.md).*

---

## 🚀 Integración Continua (CI/CD Quality Gate)

En [`.github/workflows/e2e-tests.yml`](.github/workflows/e2e-tests.yml) implementé un pipeline en GitHub Actions que:
1. Ejecuta la suite en contenedores Linux en modo headless.
2. Inyecta los secretos del ambiente (`QA` o `PROD`) de forma segura.
3. En QA corre la regresión completa como **Quality Gate** para autorizar el pase a producción.
4. En Producción corre únicamente la suite `@smoke` post-despliegue como **Sanity Check**.
5. Publica automáticamente los reportes HTML, capturas y trazas como artefactos descargables.
