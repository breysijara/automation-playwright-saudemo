# language: es
@boundary @regression
Característica: HU-4 - Casos Negativos y de Borde en Checkout (Partición de Equivalencia y Valores Límite)
  Como usuario en el proceso de compra de SauceDemo
  Quiero que el sistema valide rigurosamente los campos del formulario de checkout
  Para prevenir envíos incompletos o inconsistentes

  Antecedentes:
    Dado que el usuario inicia sesión con credenciales válidas
    Y el usuario agrega el producto "Sauce Labs Fleece Jacket" al carrito
    Y el usuario navega a la página del carrito
    Y el usuario procede al checkout

  @regression @negative @boundary @HU-4 @tc-boundary-01
  Esquema del escenario: Validación de campos obligatorios faltantes con partición de equivalencia
    Cuando el usuario completa el formulario de checkout con nombre "<nombre>", apellido "<apellido>" y código postal "<codigo_postal>"
    Y hace clic en continuar
    Entonces debería mostrarse el mensaje de error de checkout "<mensaje_error>"

    Ejemplos:
      | nombre | apellido | codigo_postal | mensaje_error                      |
      |        | Perez    | 110111        | Error: First Name is required      |
      | Carlos |          | 110111        | Error: Last Name is required       |
      | Carlos | Perez    |               | Error: Postal Code is required     |
      |        |          |               | Error: First Name is required      |

  @regression @boundary @HU-4 @tc-boundary-02
  Esquema del escenario: Validación de datos de borde y caracteres especiales en formulario de checkout
    Cuando el usuario ingresa datos de cliente con tipo de borde "<tipo_borde>"
    Y hace clic en continuar
    Entonces el usuario debería avanzar exitosamente al resumen de la orden

    Ejemplos:
      | tipo_borde     |
      | min_length     |
      | max_length     |
      | special_chars  |
      | numeric_names  |
