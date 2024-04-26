const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
app.use(express.json());
require('dotenv').config();


// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("DATABASE CONNECTED");
        // Start the server once the database is connected
        app.listen(port, () => {
            console.log(`Server is running on port ${process.env.DB_PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to database:", err);
        process.exit(1); // Exit the process with an error code
    });


// SCHEMA
const userSchema = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String },
    email: { type: String, require: true, unique: true },
    gender: { type: String },
    jobTitle: { type: String }
})

// MODEL
const User = mongoose.model("user", userSchema)



// =======================================================APIS==================================================================================================================
// ADD USER IN THE DATABASE 
app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (!body || !body.firstName || !body.lastName || !body.email || !body.gender || !body.jobTitle) {
        return res.status(400).json({ msg: body })
    }

    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        jobTitle: body.jobTitle,
        gender: body.gender
    })

    return res.status(201).json({ msg: result })
})

// GET USER IN THE DATABASE 
app.get("/api/users", async (req, res) => {
    const body = req.body;

    const result = await User.find();

    return res.status(200).json({ msg: result })


})

// GET USER BY ID IN THE DATABASE 
app.get("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    console.log("71==========>", id);
    const result = await User.findById(id);

    return res.status(200).json({ msg: result })


})


// UPDATE USER IN THE DATABASE 
app.patch("/api/users/:id", async (req, res) => {
    const body = req.body;
    const userId = req.params.id; // Extract the user ID from the request parameters

    if (!body || !body.firstName || !body.lastName || !body.email || !body.gender || !body.jobTitle) {
        return res.status(400).json({ msg: "Missing required fields" });
    }

    try {
        const result = await User.findOneAndUpdate(
            { _id: userId }, // Filter parameter should be an object
            {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                jobTitle: body.jobTitle,
                gender: body.gender
            },
            { new: true } // To return the updated document
        );

        if (!result) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User updated successfully", user: result });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});


// UPDATE USER IN THE DATABASE 
app.delete("/api/users/:id", async (req, res) => {
    const body = req.body;
    const userId = req.params.id; // Extract the user ID from the request parameters

    if (!body || !body.firstName || !body.lastName || !body.email || !body.gender || !body.jobTitle) {
        return res.status(400).json({ msg: "Missing required fields" });
    }

    try {
        const result = await User.deleteOne({ _id: userId });

        if (!result) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User delete successfully", user: result });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});




// module.exports.handler = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: "Go Serverless v3.0! Your function executed successfully!",
//         input: event,
//       },
//       null,
//       2
//     ),
//   };
// };


