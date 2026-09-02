# language: es
@e2e
Característica: HU-2 & HU-3 - Operación Principal y Verificación de Estado (Flujo E2E de Compra)
  Como usuario autenticado de SauceDemo
  Quiero seleccionar productos, agregarlos al carrito y completar el checkout
  Para adquirir los artículos y verificar que la orden se procesó correctamente

  Antecedentes:
    Dado que el usuario inicia sesión con credenciales válidas

  @smoke @regression @HU-2 @HU-3 @tc-e2e-01
  Escenario: Flujo completo de compra E2E con múltiples productos y verificación de estado
    Dado que el usuario se encuentra en el catálogo de productos
    Cuando el usuario agrega los siguientes productos al carrito:
      | producto                |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    Entonces el carrito de compras debería mostrar un contador de 3 productos
    Cuando el usuario navega a la página del carrito
    Entonces el carrito debería contener exactamente los siguientes productos:
      | producto                |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    Cuando el usuario procede al checkout
    Y completa el formulario de información con datos válidos
    Y continúa al resumen de la orden
    Entonces el sistema debería mostrar el desglose de precios calculado correctamente:
      | validacion_subtotal |
      | validacion_impuesto |
      | validacion_total    |
    Cuando el usuario finaliza la compra
    Entonces la orden debería completarse exitosamente mostrando el mensaje "Thank you for your order!"
    Y el texto descriptivo de confirmación debería indicar "Your order has been dispatched, and will arrive just as fast as the pony can get there!"

  @regression @HU-2 @tc-e2e-02
  Escenario: Adición y remoción dinámica de productos desde el inventario y carrito
    Dado que el usuario se encuentra en el catálogo de productos
    Cuando el usuario agrega el producto "Sauce Labs Backpack" al carrito
    Y el usuario agrega el producto "Sauce Labs Onesie" al carrito
    Entonces el carrito de compras debería mostrar un contador de 2 productos
    Cuando el usuario remueve el producto "Sauce Labs Backpack" desde el inventario
    Entonces el carrito de compras debería mostrar un contador de 1 productos
    Cuando el usuario navega a la página del carrito
    Y el usuario remueve el producto "Sauce Labs Onesie" desde el carrito
    Entonces el carrito debería estar vacío
