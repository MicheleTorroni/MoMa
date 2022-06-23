import axios from 'axios'
const url = 'http://localhost:5000/api/wallets'

export default class API {

    static async getWalletsByAccountUsername(username) {
        const res = await axios.get(`${url}/username/${username}`)
        return res.data
    }

    static async getWalletByName(name) {
        const res = await axios.get(`${url}/name/${name}`)
        return res.data
    }

    static async addWallet(wallet) {
        const res = await axios.post(url, wallet)
        return res.data
    }

    static async updateWallet(id, wallet) {
        const res = await axios.patch(`${url}/${id}`, wallet)
        return res.data
    }

    static async deleteWallet(id) {
        const res = await axios.delete(`${url}/${id}`)
        return res.data
    }
}