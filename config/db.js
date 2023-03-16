const mongoose = require("mongoose");
const db = 'mongodb+srv://pankaj_234:pankaj421@cluster0.u0pao2m.mongodb.net/?retryWrites=true&w=majority';

async function connectDB() {
    
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {connectDB};