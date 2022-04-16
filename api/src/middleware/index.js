const userFirebase = require('../config/firebase'); 

const middleware = {
    registeredUser: (req, res, next) => {
        let token = req.headers?.authorization;
         token = token?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({
                error: 'No token provided.'
            });
        }
    
        userFirebase.auth().verifyIdToken(token).then(decodedToken => {
            if(decodedToken){
                if(!req.user){
                    req.user = {};
                }

                req.user.uid = decodedToken.uid;
                return next();
            }
    
            return res.status(401).json({
                error: 'Invalid token.'
            });
    
        }).catch(err => {
            return res.status(401).json({
                error: 'Invalid token.',
                code: err.code,
                message: err.message
            });
        });
    }
};

module.exports = middleware;
