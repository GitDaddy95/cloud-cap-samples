const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){

  const { Plans } = cds.entities ('sap.capire.bookshop')
  const { ListOfPlans } = this.entities

  const { Todos } = cds.entities ('sap.capire.bookshop')
  const { ListOfTodos } = this.entities

  // Reduce stock of ordered books if available stock suffices
  this.on ('goPlan', async req => {
    const {plan,quantity} = req.data
    if (quantity < 1) 
      return req.reject (400,`quantity has to be 1 or more`)
    let b = await SELECT `stock` .from (Plans,plan)
    if (!b) 
      return req.error (404,`Plan #${plan} doesn't exist`)
    let {stock} = b
    if (quantity > stock) 
      return req.reject (409,`${quantity} exceeds stock for plan #${plan}`)
    await UPDATE (Plans,plan) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedPlan', { plan, quantity, buyer:req.user.id })
    return { stock }
  })

  this.on ('editPlan', async req => {
    const {plan,quantity} = req.data
    if (quantity < 1) 
      return req.reject (400,`quantity has to be 1 or more`)
    let b = await SELECT `stock` .from (Plans,plan)
    if (!b) 
      return req.error (404,`Plan #${plan} doesn't exist`)
    let {stock} = b
    if (quantity > stock) 
      return req.reject (409,`${quantity} exceeds stock for plan #${plan}`)
    await UPDATE (Plans,plan) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedPlan', { plan, quantity, buyer:req.user.id })
    return { stock }
  })

  // Add some discount for overstocked books
  this.after ('READ', ListOfPlans, each => {
    if (each.stock > 111) each.title
  })

  //for accounts
  this.on ('goTodo', async req => {
    const {todo,quantity} = req.data
    if (quantity < 1) 
      return req.reject (400,`quantity has to be 1 or more`)
    let b = await SELECT `stock` .from (Todos,account)
    if (!b) 
      return req.error (404,`Plan #${todo} doesn't exist`)
    let {stock} = b
    if (quantity > stock) 
      return req.reject (409,`${quantity} exceeds stock for plan #${todo}`)
    await UPDATE (Todos,account) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedTodo', { account, quantity, buyer:req.user.id })
    return { stock }
  })

  this.on ('editTodo', async req => {
    const {todo,quantity} = req.data
    if (quantity < 1) 
      return req.reject (400,`quantity has to be 1 or more`)
    let b = await SELECT `stock` .from (Todos,account)
    if (!b) 
      return req.error (404,`Plan #${todo} doesn't exist`)
    let {stock} = b
    if (quantity > stock) 
      return req.reject (409,`${quantity} exceeds stock for plan #${todo}`)
    await UPDATE (Plans,plan) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedTodo', { todo, quantity, buyer:req.user.id })
    return { stock }
  })

  // Add some discount for overstocked books
  this.after ('READ', ListOfTodos, each => {
    if (each.stock > 111) each.title
  })

  return super.init()
}}

module.exports = { CatalogService }
