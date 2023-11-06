import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'


let token = null

const setToken = newToken => token = `bearer ${newToken}`


const getAll = async() => {
  const request = await axios.get(baseUrl)
  // console.log("🚀 ~ file: blogs.js:6 ~ getAll ~ request:", request)
  return request.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async(id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${ baseUrl }/${ id }`, newObject, config)
  return response.data
}


const remove = async(id)=>{
   await axios.delete(`${ baseUrl }/${ id }`, { headers: { Authorization: token } })
}

export default { getAll, setToken, create, update, remove }