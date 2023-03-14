/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)

const account = Vue.createApp ({
    
    data() {
      return {
        list: [],
        plan: undefined,
        user: undefined,
        selectedAccountIndex: null,
        selectedAccountName: null,
        selectedAccountBalance: null,
        selectedAccountCurrency: null
      }
    },

    methods: {


        async fetch (etc='') {
            const {data} = await GET(`/ListOfAccounts?$expand=genre,currency${etc}`)
            account.list = data.value
            selectedAccountCurrency = data.value[0].currency_code
            selectedAccountBalance = data.value[0].balance
            console.log(selectedAccountBalance)
            console.log(selectedAccountCurrency)
        },

        async selected (selectedAccountIndex) {
            if(selectedAccountIndex!=null) {
                const AccName = await GET(`/Accounts/${selectedAccount}?$select=balance`)
                account.selectedAccountBalance = AccName
                console.log(AccName)
            }
            return AccName
            
            account.list = data.value
        },
        // async removeTodo(currentID,currentIndex) {
            
        //     console.log("current account ID"+currentID);
        //     console.log("current account Index"+currentIndex);
            //const res = await GET(`/Accounts/${toRemove}?$select=name,balance`)
            // this.list[currentIndex].name= null
            // console.log(this.list[currentIndex].name)
            
            // setTimeout (()=> $('form > input').focus(), 111)
            //this.toRemove = this.toRemove.filter((current) => current !== toRemove)
        // },
        // search: ({target:{value:v}}) => plans.fetchTodo(v && '&$search='+v),

        // async fetchTodo (etc=''){
        //     const {data1} = await GET(`/ListOfTodos?$expand=genre,currency${etc}`)
        //     plans.todoList = data1.value
        // },
        // async inspect (selectedAccount) {
        //     const res = await GET(`/Accounts/${selectedAccount}?$select=accname,balance`)
        //     selectedAccountName = {ID:res.name}
        //     selectedAccountBalance = {ID:res.balance}
        //     console.log(selectedAccountName)
        // },
    }
}).mount('#app')

account.fetch()


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