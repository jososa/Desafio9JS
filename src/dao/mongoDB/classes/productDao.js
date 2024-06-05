//import productsService from "../../services/products.service.js"
import { productsModel } from "../models/productsModel.js"
import { CustomError } from "../../../utils/customError.js"
import { validateProduct } from "../../../utils/productsError.js"
import { errorTypes } from "../../../utils/errorTypes.js"

export  default class ProductDao {

  getAllProducts = async(params) => {
      const {
        limit = 10, // default limit = 10
        page = 1, // default page = 1
        sort = null,
        query = null,
        category = null,
        status = null, //available
      } = params

      const options = {
        query: query,
        page: Number(page),
        limit: Number(limit),
        lean: true,
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        customLabels: {
          docs: "products",
          totalDocs: "totalProducts",
        },
      }

      let searchQuery = {};

      // $options: 'i' en MongoDB se utiliza para hacer que la búsqueda sea insensible a mayúsculas y minúsculas.
      if (query) {
        searchQuery.title = { $regex: query, $options: "i" }
      }

      if (category) {
        searchQuery.category = { $regex: category, $options: "i" }
      }

      if (status !== null) {
        searchQuery.status = status === "true"
      }

      const result = await productsModel.paginate(searchQuery, options)
      return result
  }

  addProduct = async (newProduct) => {
      try {
        if (newProduct.title &&
            newProduct.description &&
            newProduct.price &&
            newProduct.code &&
            newProduct.stock
        ){
            newProduct.status = newProduct.status || true
            return await productsModel.create(newProduct)
        } else{
            throw CustomError.CustomError("Datos incompletos",
                                          "Ingrese todos los datos",
                                          errorTypes.ERROR_INVALID_ARGUMENTS,
                                          validateProduct(newProduct))
        }
      } catch (error) {
          return error
      }
  }

  getProducts = async () => {
      try {
          let result = await productsModel.find().lean()
          return result
      } catch (error) {
          return error
      }
  }

  getProductById = async (productId) => {
      try {
          return await productsModel.findById(productId)
      } catch (error) {
          return error
      }
  }

  deleteProduct = async (productId) => {
      try {
          return await productsModel.findByIdAndDelete(productId)
      } catch (error) {
          return error
      }
  }

  updateProduct = async (pid, campo) => {
      try {
          return await productsModel.findByIdAndUpdate(pid, {$set: campo})
      } catch (error) {
          return error
      }
  }

    // async getAllProducts(req, res) {
    //     try {
    //         const products = await productsService.getAllProducts(req.query);
    //         res.status(200).send({ status: "success", payload: products });
    //       } catch (error) {
    //         console.log(error);
    //         res.status(500).send({ status: "error", error: error.message });
    //       }
    //   }

    // addProduct = async (req, res) => {
    //     const newProduct = req.body;
    //     try {
    //       let result = await productsService.addProduct(newProduct)
    //       res.json({result})
    //     } catch (error) {
    //       res.status(500).json({ error: error.message })
    //     }
    // }

    // getProducts = async () => {
    //     try {
    //         let result = await productsModel.find().lean()
    //         return result
    //     } catch (error) {
    //         return error
    //     }
    // }

    // getProductById = async (req, res) => {
    //     const { pid } = req.params
    //     try {
    //       const product = await productsService.getProductById(pid)
    //       if (!product) {
    //         return res
    //           .status(404)
    //           .send({ status: "error", error: "Product not found" })
    //       }
    //       res.status(200).send({ status: "success", payload: product })
    //     } catch (error) {
    //       console.log(error)
    //       res.status(500).send({ status: "error", error: error.message })
    //     }
    // }

    // deleteProduct = async (req, res) => {
    //     const productId = req.params.prodId
    //     try {
    //       await productsService.deleteProduct(productId)
    //       res.json({ status: "Producto eliminado" })
    //     } catch (error) {
    //       res.status(400).json({ error: error.message })
    //     }
    // }

    // updateProduct = async (req, res) => {
    //     const productId = req.params.prodId
    //     const updatedFields = req.body
    //     try {
    //       const updatedProduct = await productsService.updateProduct(
    //         productId,
    //         updatedFields
    //       );
    //       res.json({ status: "Producto actualizado", updatedProduct })
    //     } catch (error) {
    //       res.status(400).json({ error: error.message })
    //     }
    // }

}

//export const productManager = new ProductManager() 