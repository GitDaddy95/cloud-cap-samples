/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)

const companies =  Vue.createApp ({
    
    data() {
      return {
        list: [],
        plan: undefined,
        order: { quantity:1, succeeded:'', failed:'' },
        user: undefined
      }
    },

    methods: {

        search: ({target:{value:v}}) => companies.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/ListOfCompanies?$expand=genre,currency${etc}`)
            companies.list = data.value
        },
       
        async inspect (eve) {
            const plan = companies.plan = companies.list [eve.currentTarget.rowIndex-1]
            console.log(plan)
            const res = await GET(`/Companies/${plan.ID}?$select=descr,title`)
            Object.assign (plan, res.data)
            companies.order = { quantity:1 }
            setTimeout (()=> $('form > input').focus(), 111)
        },

        async goPlan () {
            const {plan,order} = companies, quantity = parseInt (order.quantity) || 1 // REVISIT: Okra should be less strict
            try {
                
                const res = await POST(`/goPlan`, { quantity, plan: plan.ID })
                plan.stock = res.data.stock
                window.location.href = "http://localhost:4004/vue/MainPage/main.html";
                // companies.order = { quantity, succeeded: `Successfully ordered ${quantity} item(s).` }
            } catch (e) {
                companies.order = { quantity, failed: e.response.data.error ? e.response.data.error.message : e.response.data }
            }
        },
        

        async login() {
            try {
                const { data:user } = await axios.post('/user/login',{})
                if (user.id !== 'anonymous') companies.user = user
            } catch (err) { companies.user = { id: err.message } }
        },

        async getUserInfo() {
            try {
                const { data:user } = await axios.get('/user/me')
                if (user.id !== 'anonymous') companies.user = user
            } catch (err) { companies.user = { id: err.message } }
        },
    }
}).mount('#app')



companies.getUserInfo()
companies.fetch()


//books.getUserInfo()
//books.fetch() // initially fill list of books

document.addEventListener('keydown', (event) => {
    // hide user info on request
    if (event.key === 'u')  companies.user = undefined
})

axios.interceptors.request.use(csrfToken)
function csrfToken (request) {
    if (request.method === 'head' || request.method === 'get') return request
    if ('csrfToken' in document) {
        request.headers['x-csrf-token'] = document.csrfToken
        return request
    }
    return fetchToken().then(token => {
        document.csrfToken = token
        request.headers['x-csrf-token'] = document.csrfToken
        return request
    }).catch(_ => {
        document.csrfToken = null // set mark to not try again
        return request
    })

    function fetchToken() {
        return axios.get('/', { headers: { 'x-csrf-token': 'fetch' } })
        .then(res => res.headers['x-csrf-token'])
    }
}