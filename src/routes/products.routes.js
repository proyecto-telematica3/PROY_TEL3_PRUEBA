const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const bcryptjs = require('bcryptjs');

///////////////////////////////////CREACION Y GESTION DE PRODUCTOS //////////////////////

// Creacion Producto
router.post("/create/product", async (req, res) => {
  console.log("PETICION POST /create/product realizada")
  try {
    const { name, cantidad, precio } = req.body;

    if (!name || !cantidad || !precio) {
      return res.status(400).json({ error: 'Debes proporcionar nombre, cantidad y precio.' });
    }

    await db
      .collection("products")
      .doc(name)
      .create({ name, cantidad, precio });

    return res.status(200).json({ message: 'Producto creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).send(error);
  }
});
//Caracteristicas de un producto especifico
router.get("/products/:product_id", async (req, res) => {
  console.log("PETICION GET /products/:product_id realizada")
  try {
    const doc = db.collection("products").doc(req.params.product_id);
    const item = await doc.get();

    if (!item.exists) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const data = item.data();
    const response = {
      name: data.name,
      cantidad: data.cantidad,
      precio: data.precio
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).send(error);
  }
});
//Obterner el listado de los productos
router.get("/products", async (req, res) => {
  console.log("PETICION GET /products realizada")
  try {
    let query = db.collection("products");
    const querySnapshot = await query.get();
    let docs = querySnapshot.docs;

    const response = docs.map((doc) => ({
      name: doc.data().name,
      cantidad: doc.data().cantidad,
      precio: doc.data().precio
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//Actualizar informacion de productos
router.put("/products/:product_id", async (req, res) => {
  console.log("PETICION PUT /products/:product_id realizada")
  try {
    const document = db.collection("products").doc(req.params.product_id);
    const updateData = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.cantidad) {
      updateData.cantidad = req.body.cantidad;
    }

    if (req.body.precio) {
      updateData.precio = req.body.precio;
    }

    await document.update(updateData);

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});
//borrar un producto
router.delete("/products/delete/:product_id", async (req, res) => {
  console.log("PETICION DELETE /products/delete/:product_id realizada")
  try {
    const doc = db.collection("products").doc(req.params.product_id);
    await doc.delete();
    return res.status(200).json('Product was deleted successfully');
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////USUARIOS PERFIL ADMIN/////////////////////////////////

//Creacion usuario perfil ADMIN

router.post("/create/admin", async (req, res) => {
  console.log("PETICION POST /create/admin realizada")
  try {
    const { user, password, email } = req.body; 

    if (!user || !password || !email) {
      return res.status(400).json('Se requieren el nombre de usuario, la contraseña y el correo electrónico.');
    }

    let passwordHash = await bcryptjs.hash(password, 8);

    await db
      .collection("admin")
      .doc(user)
      .create({ user, password: passwordHash, email });

    return res.status(200).json('Admin User was created');
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Authenticacion de usuario perfil ADMIN

router.post("/login/admin", async (req, res) => {
  console.log("PETICION POST /login/admin realizada")
  const { user, password } = req.body; // Desestructura el objeto req.body

  if (!user || !password) {
    return res.status(400).json('Se requieren tanto el nombre de usuario como la contraseña.');
  }

  const docRef = db.collection("admin").doc(user);

  try {
    const doc = await docRef.get();

    if (doc.exists) {
      const storedPassword = doc.data().password;
      const compare = bcryptjs.compareSync(password, storedPassword);

      if (compare) {
        return res.status(200).json("¡AUTENTICACIÓN EXITOSA!");
      } else {
        return res.status(401).json('Contraseña incorrecta');
      }
    } else {
      return res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al verificar el documento:", error);
    return res.status(500).json(error);
  }
});

//Mostrar usuarios perfil ADMIN

router.get("/users/admin", async (req, res) => {
  console.log("PETICION GET /users/admin realizada")
  try {
    let query = db.collection("admin");
    const querySnapshot = await query.get();
    let docs = querySnapshot.docs;

    const response = docs.map((doc) => ({
      user: doc.data().user,
      email: doc.data().email
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Actualizar informacion usuario perfil ADMIN

router.put("/users/admin/:users_id", async (req, res) => {
  console.log("PETICION PUT /users/admin/:users_id realizada")
  try {
    const users_id = req.params.users_id;
    const { user, password, email } = req.body;

    const document = db.collection("admin").doc(users_id);
    const name = await document.get();

    if (!name.exists) {
      return res.status(404).json('Usuario no encontrado');
    }

    let updatedFields = {};

    if (user) {
      updatedFields.user = user;
    }

    if (password) {
      const passwordHash = await bcryptjs.hash(password, 8);
      updatedFields.password = passwordHash;
    }

    if (email) {
      updatedFields.email = email;
    }

    await document.update(updatedFields);

    return res.status(200).json('Usuario administrador actualizado correctamente');
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Borrar usuario perfil administrador

router.delete("/users/admin/delete/:users_id", async (req, res) => {
  console.log("PETICION DELETE /users/admin/delete/:users_id realizada")
  try {
    const users_id = req.params.users_id;

    if (!users_id) {
      return res.status(400).json('Se requiere el ID del usuario administrador.');
    }

    const document = db.collection("admin").doc(users_id);
    const user = await document.get();

    if (!user.exists) {
      return res.status(404).json('Usuario administrador no encontrado');
    }

    await document.delete();

    return res.status(200).json('Usuario administrador eliminado correctamente');
  } catch (error) {
    console.error("Error al eliminar el usuario administrador:", error);
    return res.status(500).json(error);
  }
});

///////////////////////////////////USUARIOS PERFIL CLIENTE///////////////////////////////////////////////////

//Crear cuenta usuario perfil CLIENTE

router.post("/create/users", async (req, res) => {
  console.log("PETICION POST /create/users realizada")
  try {
    const { user, password, email } = req.body; 

    if (!user || !password || !email) {
      return res.status(400).json('Se requieren el nombre de usuario, la contraseña y el correo electrónico.');
    }

    let passwordHash = await bcryptjs.hash(password, 8);

    await db
      .collection("users")
      .doc(user)
      .create({ user, password: passwordHash, email });

    return res.status(200).json('Customer User was created');
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Autenticacion usuario perfil CLIENTE

router.post("/login/users", async (req, res) => {
  console.log("PETICION POST /login/users realizada")
  const { user, password } = req.body; 

  if (!user || !password) {
    return res.status(400).json('Se requieren tanto el nombre de usuario como la contraseña.');
  }

  const docRef = db.collection("users").doc(user);

  try {
    const doc = await docRef.get();

    if (doc.exists) {
      const storedPassword = doc.data().password;
      const compare = bcryptjs.compareSync(password, storedPassword);

      if (compare) {
        return res.status(200).json("¡AUTENTICACIÓN EXITOSA!");
      } else {
        return res.status(401).json('Contraseña incorrecta');
      }
    } else {
      return res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al verificar el documento:", error);
    return res.status(500).json(error);
  }
});

//Mostrar usuarios perfil CLIENTE

router.get("/users", async (req, res) => {
  console.log("PETICION GET /users realizada")
  try {
    let query = db.collection("users");
    const querySnapshot = await query.get();
    let docs = querySnapshot.docs;

    const response = docs.map((doc) => ({
      user: doc.data().user,
      email: doc.data().email
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Actualizar usuarios perfil CLIENTE

router.put("/users/:users_id", async (req, res) => {
  console.log("PETICION PUT /users/:users_id realizada")
  try {
    const users_id = req.params.users_id;
    const { user, password, email } = req.body;

    const document = db.collection("users").doc(users_id);
    const name = await document.get();

    if (!name.exists) {
      return res.status(404).json('Usuario no encontrado');
    }

    let updatedFields = {};

    if (user) {
      updatedFields.user = user;
    }

    if (password) {
      const passwordHash = await bcryptjs.hash(password, 8);
      updatedFields.password = passwordHash;
    }

    if (email) {
      updatedFields.email = email;
    }

    await document.update(updatedFields);

    return res.status(200).json('Usuario administrador actualizado correctamente');
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Borrar usuario perfil CLIENTE

router.delete("/users/delete/:users_id", async (req, res) => {
  console.log("PETICION DELETE /users/delete/:users_id realizada")
  try {
    const users_id = req.params.users_id;

    if (!users_id) {
      return res.status(400).json('Se requiere el ID del usuario administrador.');
    }

    const document = db.collection("users").doc(users_id);
    const user = await document.get();

    if (!user.exists) {
      return res.status(404).json('Usuario no encontrado');
    }

    await document.delete();

    return res.status(200).json('Usuario eliminado correctamente');
  } catch (error) {
    console.error("Error al eliminar el usuario administrador:", error);
    return res.status(500).json(error);
  }
});
  
module.exports = router;
