import { pool } from "../../bd.js";
import multer from "multer";
import fs from "node:fs/promises";

async function index(req, res) {
  try {
    const sql = "SELECT * FROM usuarios";
    const [usuarios] = await pool.execute(sql);
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function show(req, res) {
  const { id } = req.params;
  try {
    const sql = "SLEECT * FROM usuarios WHERE id_usuario = ? ";

    const [usuarios] = await pool.execute(sql, [id]);

    if (usuarios.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(usuarios[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const MIMETYPE = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (MIMETYPE.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${MIMETYPE.join(" , ")} mimetype are allowed`), false);
    }
  },
  limits: {
    fileSize: 40000000,
  },
});

async function store(req, res) {
  try {
    const { nombre, email, rol } = req.body;
    const picture = req.file ? req.file.filename : null;
    const sql =
      "INSERT INTO usuarios (nombre, email, rol, picture) VALUE (?,?,?,?)";
    await pool.execute(sql, [nombre, email, rol, picture]);
    return res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { nombre, email, rol } = req.body;
    const { id } = req.params;
    const sql =
      "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?";
    await pool.execute(sql, [nombre, email, rol, id]);

    return res
      .status(200)
      .json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function destroy(req) {
  const { headers, params } = req;

  try {
     const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    await pool.execute(sql, [id]);

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export { index, show, store, update, destroy, upload  };
