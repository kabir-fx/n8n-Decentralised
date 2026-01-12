import bcrypt from "bcryptjs";
import { signupSchema } from "common/types";
import { config } from "./config.js";
import { UserModel } from "db";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose.connect(config.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  console.log("Database Name:", mongoose.connection.name);
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "Healthy",
  });
});

app.post("/signup", async (req, res) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      msg: "Incorrect Input details",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 11);

    const user = await UserModel.create({
      username: data.username,
      password: hashedPassword,
    });
    res.status(200).json({
      msg: "User Created",
      id: user._id,
    });
  } catch (error) {
    res.status(409).json({
      msg: "User already exists",
      err: error,
    });
  }
});

app.post("/signin", async (req, res) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      msg: "Incorrect Input details",
    });
    return;
  }

  try {
    const user = await UserModel.findOne({
      username: data.username,
    });

    if (!user) {
      res.status(403).json({
        msg: "user not found",
      });
      return;
    }

    const verifiedPassword = bcrypt.compare(user.password, data.password);

    if (!verifiedPassword) {
      res.status(403).json({
        msg: "Incorrect password",
      });
      return;
    } else {
      const token = jwt.sign(
        {
          userID: user._id.toString(),
        },
        config.JWT_SECRET
      );

      res.json({
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Internal server failed while user verification!",
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.token;

  const jwt_verified_response = jwt.verify(token, config.JWT_SECRET);

  if (jwt_verified_response) {
    req.userID = jwt_verified_response.userID;

    next();
  } else {
    res.status(403).json({
      message: "invalid token",
    });
  }
}

app.get("/canvas", (req, res) => {});

app.post("/canvas", (req, res) => {});

app.put("/canvas", (req, res) => {});

// Returns all the nodes present in the DB
app.get("/nodes", (req, res) => {});

app.listen(config.PORT, () => {
  console.log(`Backend running on port ${config.PORT}`);
});
