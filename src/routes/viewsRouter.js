import { Router } from "express"
//import ProductManager from "../dao/controllers/mongoDB/productManagerMongo.js";
//import CartManager from "../dao/controllers/mongoDB/cartManagerMongo.js"
//import productsService from "../dao/services/products.service.js"
//import CartService from "../dao/services/carts.service.js";
import { productRepository } from "../dao/repositories/index.js"
import { cartRepository } from "../dao/repositories/index.js"
//import { messageRepository } from "../dao/repositories/messagesRepositories.js"
import { auth } from "../middlewares/auth.js"

const viewsRouter = Router()
//const productos = new ProductManager()
//const carrito = new CartManager()

viewsRouter.get("/", auth, async (req, res)=>{
    let allProducts = await productRepository.getProducts()
    res.render('home', {user: req.session.user, products : allProducts})
})

viewsRouter.get("/realtimeproducts", auth, async (req, res) => {
    res.render("realtimeproducts")
})

viewsRouter.get("/chat", auth, (req,res)=>{
    res.render("chat")
})

viewsRouter.get("/products", auth, async (req, res) => {
    try {
        let allProducts = await productRepository.getAllProducts(req.query)
      allProducts.prevLink = allProducts.hasPrevPage
        ? `http://localhost:8080/products?page=${allProducts.prevPage}`
        : "";
        allProducts.nextLink = allProducts.hasNextPage
        ? `http://localhost:8080/products?page=${allProducts.nextPage}`
        : "";
        allProducts.isValid = !(
        req.query.page < 1 || req.query.page > allProducts.totalPages
      )
      res.render('products', allProducts)
    } catch (error) {
      console.error(error)
      res.status(500).send("Error al obtener los productos")
    }
  })

  viewsRouter.get('/carts/:cid', auth, async (req, res) => {
    try {
        const { cid } = req.params
        const result = await cartRepository.getCartById(cid)

        if(result === null || typeof(result) === 'string') return res.render('cart', { result: false, message: 'ID not found' })
        return res.render('cart', { result })
    } catch (err) {
        console.log(err)
    }
})

viewsRouter.get('/register', (req, res) => {
  res.render('register');
})

viewsRouter.get('/login', (req, res) => {
  res.render('login');
})

viewsRouter.get("/restore", (req, res) => {
  res.render('restore')
})

export default viewsRouter