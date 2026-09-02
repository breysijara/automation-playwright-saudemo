# Documento de Diseño de Casos de Prueba y Trazabilidad E2E
**Proyecto**: Automatización E2E SauceDemo  
**Stack**: Playwright + TypeScript + BDD (Cucumber/Gherkin) + Page Object Model (POM)  
**Fecha**: Setiembre 2026  

---

## 1. Alcance y Estrategia de Pruebas

El objetivo de esta suite es validar de punta a punta (End-to-End) las rutas críticas de negocio de la plataforma **SauceDemo**, garantizando alta confiabilidad, independencia entre ejecuciones, cero falsos positivos (anti-flakiness) y máxima claridad técnica para el equipo de desarrollo y stakeholders.

---

## 2. Definición y Diseño de Casos de Prueba

### HU-1: Autenticación de Usuarios (Authentication & Authorization)
> **Historia de Usuario**: Como usuario de SauceDemo, quiero autenticarme con mis credenciales para acceder al catálogo y realizar compras.

#### TC-AUTH-01: Inicio de sesión exitoso con credenciales válidas
- **ID**: `TC-AUTH-01`
- **Historia / Criterio**: HU-1 / Criterio 1.1 (Camino Feliz de Autenticación)
- **Técnica de Diseño**: Tabla de Decisión & Transición de Estados
- **Prioridad**: Alta | **Severidad**: Crítica (Bloquea todo el flujo si falla)
- **Precondiciones**: La aplicación está disponible en la URL base.
- **Datos de Prueba**: Credenciales válidas resueltas de forma segura vía `UserFactory` / variables de entorno.
- **Pasos**:
  1. Navegar a la página de login (`/`).
  2. Solicitar autenticación con credenciales válidas a `UserFactory`.
  3. Hacer clic en "Login".
- **Resultado Esperado**: Redirección a `/inventory.html`, visualización del catálogo y título "Products".

#### TC-AUTH-02: Intento de inicio de sesión con usuario bloqueado
- **ID**: `TC-AUTH-02`
- **Historia / Criterio**: HU-1 / Criterio 1.2 (Seguridad y Acceso Restringido)
- **Técnica de Diseño**: Tabla de Decisión (Matriz de Roles de Usuario)
- **Prioridad**: Alta | **Severidad**: Alta (Seguridad / Integridad de Acceso)
- **Precondiciones**: Usuario configurado con estado bloqueado en el SUT.
- **Datos de Prueba**: Perfil bloqueado provisto por `UserFactory`.
- **Pasos**:
  1. Navegar a la página de login.
  2. Ingresar usuario bloqueado y contraseña provista por `UserFactory`.
  3. Hacer clic en "Login".
- **Resultado Esperado**: Permanece en el login y muestra: `"Epic sadface: Sorry, this user has been locked out."`.

#### TC-AUTH-03: Validación de mensajes de error ante credenciales inválidas o incompletas
- **ID**: `TC-AUTH-03`
- **Historia / Criterio**: HU-1 / Criterio 1.3 (Manejo de Errores en Entrada)
- **Técnica de Diseño**: Partición de Equivalencia (Clases Inválidas)
- **Prioridad**: Media | **Severidad**: Media
- **Precondiciones**: Formulario de login visible.
- **Datos de Prueba (Abstraídos en `UserFactory`)**:
  - Criterio `password_incorrecto`: Usuario válido con contraseña errónea
  - Criterio `usuario_vacio`: Campo usuario vacío con contraseña
  - Criterio `password_vacio`: Usuario válido con campo contraseña vacío
  - Criterio `usuario_no_registrado`: Usuario inexistente en el servicio
- **Pasos**:
  1. Ingresar combinaciones de credenciales.
  2. Hacer clic en "Login".
- **Resultado Esperado**: Mensaje de error correspondiente (`Username is required`, `Password is required`, o `Username and password do not match...`).

---

### HU-2: Operación Principal (Main E2E Flow: Catalog -> Cart -> Checkout)
> **Historia de Usuario**: Como usuario autenticado, quiero seleccionar productos, agregarlos al carrito y gestionarlos para iniciar el proceso de compra.

#### TC-E2E-01: Flujo completo de compra E2E con múltiples productos
- **ID**: `TC-E2E-01`
- **Historia / Criterio**: HU-2 (Operación Principal) y HU-3 (Verificación de Estado)
- **Técnica de Diseño**: Pruebas de Flujo de Negocio (Use Case Testing)
- **Prioridad**: Crítica | **Severidad**: Crítica
- **Precondiciones**: Usuario `standard_user` autenticado.
- **Datos de Prueba**: 3 Productos: `Sauce Labs Backpack` ($29.99), `Sauce Labs Bike Light` ($9.99), `Sauce Labs Bolt T-Shirt` ($15.99). Cliente: First Name, Last Name, Postal Code.
- **Pasos**:
  1. Agregar los 3 productos al carrito desde el catálogo.
  2. Verificar que el badge del carrito marque 3.
  3. Navegar a la página del carrito y verificar nombres y precios.
  4. Clic en "Checkout".
  5. Completar datos de envío válidos generados por `CheckoutDataFactory`.
  6. Avanzar al resumen de la orden (`checkout-step-two.html`).
  7. Validar cálculo matemático de subtotal, impuesto (tax) y total.
  8. Clic en "Finish".
- **Resultado Esperado**: Orden finalizada en `/checkout-complete.html`, mensaje `"Thank you for your order!"` y descripción de despacho visible.

#### TC-E2E-02: Gestión dinámica de ítems (Adición y remoción en catálogo y carrito)
- **ID**: `TC-E2E-02`
- **Historia / Criterio**: HU-2 / Criterio 2.2 (Sincronización de Estado del Carrito)
- **Técnica de Diseño**: Transición de Estados
- **Prioridad**: Alta | **Severidad**: Media
- **Precondiciones**: Usuario autenticado.
- **Pasos**:
  1. Agregar 2 productos desde el catálogo. Verificar badge = 2.
  2. Remover 1 producto directamente desde el botón del inventario. Verificar badge = 1.
  3. Ir al carrito y remover el producto restante.
- **Resultado Esperado**: Carrito vacío, badge eliminado/0 ítems.

---

### HU-3: Verificación de Estado y Consistencia Financiera
> **Historia de Usuario**: Como comprador, quiero que el resumen de compra refleje exactamente el subtotal de mis productos, el cálculo de impuestos y el total exacto.

- **Cubierto en**: `TC-E2E-01` (Step Two Overview Validation).
- **Lógica de Verificación**:
  - `Subtotal Obtenido == Suma(Precios de productos seleccionados)`
  - `Total Obtenido == Subtotal Obtenido + Impuesto Calculado (Tax)`
  - `Header == "Thank you for your order!"`

---

### HU-4: Casos Negativos y de Borde en Formulario de Checkout (Boundary & Equivalence Partitioning)
> **Historia de Usuario**: Como usuario en checkout, quiero validaciones claras en campos obligatorios y soporte a diferentes formatos de entrada válidos.

#### TC-BOUNDARY-01: Validación de campos obligatorios faltantes con partición de equivalencia
- **ID**: `TC-BOUNDARY-01`
- **Historia / Criterio**: HU-4 / Criterio 4.1
- **Técnica de Diseño**: Partición de Equivalencia (Clases Inválidas)
- **Prioridad**: Alta | **Severidad**: Media
- **Particiones**:
  - $P_1$: First Name vacío $\rightarrow$ Error `"Error: First Name is required"`
  - $P_2$: Last Name vacío $\rightarrow$ Error `"Error: Last Name is required"`
  - $P_3$: Postal Code vacío $\rightarrow$ Error `"Error: Postal Code is required"`
  - $P_4$: Todos los campos vacíos $\rightarrow$ Error `"Error: First Name is required"`

#### TC-BOUNDARY-02: Validación de valores límite y caracteres especiales
- **ID**: `TC-BOUNDARY-02`
- **Historia / Criterio**: HU-4 / Criterio 4.2
- **Técnica de Diseño**: Análisis de Valores Límite (BVA) y Datos Extremos
- **Prioridad**: Media | **Severidad**: Baja
- **Clases de Borde**:
  - Longitud mínima: 1 carácter por campo (`A`, `B`, `1`).
  - Cadenas largas: 50 caracteres alfanuméricos.
  - Caracteres especiales y tildes: `José-María`, `O'Connor #$%&`, `AB-1234!`.
  - Nombres numéricos: `12345`, `67890`, `90210`.
- **Resultado Esperado**: El formulario valida exitosamente y avanza al resumen de la orden (`step two`).

---

## 3. Matriz de Trazabilidad (Traceability Matrix)

| Historia de Usuario | ID Caso de Prueba | Título del Caso | Archivo Feature | Tag Gherkin | Estado Automatizado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-1** | `TC-AUTH-01` | Login exitoso con credenciales válidas | `01_auth.feature` | `@smoke @auth @tc-auth-01` | **Automatizado** |
| **HU-1** | `TC-AUTH-02` | Login rechazado usuario bloqueado | `01_auth.feature` | `@regression @auth @tc-auth-02` | **Automatizado** |
| **HU-1** | `TC-AUTH-03` | Credenciales inválidas o incompletas | `01_auth.feature` | `@regression @auth @tc-auth-03` | **Automatizado** |
| **HU-2** / **HU-3** | `TC-E2E-01` | Flujo E2E completo y verificación financiera | `02_e2e_purchase.feature` | `@smoke @e2e @tc-e2e-01` | **Automatizado** |
| **HU-2** | `TC-E2E-02` | Adición y remoción dinámica de ítems | `02_e2e_purchase.feature` | `@regression @e2e @tc-e2e-02` | **Automatizado** |
| **HU-4** | `TC-BOUNDARY-01`| Partición de equivalencia campos requeridos | `03_checkout_boundary.feature` | `@negative @boundary @tc-boundary-01` | **Automatizado** |
| **HU-4** | `TC-BOUNDARY-02`| Valores límite y caracteres especiales | `03_checkout_boundary.feature` | `@boundary @tc-boundary-02` | **Automatizado** |

---

## 4. Respuestas Técnicas y Justificación de Decisiones de Arquitectura (Puntos de Decisión)

### 1. ¿Qué partes del flujo automatizaste y cuáles no? ¿Por qué?
- **Automatizado**:
  - Flujo crítico E2E completo: Autenticación, Catálogo, Carrito, Formulario de Información, Resumen financiero (Subtotal, Impuestos, Total) y Finalización de Orden.
  - Validación de seguridad/roles (`standard_user`, `locked_out_user`).
  - Casos de borde y validaciones de campo en formularios usando Partición de Equivalencia y Valores Límite.
- **Dejado fuera deliberadamente**:
  - Enlaces externos a redes sociales en el footer (Twitter, Facebook, LinkedIn): No aportan valor al flujo transaccional core y generan fragilidad por dependencias de terceros.
  - Reset app state exhaustivo en cada micro-paso: La suite utiliza **aislamiento total de contexto de navegador** (`BrowserContext` nuevo por escenario), lo que garantiza estado limpio en memoria sin requerir acciones UI adicionales.

### 2. ¿Cómo preparaste los datos de prueba y el estado?
- **Patrón Factory (`UserFactory` y `CheckoutDataFactory`)**:
  - Centralización de perfiles de usuario y datos dinámicos/estáticos de clientes.
  - Generación de datos de compradores efímeros y únicos mediante timestamps (`John_169...`) para evitar colisiones.
  - En SauceDemo (SUT puramente frontend mock), la preparación se maneja mediante Page Objects optimizados y aislamiento de contextos.

### 3. ¿Cómo garantizas que la suite no sea flaky al correr en CI?
- **Cero esperas implícitas o sleeps arbitrarios**: Todo el framework interactúa mediante `BasePage` con auto-waiting y esperas explícitas basadas en estado del DOM (`state: 'visible'`, `toBeEditable()`, `toBeEnabled()`).
- **Aislamiento absoluto de contextos (`BrowserContext`)**: Cada escenario de Cucumber corre en un contexto de navegador nuevo y aislado, previniendo fugas de cookies, LocalStorage o estado de sesión entre pruebas.
- **Selectores semánticos y dedicados**: Se utilizan atributos dedicados `[data-test="..."]`, inmunes a cambios de diseño CSS o reestructuración del árbol DOM.
- **Captura de artefactos en fallos**: Traces (`trace.zip`), capturas de pantalla automáticas y logs estructurados para diagnóstico inmediato en CI sin necesidad de reproducir a ciegas.

### 4. ¿Qué estrategia de localizadores usaste y por qué (rol/test-id vs. xpath)?
- **Estrategia Elegida**: `[data-test="..."]` y selectores semánticos nativos de Playwright.
- **Justificación**:
  - Los selectores basados en atributos de prueba (`data-test`, `data-testid`) o roles de accesibilidad (`getByRole`) son el estándar de la industria.
  - Se evitó por completo el uso de XPath absolutos (`/html/body/div...`) o selectores CSS fuertemente acoplados al estilo (`.btn.btn_primary.btn_small`), ya que son la causa número uno de fragilidad ante refactorizaciones de frontend.

### 5. ¿Qué hiciste con `problem_user` y `performance_glitch_user`?
- Ambos perfiles fueron catalogados e integrados en `UserFactory`.
- **Criterio Técnico**: `problem_user` tiene bugs conocidos introducidos intencionalmente por Sauce Labs (imágenes rotas, fallos al agregar ítems al carrito, campos de checkout bloqueados). En mi estrategia de pruebas, estos usuarios los utilizo para **suites de verificación de degradación y pruebas de robustez de localizadores**, asegurando que los fallos del SUT sean reportados con precisión sin corromper la suite de regresión principal. Para `performance_glitch_user`, el framework soporta timeouts configurables explícitos mediante variables de entorno (`DEFAULT_TIMEOUT=15000`).

### 6. ¿Qué dejarías para una v2 de esta suite con más tiempo?
- **Integración con Playwright Component Testing / Mock Service Worker** para interceptar llamadas de red y simular fallos de API 500/404.
- **Soporte de Dockerfile** para ejecuciones containerizadas idénticas entre entornos de desarrollo local y pipelines de CI/CD.
