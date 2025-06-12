import axios from "axios";

function joinURL(baseURL, url) {
    return `${baseURL}/${url}`;
}

class Service {
    domain = 'http://localhost:3000/api'

    async request(url, method = "POST", data) {
        url = joinURL(this.domain, url)

        const res = await axios
            .request({
                url,
                method,
                data,
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        return res.data;
    }

    post(url, data) {
        const method = "POST"
        return this.request(url, method, data)
    }

    get(url) {
        const method = "GET"
        return this.request(url, method)
    }

    delete(url, data) {
        const method = "DELETE"
        return this.request(url, method, data)
    }

    put(url, data) {
        const method = "PUT"
        return this.request(url, method, data)
    }

    patch(url, data) {
        const method = "PATCH"
        return this.request(url, method, data)
    }
}

export default Service
