import { ticketService } from "../dao/services/tickets.service.js"
import { cartService } from "../dao/services/carts.service.js"
import UserDTO from "../dao/DTO/userDTO.js"
import { ticketDTO } from "../dao/DTO/ticketDTO.js"
import crypto from "crypto"

class TicketController {

    async createTicket(req, res){
        const { cid } = req.params
        const usr = new UserDTO(req.user)
        try {
            const prodInCart = await cartService.getProductsByCartId(cid)
            const { prodInStock, prodWithOutStock } = await ticketDTO.verifyStock(prodInCart.products)

            let amount = ticketDTO.calculateAmount(prodInStock)

            const code = crypto.randomUUID()
            const purchase_datetime = new Date().toString()
            const newTicket = {code,
                               purchase_datetime,
                               amount,
                               purcharser: usr.email}

            const ticket = await ticketService.createTicket(newTicket)
            let deletedProducts

            if (prodInStock.length > 0) {
                deletedProducts = await ticketDTO.deletePurchasedProductsFromCart(
                    prodInStock,
                  cid
                )
              }

              console.log({ ticket, deletedProducts })
              if (prodInStock.length > 0) {
                res.status(200).json({
                  status: "success",
                  payload: ticket,
                  prodWithOutStock,
                  deletedProducts,
                })
              } else {
                res.status(500).json({ message: "All the produts are out of stock" });
              }
            } catch (error) {
              res.status(500).json({ status: "Error al crear el ticket", error: error.message });
        }
    }

    async getTicketById(req, res){
        try {
            const cid = req.params.cid
            const ticket = ticketService.getTicketById(cid)
            res.status(200).json(ticket)
        } catch (error) {
            console.log(error)
            res.status(500).send({ status: "Internal Server Error",  error: error.message})
        }
    }

}

export const ticketsController = new TicketController()