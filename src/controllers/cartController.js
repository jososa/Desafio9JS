import { cartService } from "../dao/services/carts.service.js"
//import cartsRepositories from "../../repositories/cartsRepositories.js"

export default class CartController {

    getCarts = async (req,res) => {
      const cart = await cartService.getCarts()
      try {
        res.json({cart})
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }

    getCartById = async (req, res) => {
      try {
        const cid = req.params.cid
        const cart = await cartService.getCartById(cid)
        res.json(cart)
      } catch (error) {
          console.log(error)
          res.status(500).send({ status: "Internal Server Error",  error: error.message})
      }
    }

    createCart = async (req, res) => {
      try {
        const newCart = await cartService.createCart();
        res.status(201).send({ status: "Carrito creado", payload: newCart })
      } catch (error) {
          console.log(error)
          res.status(500).send({ status: "Error al crear el carrito",  error: error.message })
      }
    }

    async addProductsToCart(req, res) {
        const { cid, pid } = req.params
        const { quantity } = req.body
    
        try {
          const updatedCart = await cartService.addProductsToCart(cid, pid, quantity)
          res.status(201).send({ status: "success", payload: updatedCart })
        } catch (error) {
            res.status(500).send({ status: "error",  error: error.message })
        }
      }
      
    updateProductsInCart = async (req, res) => {
        try {
          const cid = req.params.cid
          const {products} = req.body
      
          const result = await cartService.updateProductsInCart(cid, products)
      
          res.status(200).send({ status: "Carrito actualizado con exito" })
      } catch (error) {
          console.log(error)
      }
    }

    async updateProductQuantity(req, res) {
      const { cid, pid } = req.params
      const { quantity } = req.body
      try {
          const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity)
          res.status(200).send({ status: "success", payload: updatedCart })
      } catch (error) {
          console.log(error)
          res.status(500).send({ status: "error",  error: error.message })
      }
    }

    removeProductFromCart = async (req, res) => {
        const { cid, pid } = req.params
        try {
            await cartService.removeProductFromCart(cid, pid)
            res.status(200).send({ status: "success", message: `Se elimino producto ID: ${pid} del carrito` })
        } catch (error) {
            console.log(error)
            res.status(500).send({ status: "error",  error: error.message })
        }
      }

    clearCart = async (req, res) => {
      const { cid } = req.params
      try {
          await cartService.clearCart(cid)
          res.status(204).send({ status: "success", message: `Carrito ID: ${cid} eliminado con exito`, payload: null })
      } catch (error) {
          console.log(error)
          res.status(500).send({ status: "error",  error: error.message })
      }
    }

    async getProductsByCartId(req, res) {
      const cid = req.params.cid
      const cart = await cartService.getProductsByCartId(cid)
      try {
        res.json(cart.products)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }

}

export const cartController = new CartController()