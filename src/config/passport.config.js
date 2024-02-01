import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { userService } from "../dao/service/usersDao.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

//SET PASSPORT STRATEGY PARA REGISTER, LOGIN Y GITHUB

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, roll } = req.body;
        try {
          let user = await userService.getUserByEmail(username);
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }
          const newUser = {
            firstName,
            lastName,
            email,
            password: createHash(password),
            roll,
          };

          let result = await userService.createUser(newUser);
          delete result.password;
          return done(null, result);
        } catch (err) {
          return done("Error al obtener el usuario");
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getUserByEmail(username);

          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.2ecfd9bfe15b8962",
        clientSecret: "f0ab08876f597c2f2010a32a02f3e89dfc284b64",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.getUserByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              firstName: profile.username,
              lastName: " ",
              email: profile._json.email,
              password: " ",
              roll: "usuario Github",
            };

            let result = await userService.createUser(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done("Error al obtener el usuario:" + err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.getUserByEmail(id);
    done(null, user);
  });
};

export default initializePassport;
