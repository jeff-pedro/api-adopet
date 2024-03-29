const { LoginService } = require('../services')

const loginService = new LoginService()

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body
    
    try {
      const accessToken = await loginService.login({ email, password })

      res.status(200).json({ accessToken })
    } catch (err) {
      res.status(401).send({ error: err.message })
    }
  }
}

module.exports = AuthController
