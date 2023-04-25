const mongoose= require('mongoose');




let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(MONGODB_URI, MONGODB_DB) {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  
  if (!MONGODB_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
  }

  if (cached.conn) {
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      dbName: MONGODB_DB,
    };
    
    console.log("CONNECTING TO DB")
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("CONNECTED TO DB")
      return mongoose;
    });
  }

  
  cached.conn = await cached.promise;
  

  
  return cached.conn;
}

module.exports=dbConnect;