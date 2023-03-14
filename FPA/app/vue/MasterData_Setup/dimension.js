/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)
const dimensions = Vue.createApp ({
    
    data() {
      return {
        list: [],
        plan: undefined,
        user: undefined
      }
    },

    methods: {

        search: ({target:{value:v}}) => dimensions.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/ListOfDimensions?$expand=genre,currency${etc}`)
            dimensions.list = data.value
        },
      
        // async inspect (eve) {
        //     const plan = dimensions.plan = dimensions.list [eve.currentTarget.rowIndex-1]
        //     const res = await GET(`/Dimensions/${plan.ID}?$select=descr`)
           
        //     Object.assign (plan, res.data)
        //     dimensions.a = {ID:plan.ID}
            
        //     setTimeout (()=> $('form > input').focus(), 111)
        // },
    }
}).mount('#app')

dimensions.fetch()

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