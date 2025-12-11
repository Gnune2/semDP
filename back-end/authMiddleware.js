// Middleware de Autenticação
function authenticateToken(req, res, next) {
    //armazena token numa variavel
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({error: "token não fornecido"});
    }
    jwt.verify(token, process.env.JWT_SECRET,(err, user) =>{
        if(err){
            return res.status(403).json({error: "token invalido ou expirado"})
        }
        req.student = user;
        next();
    })
}