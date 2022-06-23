import axios from 'axios'
const url = 'http://localhost:5000/api/categories'

export default class API {

    static async getCategoriesByAccountUsername(username) {
        const res = await axios.get(`${url}/username/${username}`)
        return res.data
    }

    static async getCategoryByName(name) {
        const res = await axios.get(`${url}/name/${name}`)
        return res.data
    }

    static async addCategory(category) {
        const res = await axios.post(url, category)
        return res.data
    }

    static async updateCategory(id, category) {
        const res = await axios.patch(`${url}/${id}`, category)
        return res.data
    }

    static async deleteCategory(id) {
        const res = await axios.delete(`${url}/${id}`)
        return res.data
    }
}