var jwt =  require('jsonwebtoken')

//this middleware will be required wherever user has to be verified eg before sharing a key
//use this middleware in routes
const auth = async (req, res, next)=>{
    try {
        let token = "abcd";
        let isCustomAuth = 1;
        if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1];
            isCustomAuth = token.length<500;
        }
        let decodedData;
        if(token && isCustomAuth){
            try{
                decodedData = jwt.verify(token, "test");
                req.userId = decodedData.id;
            }
            catch{
                req.userId = null;
            }
        }
        else{
            decodedData = jwt.decode(token);

            req.userId = decodedData.sub;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = auth;