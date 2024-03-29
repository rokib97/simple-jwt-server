const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Hello from simple JWT Server");
});

app.post("/login", (req, res) => {
  const user = req.body;
  if (user.email === "user@gmail.com" && user.password === "123456") {
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.send({
      success: true,
      accessToken: accessToken,
    });
  }
  res.send({ success: false });
});

app.get("/orders", verifyJWT, (req, res) => {
  res.send([
    { id: 1, item: "sunglass" },
    { id: 12, item: "moonlass" },
  ]);
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
