const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./utils/database");
const initModels = require("./models/initModels");
const authRoutes = require("./routes/auth.routes");
const transporter =  require("./utils/mailer");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

initModels();

db.authenticate()
  .then(() => console.log("Base de datos autenticada"))
  .catch((error) => console.log(error));

db.sync({ force: false })
  .then(() => console.log("Base de datos sincronizada"))
  .catch((error) => console.log(error));
  const sendMail = async() => {
    await transporter.sendMail({
      from: "ian.rosas@academlo.com",
      to:"ian.rosas@academlo.com",
      subjetc:"prueba de node mailer",
      text:"hola nodemailer",
      html: "<>hola node mailer</>"

    })
  }

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my server" });
});
app.use("/api/v1/auth",authRoutes);

module.exports = app;
