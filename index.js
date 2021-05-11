const serverless = require('serverless-http');
require('dotenv').config()
const auth = require("./auth");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var hogan = require('hogan-express');
var express = require('express');
var session = require('express-session');
var cors = require('cors');
const dbConnection = require("./dbconnection");

var fileupload = require('express-fileupload');
var path = require('path');
const multer = require('multer');
const upload = multer();
const con = dbConnection.connection();

var usercontroller = require("./controllers/user");
var logincontroller = require("./controllers/logincontroller");
// var createEmployeeController = require("./controllers/CreateEmployeeController");
// var employeeListController = require("./controllers/GetEmployeeListController");
// var createAttendanceController = require("./controllers/CreateAttendanceController");
// var attendanceListController = require("./controllers/GetAttendanceListController");
// var modifyAttendanceController = require("./controllers/ModifyAttendanceController");
// var createCompanyController = require("./controllers/CreateCompanyController");
// var createQRCodeController = require("./controllers/CreateQRCodeController");
// var filefileuploadcontroller = require("./controllers/FileIploadController");
// var updateEmployeeController = require("./controllers/UpdateEmployeeController");
// var deleteEmployeeController = require("./controllers/DeleteEmployeeController");
// var createHolidayListController = require('./controllers/CreateHolidayListController');
// var getHolidayListController = require('./controllers/GetHolidayListController');
// var getHolidayListMobileController = require('./controllers/GetHolidayListMobileController');
// var getScheduleListAdminController = require('./controllers/GetScheduleListAdminController');
// var getScheduleListController = require('./controllers/GetScheduleListController');
// var createScheduleController = require('./controllers/CreateScheduleController');
// var getLeaveApprovalListController = require('./controllers/GetLeaveApprovalListController');
// var updateLeaveApprovalController = require('./controllers/UpdateLeaveApprovalController');
// var deleteLeaveApprovalController = require('./controllers/DeleteLeaveApprovalController');
// var deleteHolidayListController = require('./controllers/DeleteHolidayListController')

var app = express();
const router = express.Router();

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(fileupload());
app.use("/public", express.static(path.join(__dirname, 'public')));

//app.use(multer());



// Register '.mustache' extension with The Mustache Express
app.set('view engine', 'html');
app.set('views', require('path').join(__dirname, '/view'));
app.engine('html', hogan);

// A normal un-protected public URL.

app.get('/user/get',auth.authentication,[
    usercontroller.userlist
]);

app.post('/login', [
    logincontroller.login
]);

app.get('/getdata', [
  logincontroller.getdata
]);


app.post('/tokenverify', function (req, res) {
  jwt.verify(req.body.token,process.env.ACCESS_TOKEN_SECRET,(err,tokendata) =>{ 
    if(err){
        response = {"message":"Authorization failed", "status":"failed"};
        res.send(response);
        res.end();
    }else{
      if(req.body.type == "forever"){
        query = "select password from user where email =?;";
        con.query(query,[tokendata.usermail],function(err,resp){
          if(err){
            console.log(err);
            response = {"message":"Something went wrong", "status":"failed"};
            res.send(response);
            res.end();
          }else{
            response = {"message":"success", "status":"Success","datakey":resp};
            res.send(response);
            res.end();
          }
        })
      }else{
        response = {"message":"Valid token!", "status":"success"};
        res.send(response);
        res.end();
      }
    }
  })
})


// app.get('/', function (req, res) {
//   console.log("Example ");
// });

// app.post('/employee/create', [
//     createEmployeeController.createEmployee
// ]);

// app.get('/employee/get', [
//     employeeListController.employeeList
// ]);

// app.post('/attendance/create', [
//     createAttendanceController.createAttendance
// ]);

// app.post('/attendance/get', [
//     attendanceListController.getAttendanceList
// ]);

// app.post('/attendance/update', [
//     modifyAttendanceController.updateAttendance
// ]);

// app.post('/company/create', [
//     createCompanyController.createComapny
// ]);

// app.post('/qrcode/create', [
//     createQRCodeController.createQRCode
// ]);

// // app.get('/company/get', [
// //     getCompanyListController.companyList
// // ]);

// app.post('/file/upload', [
//     filefileuploadcontroller.fileUploadController
// ]);



// // app.post('/file/upload',upload.single('file'), function (req, res) {
// //     filefileuploadcontroller.fileUploadController
// //     // console.log(req.file);
// //     // console.log(req.body);
// // });

// app.get('/attendance/get/admin', [
//     attendanceListController.getAttendanceListForAdmin
// ]);

// app.post('/employee/update', [
//     updateEmployeeController.updateEmployee
// ]);

// app.post('/employee/delete', [
//     deleteEmployeeController.deleteEmployee
// ]);

// app.post('/holiday/create', [
//     createHolidayListController.createHolidayList
// ]);

// app.get('/holiday/get/admin', [
//     getHolidayListController.holidayList
// ]);

// app.post('/holiday/get', [
//     getHolidayListMobileController.holidayMobileList
// ]);

// app.post('/schedule/create',[
//     createScheduleController.createScheduleList
// ]);

// app.get('/schedule/get/admin',[
//     getScheduleListAdminController.scheduleListForAdmin
// ]);

// app.post('/schedule/get',[
//     getScheduleListController.scheduleList
// ]);

// app.get('/leaveapproval/get',[
//     getLeaveApprovalListController.leaveApprovalList
// ]);

// app.post('/leaveapproval/update',[
//     updateLeaveApprovalController.updateLeaveApproval
// ]);

// app.post('/leaveapproval/delete',[
//     deleteLeaveApprovalController.deleteLeaveApproval
// ]);

// app.post('/holiday/delete',[
//     deleteHolidayListController.deleteHolidayList
// ]);


// var server = app.listen(4000, function () {
//     var host = "http://localhost";
    
//     var port = server.address().port;
//     console.log('app listening at %s:%s', host, port);
// });

// module.exports.handler = serverless(app);

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};