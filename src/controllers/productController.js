import { productService } from "../dao/services/products.service.js"
import { logger } from "../utils/Logger.js"

export default class ProductController {

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts(req.query)
            res.status(200).send({ status: "success", payload: products })
          } catch (error) {
            req.logger.error("Error al obtener produtos", error)
            res.status(500).send({ status: "error", error: error.message })
          }
      }

    addProduct = async (req, res) => {
      const newProduct = req.body

      try {
        let prod = [
          "title",
          "description",
          "price",
          "code",
          "stock",
          "thumbnail",
          "status"]

        let newprod = Object.keys(req.body)
        let valid = newprod.every((prop) => prod.includes(prop))
  
        const hasAllRequiredProps = prod.every((prop) =>
            newprod.includes(prop) &&
            newProduct[prop] !== undefined &&
            newProduct[prop] !== null)

        if (!hasAllRequiredProps) {
          req.logger.warning("Faltan campos para crear el producto")
          return res.status(400).json({
            error:
              "Debes agregar todos los campos requeridos para crear un nuevo producto",
            detalle: prod,
          });
        }
  
        if (!hasAllRequiredProps) {
          res.setHeader("Content-Type", "application/json")
          return res.status(400).json({
            error: `You have entered invalid properties`,
            detalle: prod,
          })
        }
        await productService.addProducts(newProduct)
        req.logger.info("Producto creado correctamente", newProduct)
        res.json({ status: "success", newProduct })
      } catch (error) {
        res.status(400).json({ error: error.message })
      }

    }

    getProducts = async () => {
        try {
            let result = await productsModel.find().lean()
            return result
        } catch (error) {
          req.logger.error(error)
        }
    }

    getProductById = async (req, res) => {
        const { pid } = req.params
        try {
          const product = await productService.getProductById(pid)
          if (!product) {
            req.logger.error("Product not found")
            return res
              .status(404)
              .send({ status: "error", error: "Product not found" })
          }
          res.status(200).send({ status: "success", payload: product })
        } catch (error) {
          req.logger.error(error)
          res.status(500).send({ status: "error", error: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        const productId = req.params.prodId
        try {
          await productService.deleteProduct(productId)
          req.logger.debug("Producto eliminado")
          res.json({ status: "Producto eliminado" })
        } catch (error) {
          req.logger.error("Error al eliminar producto", error)
          res.status(400).json({ error: error.message })
        }
    }

    updateProduct = async (req, res) => {
        const productId = req.params.prodId
        const updatedFields = req.body
        try {
          const updatedProduct = await productService.updateProduct(
            productId,
            updatedFields
          );
          req.logger.debug("Producto actualizado", updatedProduct)
          res.json({ status: "Producto actualizado", updatedProduct })
        } catch (error) {
          req.logger.error("Error al actualizar producto", error)
          res.status(400).json({ error: error.message })
        }
    }

}

export const productController = new ProductController() 