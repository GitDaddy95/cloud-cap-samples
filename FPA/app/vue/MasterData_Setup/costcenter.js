/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)
const costcenters = Vue.createApp ({
    
    data() {
      return {
        list: [],
        plan: undefined,
        user: undefined
      }
    },

    methods: {

        search: ({target:{value:v}}) => costcenters.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/ListOfCostCenters?$expand=genre,currency${etc}`)
            costcenters.list = data.value
        },
      
        async inspect (eve) {
            const plan = costcenters.plan = costcenters.list [eve.currentTarget.rowIndex-1]
            const res = await GET(`/CostCenters/${plan.ID}?$select=ccname`)
           
            Object.assign (plan, res.data)
            costcenters.a = {ID:plan.ID}
            
            setTimeout (()=> $('form > input').focus(), 111)
        },
    }
}).mount('#app')

costcenters.fetch()

document.addEventListener('keydown', (event) => {
    // hide user info on request
    if (event.key === 'u')  account.user = undefined
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