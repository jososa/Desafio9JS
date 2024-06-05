export function auth(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login")
    }
    next()
  }
  
export const authorization = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ status: "error", message: "Usuario no autenticado" })
      }
  
      const userRole = req.user.role
      if (userRole === role) {
        next()
      } else {
        return res.status(403).json({ status: "error", message: "No tiene permisos para realizar esta acción" })
    }
  }
}