# language: es
@auth
Característica: HU-1 - Autenticación de Usuarios en SauceDemo
  Como usuario de SauceDemo
  Quiero autenticarme en la plataforma
  Para acceder al catálogo de productos y realizar compras

  Antecedentes:
    Dado que el usuario navega a la página de inicio de sesión

  @smoke @regression @HU-1 @tc-auth-01
  Escenario: Inicio de sesión exitoso con credenciales válidas
    Cuando el usuario inicia sesión con credenciales válidas
    Entonces el usuario debería ser redirigido a la página de productos
    Y el título de la página debería ser "Products"

  @regression @negative @HU-1 @tc-auth-02
  Escenario: Intento de inicio de sesión con usuario bloqueado
    Cuando el usuario intenta iniciar sesión con una cuenta bloqueada
    Entonces debería mostrarse el mensaje de error "Epic sadface: Sorry, this user has been locked out."

  @regression @negative @HU-1 @tc-auth-03
  Esquema del escenario: Intento de inicio de sesión con credenciales inválidas o incompletas
    Cuando el usuario intenta iniciar sesión con el criterio de error "<criterio>"
    Entonces debería mostrarse el mensaje de error "<mensaje_error>"

    Ejemplos:
      | criterio              | mensaje_error                                                              |
      | password_incorrecto   | Epic sadface: Username and password do not match any user in this service |
      | usuario_vacio         | Epic sadface: Username is required                                         |
      | password_vacio        | Epic sadface: Password is required                                         |
      | usuario_no_registrado | Epic sadface: Username and password do not match any user in this service |
