const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect = (done) => {
    const url = 'mongodb://localhost:27017';
    const dbname = 'RFID-Attendance-System'


    mongoClient.connect(url).then((data)=>{
        if(!data) 
        return done("Error")
         //console.log(data);
        state.db = data.db(dbname)
        done()
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports.get = ()=>{
    return state.db 
}