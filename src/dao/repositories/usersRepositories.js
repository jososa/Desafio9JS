
export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    findUserByEmail = async (username) => {
        try {
            return this.dao.findUserByEmail(username)
        } catch (error) {
            return error
        }
      }
    
      createUser = async (user) => {
        try {
            return this.dao.createUser(user)
        } catch (error) {
            return error
        }
      }
    
      updateUser = async (user, dataToUpdate) => {
        try {
            return this.dao.updateUser(user, dataToUpdate)
        } catch (error) {
            return error
        }
      }

}