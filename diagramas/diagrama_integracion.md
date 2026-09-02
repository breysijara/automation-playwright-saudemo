# 📐 Diagramas de Integración, Estructura de Carpetas y Patrones de Diseño
**Proyecto**: Automatización E2E SauceDemo  
**Stack**: Playwright + TypeScript + BDD Cucumber + Page Object Model (POM)  

Este documento detalla exhaustivamente la **estructura de carpetas**, los **patrones de diseño de software aplicados**, su **asociación técnica e interdependencia**, el **soporte multi-ambiente (QA / PROD)**, y los **diagramas de flujo e integración** de toda mi arquitectura.

---


## 1. Diagrama de Asociación e Interacción entre Patrones

Muestra la forma en que los patrones se conectan e intercambian responsabilidades durante la automatización:

```mermaid
graph TD
    %% Estilos
    classDef bdd fill:#2e7d32,stroke:#1b5e20,stroke-width:2px,color:#fff;
    classDef glue fill:#1565c0,stroke:#0d47a1,stroke-width:2px,color:#fff;
    classDef pom fill:#6a1b9a,stroke:#4a148c,stroke-width:2px,color:#fff;
    classDef loc fill:#e65100,stroke:#bf360c,stroke-width:2px,color:#fff;
    classDef base fill:#c2185b,stroke:#880e4f,stroke-width:2px,color:#fff;
    classDef fact fill:#f57f17,stroke:#bc5100,stroke-width:2px,color:#fff;
    classDef fix fill:#00838f,stroke:#004d40,stroke-width:2px,color:#fff;
    classDef conf fill:#37474f,stroke:#263238,stroke-width:2px,color:#fff;

    ENV[".env.qa / .env.prod<br/>(Variables de Entorno)"]:::conf
    CONF["<b>Config Loader (Fail-Fast)</b><br/><i>src/config/environment.ts</i>"]:::conf
    ENV --> CONF

    BDD["<b>BDD Specification</b><br/><i>features/*.feature</i><br/>Define escenarios y criterios sin credenciales"]:::bdd

    GLUE["<b>Step Definitions (Glue Code)</b><br/><i>src/steps/*.steps.ts</i><br/>Traduce pasos Gherkin en lógica ejecutable"]:::glue

    FIX["<b>Fixtures & Custom World</b><br/><i>src/fixtures/customWorld.ts, hooks.ts</i><br/>Inyecta contexto aislado y ciclo de vida"]:::fix

    FACT["<b>Test Data Factory</b><br/><i>src/factories/*.ts</i><br/>Genera datos tipados leyendo de Config"]:::fact
    CONF --> FACT

    POM["<b>Page Object Model (POM)</b><br/><i>src/page-objects/*.ts</i><br/>Encapsula acciones de usuario por pantalla"]:::pom

    LOC["<b>Decoupled Locators</b><br/><i>src/locators/*.ts</i><br/>Centraliza selectores [data-test=...]"]:::loc

    BASE["<b>Layer Supertype (BasePage)</b><br/><i>src/base/BasePage.ts</i><br/>Aplica auto-waiting y esperas explícitas"]:::base

    %% Asociaciones
    BDD -->|"Mapea pasos hacia"| GLUE
    FIX -->|"Inicializa e inyecta páginas en"| GLUE
    FACT -->|"Provee datos dinámicos a"| GLUE
    GLUE -->|"Invoca métodos en"| POM
    POM -->|"Lee selectores de"| LOC
    POM -->|"Hereda capacidades de"| BASE
    BASE -->|"Interactúa con el DOM mediante"| PW["Playwright Engine (Chromium / Firefox / WebKit)"]
```

---

## 2. Matriz de Asociación: Carpeta, Patrón y Responsabilidad

| Carpeta | Patrón de Diseño | Componentes Clave | ¿Cómo se asocia con las demás capas? |
| :--- | :--- | :--- | :--- |
| `features/` | **BDD Specification Pattern** | `01_auth.feature`<br/>`02_e2e_purchase.feature`<br/>`03_checkout_boundary.feature` | Contiene los casos en Gherkin en español **sin credenciales quemadas**. Es el punto de entrada que Cucumber parsea para ejecutar los `steps/`. |
| `src/steps/` | **Glue Code / Step Definition Pattern** | `auth.steps.ts`<br/>`inventory.steps.ts`<br/>`cart.steps.ts`<br/>`checkout.steps.ts` | Puente entre Gherkin y la lógica técnica. Consume datos de las `factories/` y llama a los métodos de los `page-objects/` usando las instancias de `fixtures/customWorld`. |
| `src/page-objects/` | **Page Object Model (POM)** | `LoginPage.ts`<br/>`InventoryPage.ts`<br/>`CartPage.ts`<br/>`CheckoutPage.ts` | Modela las páginas de la aplicación. **Hereda de `BasePage`** para usar esperas explícitas y **utiliza los selectores de `locators/`**. No contiene aserciones de Cucumber. |
| `src/locators/` | **Decoupled Locators (Separation of Concerns)** | `LoginLocators.ts`<br/>`InventoryLocators.ts`<br/>`CartLocators.ts`<br/>`CheckoutLocators.ts` | Diccionarios puros de selectores basados en atributos de accesibilidad y `data-test`. Si la UI cambia, solo se modifica esta capa. |
| `src/base/` | **Layer Supertype / Wrapper Pattern** | `BasePage.ts` | Clase base abstracta. Contiene wrappers de Playwright (`click`, `fill`, `waitForLocator`, `getText`) implementando **esperas explícitas obligatorias** y eliminando esperas implícitas o sleeps. |
| `src/factories/` | **Factory Method / Data Factory** | `UserFactory.ts`<br/>`CheckoutDataFactory.ts` | Fabrica objetos de prueba inmutables y tipados. Soporta usuarios por rol y escenarios de Partición de Equivalencia y Valores Límite. |
| `src/fixtures/` | **Test Fixture & Dependency Injection Pattern** | `customWorld.ts`<br/>`hooks.ts` | Gestiona el ciclo de vida (`BeforeAll`, `Before`, `After`, `AfterAll`). Crea un `BrowserContext` nuevo por escenario para **aislamiento total anti-flakiness** y captura trazas/screenshots. |
| `src/config/` | **Fail-Fast Environment Configuration** | `environment.ts`<br/>`.env.qa`, `.env.prod.example` | Detecta dinámicamente el ambiente (`QA` o `PROD`), valida que las variables existan en arranque y evita contraseñas en código TypeScript. |
| `src/utils/` | **Cross-Cutting Utilities Pattern** | `logger.ts`<br/>`reportGenerator.ts` | Servicios transversales para logging con Winston (rotación de logs) y generación de reportes HTML enriquecidos. |
| `docs/` | **Living Documentation Pattern** | `casos-de-prueba.md`<br/>`guion_video.md` | Matriz de trazabilidad, fichas técnicas de diseño de casos, respuestas técnicas y guion de presentación. |
| `.github/` | **Continuous Deployment Quality Gate** | `e2e-tests.yml` | Orquesta la ejecución desatendida en CI (GitHub Actions), evalúa la compuerta de calidad en QA/PROD y publica reportes descargables. |

---


### 🔄 Flujo de Responsabilidades en el POM:

1. **Gherkin (`.feature`)** declara el **QUÉ** se quiere probar en lenguaje natural (*"Cuando el usuario inicia sesión con credenciales válidas"*).
2. **Step Definition (`.steps.ts`)** actúa como el **COORDINADOR**: recibe la llamada, usa los datos de `UserFactory` y le pide al Page Object que ejecute la acción.
3. **Page Object (`.page.ts`)** define el **CÓMO DE NEGOCIO**: sabe que para iniciar sesión se debe llenar el usuario, llenar la clave y hacer clic en el botón de login.
4. **Locators (`.locators.ts`)** provee el **DÓNDE**: tiene la dirección exacta del elemento en el DOM (`[data-test="login-button"]`).
5. **BasePage (`BasePage.ts`)** provee la **INFRAESTRUCTURA Y ESPERAS**: se asegura de que el botón exista, sea visible y esté habilitado antes de hacer el clic real en Playwright.
6. **Logger (`logger.ts`)** provee la **AUDITORÍA**: deja registro en `logs/execution.log` de cada acción realizada.
