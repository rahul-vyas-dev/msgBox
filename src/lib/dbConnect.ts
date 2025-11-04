import mongoose from "mongoose";
type ConnectionObj = {
  isConnected?: number;
};

const connection: ConnectionObj = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }
  try {
    const DB = await mongoose.connect(process.env.MONGODB_URI || "");
    // console.log("this is res from DBCONNECT()",DB)
    connection.isConnected = DB.connections[0].readyState;
    console.log('this is your res after update', connection.isConnected);
  } catch (error) {
    console.log(
      "Error in database connection ->(src :: lib :: dbConnects)",
      error
    );
    process.exit(1);
  }
}
export default connectDB;
