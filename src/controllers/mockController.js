import { mockService } from "../dao/services/mocks.service.js"

class MockController {

    async createProduct(req, res) {
        try {
            const result = await mockService.getProducts()
            res.json({ status: "success", payload: result })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

export const mockController = new MockController()