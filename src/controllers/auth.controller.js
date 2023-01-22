const { use } = require("../routes/auth.routes");
const AuthServices = require("../services/auth.services");
const bcrypt = require("bcrypt");
require ("dotenv").config();
const transporter = require("../utils/mailer");
const register = async (req, res) => {
    try{
    const user = req.body;
    const {password} = user;
    const hash =  bcrypt.compareSync(password, 10);
    user.password = hash;
    const result = await AuthServices.register(user);
    if (result) {
        res.status(201).json({message: 'user created'});
        await transporter.sendMail({
            to: result.email,
            from: "ian.rosas@academlo.com",
            subjetc: "Email confirmation",
            html: "<h1>Bienvenido a la mejor app de chat creada por mi</h1> <p>Tienes que confirmar tu email</p><p> Solo haz click en el siguiente <a href='#'' target='new_blank'> enlace </a>",
        });   
    } else{
        res.status(400).json({message: 'somethign  wrong'});
    }

    } catch (error) {
        res.status(400).message(error.message);

    }
};
const login = async(req,res) =>  {
        try{
            const {email,password} = req.body;
            if (!email){
                return res.status(400).json({
                    error: "Missing data",
                    message: "Not email provided",
                  });
            }
            if (!password) {
                return res.status(400).json({
                  error: "Missing data",
                  message: "Not password provided",
                });
            }
            const result = await AuthServices.login({ email, password });
            console.log(result); //field || credentials
            if (result.isValid) {
              const { username, id, email } = result.user;
              const userData = { username, id, email };
              const token = AuthServices.genToken(userData);
              result.user.token = token;
              res.json(result.user);  
            } else {
                res.status(400).json({ message: "user not found" });
            }
            // usuario no encontrado
            // contraseña incorrecta
        } catch (error) {
            res.status(400).json({ message: "Something wrong" }); 
          

       
        
        }

};

module.exports = {
    register,
    login,
};