require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
require('../src/db/conn');
const Register = require('./models/register');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialPath); // to use partials

app.get('/', (req, res) => {
  console.log('okok');
  res.render('index');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password == cpassword) {
      const registerEmp = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      });
      console.log('success part', registerEmp);
      const token = await registerEmp.generateAuthToken();
      console.log('token part', token);

      const registered = await registerEmp.save();
      console.log('registered part', registered);
      res.status(201).render('index');
    } else {
      res.send('password not match');
    }
  } catch (e) {
    res.status(400).send(e);
    console.log('Error part ');
  }
});

// login check

app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();
    console.log('login token part', token);
    console.log(isMatch);
    if (isMatch) {
      // res.status(201).render('index');
      // const token = await registerEmp.generateAuthToken();

      // res.send(userEmail);
      res.status(201).render('index');
    } else {
      res.send('invalid login details');
    }
  } catch (e) {
    res.status(400).send('400 invalid login details');
  }
});

/// jwt
// const jwt = require('jsonwebtoken');

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: '62428535bdff084ab13e7230' },
//     'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasassasassasassasassasasassasassa',
//     {
//       expiresIn: '10 seconds',
//     }
//   );
//   console.log('JWT', token);
//   const userVar = await jwt.verify(
//     token,
//     'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasassasassasassasassasasassasassa'
//   );
//   console.log(userVar);
// };
// createToken();

app.listen(port, () => {
  console.log(`server is running at port : ${port}`);
});
