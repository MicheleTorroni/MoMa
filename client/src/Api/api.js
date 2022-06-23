import axios from 'axios'
const url = 'http://localhost:5000/api/gategories'

export default class API {

    static async getAccountByUsername(username) {
        const res = await axios.get(`${url}/username/${username}`)
        return res.data
    }

    static async getAccountByID(id) {
        const res = await axios.get(`${url}/id/${id}`)
        return res.data
    }

    static async addAccount(account) {
        const res = await axios.post(url, account)
        return res.data
    }

    static async deleteAccount(id) {
        const res = await axios.delete(`${url}/${id}`)
        return res.data
    }

    static async updateAccount(id, account) {
        const res = await axios.patch(`${url}/${id}`, account)
        return res.data
    }
}