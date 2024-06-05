import { validateCart } from "../../../utils/cartError.js"
import { CustomError } from "../../../utils/customError.js"
import { errorTypes } from "../../../utils/errorTypes.js"
//import CartService from "../../services/carts.service.js"
//import cartsRepositories from "../../repositories/cartsRepositories.js"
import cartsModel from "../models/cartsModel.js"

export default class CartDao {

  getOrCreateCart = async () => {
    let cart = await cartsModel.findOne().lean()
    if (!cart) {
      cart = await this.createCart()
    }
    return cart
  }

  getCarts = async () => {
      try {
          const carts = await cartsModel.find().lean();
          return carts
      } catch (err) {
          console.error('Error al obtener los carritos:', err.message)
          return []
      }
  }

  getCartById = async (cartId) => {
      try {
          const cartById = await cartsModel.findById(cartId).populate("products.product").lean()
          return(cartById)
      } catch (err) {
          return err.message
      }
  }

  createCart = async (products) => {
      try {
          let cartData = {};
          if (products && products.length > 0) {
              cartData.products = products
          }

          const cart = await cartsModel.create(cartData)
          return cart
      } catch (err) {
          console.error('Error al crear el carrito:', err.message)
          return err
      }
  }

  addProductsToCart = async (cartId, productId, quantity) => {
    if (quantity || typeof quantity === "number" || quantity > 0) {
      const cart = await cartsModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId.toString()
      )
      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity });
      } else {
        throw new Error("Producto ya existente en el carrito");
      }
      return await cart.save();
    } else {
      throw CustomError.CustomError(
        "Datos incompletos",
        "Cantidad faltante o no válida en la solicitud",
        errorTypes.ERROR_INVALID_ARGUMENTS,
        validateCart(quantity)
      )
    }
  }
    
  updateProductsInCart = async (cid, products) => {
      try {
          return await cartsModel.findOneAndUpdate(
              { _id: cid },
              { products },
              { new: true })

      } catch (err) {
          return err
      }
  }

  updateProductQuantity = async (cartId, productId, quantity) => {
      try {
          const cart = await cartsModel.findById(cartId)
          const product = cart.products.find(
            (product) => product.product.toString() === productId.toString()
          )
          if (product) {
            product.quantity = quantity
          } else {
            cart.products.push({ product: productId ,quantity })
          }
            return await cart.save()
      }
      catch (error) {
          console.error("No se pudo actualizar la cantidad del producto", error)
      }
  }

  updateOneProduct = async (cid, products) => {
      
      await cartsModel.updateOne(
          { _id: cid },
          {products})
      return await cartsModel.findOne({ _id: cid })
  }

  removeProductFromCart = async (cid, pid) => {
      const cart = await cartsModel.findById(cid)
      cart.products = cart.products.filter((product) => product._id.toString() !== pid)
      return cart.save()
    }

  clearCart = async (cid) => {
  const cart = await cartsModel.findById(cid)
      if (!cart) {
        throw new Error("El carrito no existe")
      }
      cart.products = []
      return cart.save()
  }

    // getCarts = async (req,res) => {
    //   const cart = await CartService.getCarts()
    //   try {
    //     res.json({cart})
    //   } catch (error) {
    //     res.status(500).json({ error: error.message });
    //   }
    // }

    // getCartById = async (req, res) => {
    //   try {
    //     const cid = req.params.cid
    //     const cart = await CartService.getCartById(cid)
    //     res.json(cart)
    //   } catch (error) {
    //       console.log(error)
    //       res.status(500).send({ status: "Internal Server Error",  error: error.message})
    //   }
    // }

    // createCart = async (req, res) => {
    //   try {
    //     const newCart = await CartService.createCart();
    //     res.status(201).send({ status: "Carrito creado", payload: newCart })
    //   } catch (error) {
    //       console.log(error)
    //       res.status(500).send({ status: "Error al crear el carrito",  error: error.message })
    //   }
    // }

    // async addProductsToCart(req, res) {
    //     const { cid, pid } = req.params
    //     const { quantity } = req.body
    
    //     try {
    //       const updatedCart = await CartService.addProductsToCart(cid, pid, quantity)
    //       res.status(201).send({ status: "success", payload: updatedCart })
    //     } catch (error) {
    //         res.status(500).send({ status: "error",  error: error.message })
    //     }
    //   }
      
    // updateProductsInCart = async (req, res) => {
    //     try {
    //       const cid = req.params.cid
    //       const {products} = req.body
      
    //       const result = await CartService.updateProductsInCart(cid, products)
      
    //       res.status(200).send({ status: "Carrito actualizado con exito" })
    //   } catch (error) {
    //       console.log(error)
    //   }
    // }

    // async updateProductQuantity(req, res) {
    //   const { cid, pid } = req.params
    //   const { quantity } = req.body
    //   try {
    //       const updatedCart = await CartService.updateProductQuantity(cid, pid, quantity)
    //       res.status(200).send({ status: "success", payload: updatedCart })
    //   } catch (error) {
    //       console.log(error)
    //       res.status(500).send({ status: "error",  error: error.message })
    //   }
    // }

    // removeProductFromCart = async (req, res) => {
    //     const { cid, pid } = req.params
    //     try {
    //         await CartService.removeProductFromCart(cid, pid)
    //         res.status(200).send({ status: "success", message: `Se elimino producto ID: ${pid} del carrito` })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).send({ status: "error",  error: error.message })
    //     }
    //   }

    // clearCart = async (req, res) => {
    //   const { cid } = req.params;
    //   try {
    //       await CartService.clearCart(cid);
    //       res.status(204).send({ status: "success", message: `Carrito ID: ${cid} eliminado con exito`, payload: null });
    //   } catch (error) {
    //       console.log(error);
    //       res.status(500).send({ status: "error",  error: error.message });
    //   }
    // }

}

//export const cartManager = new CartManager()