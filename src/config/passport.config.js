import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { userService } from "../users/users.dao.js";
import { createHash, isValidPassword } from "../utils.js";
import config from "./config.js";

const LocalStrategy = local.Strategy;

//SET PASSPORT STRATEGY PARA REGISTER, LOGIN Y GITHUB

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, role, age } = req.body;
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
            age,
            password: createHash(password),
            role,
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
          if (
            username === config.adminEmail &&
            password === config.adminPassword
          ) {
            let superAdmin = {
              firstName: "CoderHouse",
              lastName: "",
              email: "Coderuser@gmail.com",
              age: 50,
              password: "",
              role: "superAdmin",
            };

            return done(null, superAdmin);
          }

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
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
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
              age: " ",
              role: "usuario Github",
            };

            let result = await userService.createUser(newUser);
            let { _doc } = result;
            delete _doc.password;
            return done(null, _doc);
          } else {
            let { _doc } = user;
            delete _doc.password;
            return done(null, _doc);
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
