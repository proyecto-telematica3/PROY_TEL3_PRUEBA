# Proy_Tel3_Prueba

Rutas activas del proyecto:
| Ruta | Metodo | Observaciones |
| ------------- | ------------- |------------- |
| '/create/product' | POST | Requiere name cantidad precio (enviados por el __body__ de la peticion en formato JSON)   |
| /products/:product_id | GET | Requiere ID (enviado por los __query/parmas__ y devuelve el producto buscado si existe) |
| /products | GET | Responde un archivo JSON con la lista de productos |
| /products/:product_id | PUT | Actualiza la informacion de un producto, Requiere ID |
| /products/delete/:product_id | DELETE | Requiere ID, elimina el producto seleccionado |
| /create/admin | POST | Requiere user password email (enviados por el __body__ de la peticion en formato JSON) |
| /login/admin | POST | Requiere user password (enviados por el __body__ de la peticion en formato JSON) |
| /users/admin | GET | Responde un archivo JSON con la lista de usuarios con perfil de ADMIN |
| /users/admin/:users_id | PUT | Actualiza informacion usuario perfil ADMIN, Requiere ID |
| /users/admin/delete/:users_id | DELETE | Requiere ID, elimina el usuario seleccionado |
| /create/users | POST | Requiere user password email (enviados por el __body__ de la peticion en formato JSON)
| /login/users | POST | Requiere user password (enviados por el __body__ de la peticion en formato JSON) |
| /users/users | GET | Responde un archivo JSON con la lista de usuarios con perfil de ADMIN |
| /users/admin/:users_id | PUT | Actualiza informacion usuario, Requiere ID |
| /users/delete/:users_id | DELETE | Requiere ID, elimina el usuario seleccionado |
