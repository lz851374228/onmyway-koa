const mongoose = require("mongoose") 

 //连接数据库
mongoose.connect(process.env.MongoURL);
 
const db = mongoose.connection
 
// db.on('open', () => {
//     logger.info("*****数据库状态为开启******")
//   })
 
// 连接成功
db.on("connected", function () {
    // logger.info("**********数据库连接成功***********");
    console.log('MongoDB数据库连接成功');
})
// 连接失败
db.on("error", function (err) {
    // logger.info("数据库连接失败，原因：" + err);
    console.log('MongoDB数据库连接失败');
})
// 连接断开
db.on('disconnectied', function () {
    // logger.info("数据库连接断开，原因：" + err);
    console.log('MongoDB数据库连接断开');
})
module.exports=db
