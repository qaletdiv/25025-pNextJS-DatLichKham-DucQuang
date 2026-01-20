export const authorize = (allowedRoles) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]; 

    return (req, res, next) => {
        if(!req.account || !req.account.role) {
            return res.status(403).json({message: "Không xác định được danh tính"})
        }
        
        const accountPerrmission = req.account.role; 
        if(!roles.includes(accountPerrmission)) {
            return res.status(403).json({message: "Bạn không có quyền truy cập tài nguyên này!"})
        }
        
        next();
    }
}