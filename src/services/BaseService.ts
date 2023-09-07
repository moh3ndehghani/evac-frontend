import axios from 'axios'

export default class BaseService {
  // static baseUrl:string = "http://localhost:8080/api"
  static baseUrl:string = "https://evac.origamicore.com"


  static async Get(url:string) {
    const axiosConfig:any = {
      headers: {
        'Authorization': window.localStorage.getItem("token")
      }
    }
    return axios.get(`${this.baseUrl}/${url}` , axiosConfig)
      .then(function (response) {
        return response.data.data
      })
      .catch(function (error) {
        console.log("Server Error:" , error);
        if(error.response.status == 403){
          window.localStorage.removeItem("token")
        }

        throw error.response.data
      })
  }

  static async Post(url:string , params={}) {
    const axiosConfig:any = {
      headers: {
        'Authorization': window.localStorage.getItem("token")
      }
    }
    return await axios.post(`${this.baseUrl}/${url}`, params , axiosConfig)
      .then(function (response) {
        return response.data.data ?? response.data.token
      })
      .catch(function (error) {
        console.log("Server Error:" , error);
        if(error.response.status == 403){
          window.localStorage.removeItem("token")
        }

        throw error.response.data
      })
  }

  static async Delete(url:string) {
    const axiosConfig:any = {
      headers: {
        'Authorization': window.localStorage.getItem("token")
      }
    }
    return await axios.delete(`${this.baseUrl}/${url}` , axiosConfig)
      .then(function (response) {
        return response.data.data ?? response.data.token
      })
      .catch(function (error) {
        console.log("Server Error:" , error);
        if(error.response.status == 403){
          window.localStorage.removeItem("token")
        }

        throw error.response.data
      })
  }

  static async Put(url:string , params={}) {
    const axiosConfig:any = {
      headers: {
        'Authorization': window.localStorage.getItem("token")
      }
    }
    return await axios.put(`${this.baseUrl}/${url}` , params , axiosConfig)
      .then(function (response) {
        return response.data.data ?? response.data.token
      })
      .catch(function (error) {
        console.log("Server Error:" , error);
        if(error.response.status == 403){
          window.localStorage.removeItem("token")
        }

        throw error.response.data
      })
  }

}
