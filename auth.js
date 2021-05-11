require('dotenv').config()
const jwt = require('jsonwebtoken');

function generatetoken(data){
    const tokendata = {usermail : data.email , usertype : data.type};
    var accesstoken = jwt.sign(tokendata,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '2m'});
    return accesstoken;
}


// function verifytoken(data){
//     const tokendata = {usermail : data.email , usertype : data.type};
//     var accesstoken = jwt.sign(tokendata,process.env.ACCESS_TOKEN_SECRET);
//     return accesstoken;
// }


//this is middle ware function for verify json web token
function authentication(req,res,next){
    const authHeader = req.headers['authorization'];
    // Bearer Token  as wee need token this is the reason we are splitting
    const token = authHeader && authHeader.split(' ')[1]; //it means it will first check there is a auth header or not the split

    if (token == null){
        response = {"message":"Authorization failed", "status":"failed"};
        res.send(response);
        res.end();
    }else{
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,tokendata) =>{
            if(err){
                response = {"message":"Authorization failed", "status":"failed"};
                res.send(response);
                res.end();
            }else{
                req.userdata = tokendata;
                next();
            }
        })
    }
}

function refreshtoke(data){

}


exports.authentication = authentication; 
exports.generatetoken = generatetoken;      
exports.refreshtoke = refreshtoke;              