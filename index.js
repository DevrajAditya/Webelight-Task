const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc")

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Db is connected Successfully"))
  .catch((err) => {
    console.log("Error", err);
  });

app.use(
  session({
    name: "",
    secret: process.env.PASSWORD_SEC,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

app.use(express.json());

const swaggerOptions = {
      definition:{
          openapi: '3.0.0',
          info:{
              title: 'Webelight Assignment',
              version: '1.0.0',
              description: 'Do Some CRUD Operation through an Api On User and Product Module',
              contact:{
                    name: 'Aditya Kumar jha',
                    email: 'jhaaditya0101@gmail.com'
              },
              servers:["http://localhost:3000"]              

          }
          
      },
      apis:["index.js"]
}
const swaggerDocs =swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *    username:
 *     type: string
 *     description: name of the user
 *     example: 'Aditya'
 *     required: true
 *    email:
 *     type: string
 *     description: user email
 *     example: 'test@gmail.com'
 *     required: true
 *    password:
 *     type: string
 *     description: Enter the password
 *     example: '*******'
 *     required: true
 *  Product:
 *   type: object
 *   properties:
 *    title:
 *     type: string
 *     description: Provide the Title of the Product
 *     example: 'javscript'
 *     required: true
 *    img:
 *     type: string
 *     description: Provide img url
 *     example: ''
 *    categories:
 *     type: Array
 *     description: provides the list of category
 *     example: ["Jeans", "man", "woman"]
 *    color:
 *     type: Array
 *     description: description of the team
 *     example: ["Red", "Black", "Blue"]
 *    size:
 *     type: Array
 *     description: Provide the Multiple Size of the Product
 *     example: ["M", "L", "XL"]
 *    price:
 *     type: Integer
 *     description: provide the Price of the product
 *     example: '₹ 1599'
 *     required: true
 * 
 */


// Register User
/**
 * @swagger
 * /api/auth/register:
 *  post:
  *   summary: register user
  *   description: create a new user  for our project
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/api/auth/register'
  *   responses:
  *    201:
  *     description: user created succesfully
  *    500:
  *     description: failure in creating user
 *      
 */

// Login user
/**
 * @swagger
 * /api/auth/login:
 *  post:
  *   summary: Login User
  *   description: Provide email and Password
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/api/auth/login'
  *   responses:
  *    200:
  *     description: user Logged in succesfully
  *    500:
  *     description: failure to Logged in
 *      
 */

// Delete User

/**
 * @swagger
 * /api/user/{_id}:
 *  delete:
 *   summary: delete user
 *   description: delete user
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: we need id of the user for delete the record of the user
 *   responses:
 *    200:
 *     description: user delete successfull
 */

app.use("/api/auth", authRoute);

/**
 * @swagger
 * /api/auth/logout:
 *  get:
 *   summary: Logout from the website
 *   description: Logout
 *   responses:
 *    200:
 *     description: successfull logout
 *    500:
 *     description: error
 */

app.use("/api/user", userRoute);

// get All user
/**
 * @swagger
 * /api/user:
 *  get:
 *   summary: Get All user
 *   description: Get all the User
 *   responses:
 *    200:
 *     description: successfull
 *    500:
 *     description: error
 */

// Get Single user

/**
 * @swagger
 * /api/user/{_id}:
 *  get:
 *   summary: Get Single user
 *   description: Get single user
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the user
 *   responses:
 *    200:
 *     description: successfull
 *    500:
 *     description: error
 */

// Update User

/**
 * @swagger
 * /api/user/{_id}:
 *  put:
 *   summary: update User
 *   description: update User
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: we need Id of  the user
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/api/user'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/api/user'
 *   responses:
 *    200:
 *     description: Update user successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/api/user'
 */

app.use("/api/products", productRoute);

// Create a Product
/**
 * @swagger
 * /api/products/:
 *  post:
  *   summary: Craete a Product
  *   description: Provide Product Details
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/api/products/'
  *   responses:
  *    200:
  *     description: Product is craeted succesfully
  *    400:
  *     description: You Are Not Authenticated
  *    500:
  *     description: failure to Create a Product
 *      
 */

// Get Single Product
/**
 * @swagger
 * /api/products/find/{_id}:
 *  get:
 *   summary: Get Single Product using Product Id
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the employee
 *   description: Get single Product
 *   responses:
 *    200:
 *     description: successfull
 *    500:
 *     description: error
 */

  // Get All Product
/**
 * @swagger
 * /api/products/:
 *  get:
 *   summary: Get All Product
 *   description: Get All Product
 *   responses:
 *    200:
 *     description: successfull
 *    500:
 *     description: error
 */

// Update a Products

/**
 * @swagger
 * api/products/{_id}:
 *  put:
 *   summary: update product
 *   description: update Product
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: we need id of the product
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/api/products'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/api/products'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/api/products'
 */

// Delete Products 

/**
 * @swagger
 * /api/products/{_id}:
 *  delete:
 *   summary: delete Product
 *   description: delete product
 *   parameters:
 *    - in: path
 *      name: _id
 *      schema:
 *       type: string
 *      required: true
 *      description: we need id of the Product for delete the record of the Product
 *   responses:
 *    200:
 *     description: user delete successfull
 */

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend Server is runing at 3000 Port");
});
