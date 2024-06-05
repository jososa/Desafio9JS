import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import { environment } from "./config.js"
import { userController } from "../controllers/userController.js"
import { userService } from "../dao/services/users.service.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {

    //Estategia registro usuario
    passport.use("register", new LocalStrategy(
        { passReqToCallback:true, usernameField: "email" },
    async(req, username, password, done) => {
            userController.registerUser(req, username, password, done)
    } ))

    //Estrategia de login
    passport.use(
        "login",
        new LocalStrategy(
          { usernameField: "email" },
          async (username, password, done) => {
            userController.loginUser(username, password, done)
          }
        )
      )

    //Login con github
    passport.use("github", new GitHubStrategy({
        clientID: environment.clientId,
        clientSecret: environment.clientSecret,
        callBackURL: environment.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
        userController.loginGithub(accessToken, refreshToken, profile, done)
    }))

    passport.serializeUser((user, done) => {
        if(user._id){
            done(null, user._id)
        } else{
            done(null,"admin")
        }
    })

    passport.deserializeUser(async (id, done) => {
        try {
            if(id === "admin"){
                const adminUser = {
                    first_name: "Admin",
                    last_name: "Coder",
                    email: "adminCoder@coder.com",
                    age: 33,
                    role: "admin"
                }
                done(null, adminUser)
            } else{
                let user = await userService.findUserByEmail(id)
                done(null, user)
            }
        } catch (error) {
            done(error)
        }
    })

}

export default initializePassport