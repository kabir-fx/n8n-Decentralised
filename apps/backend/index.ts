import bcrypt from "bcryptjs";
import cors from "cors";
import { signupSchema } from "common/types";
import { config } from "./config.js";
import { UserModel, WorkflowModel } from "db";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose.connect(config.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  console.log("Database Name:", mongoose.connection.name);
});

const app = express();

// Enable CORS for frontend dev server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token || typeof token !== "string") {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/canvas", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userID;

  const getWorkflow = await WorkflowModel.findOne({
    userId,
  });

  return res.json({
    workflow: getWorkflow,
  });
});

app.post("/workflow", authMiddleware, async (req, res) => {
  const { name, nodeProperties, edges } = req.body;

  if (!nodeProperties || !edges) {
    return res.status(400).json({
      msg: "Missing fields",
    });
  }

  try {
    const workflow = await WorkflowModel.create({
      userId: req.userID,
      name,
      nodeProperties,
      edges,
      isActive: false,
    });

    res.status(201).json({
      msg: "Workflow created",
      workflowId: workflow._id,
    });
  } catch (error) {
    console.error("Workflow creation error:", error);
    res.status(500).json({ msg: "Failed to create workflow" });
  }
});

app.put("/canvas", (req, res) => {});

// Returns all the nodes present in the DB
app.get("/nodes", (req, res) => {});

app.listen(config.PORT, () => {
  console.log(`Backend running on port ${config.PORT}`);
});
