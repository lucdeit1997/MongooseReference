 function verifyToken(req, res, next)
{
   const token = req.body.token;
   
   if(token)
   {
       req.token = token;
       next();
   }
   else
       res.json('chua co token')
}
module.exports = verifyToken;