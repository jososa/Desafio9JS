import { userService } from "../dao/services/users.service.js"
import { cartService } from "../dao/services/carts.service.js"
import { createHash, isValidPassword } from "../utils/utils.js"
import { logger } from "../utils/Logger.js"

class UserController {

    async registerUser(req, username, password, done){
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userService.findUserByEmail(username)
            if(user){
                logger.warning("El usuario ya se encuentra registrado")
                return done(null, false)
            }

            const cart = await cartService.createCart()

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart,
                role: "usuario"
            }
            const result = userService.createUser(newUser)
            logger.info("Usuario creado con exito", newUser)
            return done(null, result)
        } catch (error) {
            logger.error(error)
            return done(error)
        }
    }

    async loginUser(username, password, done){
        try {
            if (
              username === "adminCoder@coder.com" &&
              password === "adminCod3r123"
            ) {

              const adminUser = {
                first_name: "Admin",
                last_name: "Coder",
                email: "adminCoder@coder.com",
                age: 33,
                role: "admin",
              }
              return done(null, adminUser)
            }
  
            const user = await userService.findUserByEmail(username)
            if (!user){
                logger.fatal("Usuario no encontrado")
                return done(null, false)
            }

            const valid = isValidPassword(user, password)
            if (!valid) return done(null, false)
  
            return done(null, user)
          } catch (error) {
            logger.error("Usuario no encontrado", error)
            return done(error)
          }
    }

    async loginGithub(accessToken, refreshToken, profile, done) {
        try {
            const user = userService.findUserByEmail(profile._json.email)
            if(!user){
                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 33,
                    email: profile._json.email,
                    password: "",
                    role: "usuario"
                }
                let createdUser = await userService.createUser(newUser)
                done(null, createdUser)
            } else{
                done(null, user)
            }
        } catch (error) {
            logger.error("Usuario no encontrado", error)
            return done(error)
        }
    }

}

export const userController = new UserController()