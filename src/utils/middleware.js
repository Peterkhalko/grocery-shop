const middleware = {
  auth: (req, res, next) => {
    //only for endpoints not starting with api will be ignored to look for token like, creating sigin or singnups,
    // rest all the apis would go throught the round of authorization and validations here
    if (req.originalUrl.indexOf("api") > -1) {
    //   const token =
    //     req.body.token || req.query.token || req.headers["authorization"];

    //   if (token) {
    //     jwt.verify(token, "question_pro_secrete_key_peterkhalko",  (err, decoded)=> {
    //       if (err) {
    //         return res.json({
    //           success: false,
    //           message: "Failed to authenticate token.",
    //         });
    //       } else {
    //         req.decoded = decoded;
    // do custom authorization role based if needed after decode
    //         next();
    //       }
    //     }); 
    //   } else {
    //     return res.status(403).send({
    //       success: false,
    //       message: "No token provided.",
    //     });
    //   }
    next();
    } else {
      next();
    }
  },
};
module.exports = middleware;
