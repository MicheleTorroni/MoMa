import axios from 'axios'
const url = 'http://localhost:5000/api/transactions'

export default class API {

    static async getTransactionsByAccountUsername(username) {
        const res = await axios.get(`${url}/username/${username}`)
        return res.data
    }

    static async getTransactionByName(name) {
        const res = await axios.get(`${url}/name/${name}`)
        return res.data
    }

    static async addTransaction(transaction) {
        const res = await axios.post(url, transaction)
        return res.data
    }

    static async updateTransaction(id, transaction) {
        const res = await axios.patch(`${url}/${id}`, transaction)
        return res.data
    }

    static async deleteTransaction(id) {
        const res = await axios.delete(`${url}/${id}`)
        return res.data
    }
}