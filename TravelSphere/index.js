const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const app = express();
const users = data.users;
const jwtconfig = data.jwtconfig;

app.use(express.json()); 
app.use(cors());

const port = 3010;
const corsOptions = {
    origin: 'http://127.0.0.1:5500',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// REGISTER ROUTE

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    email,
  };
  users.push(newUser);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.status(201).send("The user was registered");
});

// LOGIN ROUTE

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtconfig.secretKey,
      { expiresIn: jwtconfig.expiresIn }
    );
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (token) {
    jwt.verify(token, jwtconfig.secretKey, (err, decoded) => {
      if (err) {
        res.status(403).send("Invalid token");
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send("Token not provided");
  }
};

// PROTECTED ROUTE

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Data protected", user: req.user });
});


app.listen(port, () => {
  console.log(`Server is now running on port ${port}`); 
});
