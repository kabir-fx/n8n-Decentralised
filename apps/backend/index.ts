import { signupSchema } from "common/types";
import { UserModel } from "db";
import express from "express";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log("Connected to MongoDB");
    console.log("Database Name:", mongoose.connection.name);
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "Healthy"
    })
})

app.post("/signup", async (req, res) => {
    const { success, data } = signupSchema.safeParse(req.body);
    if (!success) {
        res.status(403).json({
            msg: "Incorrect Input details"
        })
        return
    }

    try {
        const user = await UserModel.create({
            username: data.username,
            password: data.password
        })
        res.status(200).json({
            msg: "User Created",
            id: user._id
        })
    } catch (error) {
        res.status(411).json({
            msg: "User already exists"
        })
    }
})

app.post("/signin", (req, res) => {

})

app.get("/canvas", (req, res) => {

})

app.post("/canvas", (req, res) => {

})

app.put("/canvas", (req, res) => {

})

// Returns all the nodes present in the DB
app.get("/nodes", (req, res) => {

})

app.listen(2099, () => {
    console.log("Backend running on port 2099");
});