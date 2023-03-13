/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)
let id =0;
const plans = Vue.createApp ({
    
    data() {
      return {
        list: [],
        plan: undefined,
        order: { quantity:1, succeeded:'', failed:'' },
        user: undefined
      }
    },

    data1() {
        return {
            newTodo1: '1',
            newTodo2: '2',
            newTodo3: '3',
            newTodo4: '4',
            newTodo5: '5',
            newTodo6: '6',
            newTodo7: '7',
            // todo : undefined,
            // todoList : [],
            user: undefined,
            todoList: [
               { id: id++, newTodo1: '123456',newTodo2: 'Sales',newTodo3: '10000',newTodo3: 'USD',newTodo3: '1',newTodo3: '3',newTodo3: 'Yes' },
             ]
          }
    },

    methods: {

        search: ({target:{value:v}}) => plans.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/ListOfPlans?$expand=genre,currency${etc}`)
            plans.list = data.value
        },
        search: ({target:{value:v}}) => plans.fetchTodo(v && '&$search='+v),

        async fetchTodo (etc=''){
            const {data} = await GET(`/ListOfTodos?$expand=genre,currency${etc}`)
            plans.todoList = data.value
            // plans.newTodo1 = data.newTodo1
            // plans.newTodo2 = data.newTodo2
            // plans.newTodo3 = data.newTodo3
            // plans.newTodo4 = data.newTodo4
            // plans.newTodo5 = data.newTodo5
            // plans.newTodo6 = data.newTodo6
            // plans.newTodo7 = data.newTodo7
        },
        async inspect (eve) {
            const plan = plans.plan = plans.list [eve.currentTarget.rowIndex-1]
            const res = await GET(`/Plans/${plan.ID}?$select=descr,stock,image`)
            Object.assign (plan, res.data)
            plans.order = { quantity:1 }
            setTimeout (()=> $('form > input').focus(), 111)
        },

        async goPlan () {
            const {plan,order} = plans, quantity = parseInt (order.quantity) || 1 // REVISIT: Okra should be less strict
            try {
                
                const res = await POST(`/goPlan`, { quantity, plan: plan.ID })
                plan.stock = res.data.stock
                window.location.href = "http://localhost:4004/vue/Main Page/main.html";
                // plans.order = { quantity, succeeded: `Successfully ordered ${quantity} item(s).` }
            } catch (e) {
                plans.order = { quantity, failed: e.response.data.error ? e.response.data.error.message : e.response.data }
            }
        },
        async editPlan () {
            const {plan,order} = plans, quantity = parseInt (order.quantity) || 1 // REVISIT: Okra should be less strict
            try {
                
                const res = await POST(`/editPlan`, { quantity, plan: plan.ID })
                plan.stock = res.data.stock
                window.location.href = "http://localhost:4004/vue/MasterData_Setup/Chart_of_Accounts.html";
                // plans.order = { quantity, succeeded: `Successfully ordered ${quantity} item(s).` }
            } catch (e) {
                plans.order = { quantity, failed: e.response.data.error ? e.response.data.error.message : e.response.data }
            }
        },

        async login() {
            try {
                const { data:user } = await axios.post('/user/login',{})
                if (user.id !== 'anonymous') plans.user = user
            } catch (err) { plans.user = { id: err.message } }
        },

        async getUserInfo() {
            try {
                const { data:user } = await axios.get('/user/me')
                if (user.id !== 'anonymous') plans.user = user
            } catch (err) { plans.user = { id: err.message } }
        },
    }
}).mount('#app')



plans.getUserInfo()
plans.fetch()
plans.fetchTodo()

//books.getUserInfo()
//books.fetch() // initially fill list of books

document.addEventListener('keydown', (event) => {
    // hide user info on request
    if (event.key === 'u')  plans.user = undefined
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