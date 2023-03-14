const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){

  const { Plans } = cds.entities ('sap.capire.bookshop')
  const { ListOfPlans } = this.entities

  const { Companies } = cds.entities ('sap.capire.bookshop')
  const { ListOfCompanies } = this.entities

  const { Accounts } = cds.entities ('sap.capire.bookshop')
  const { ListOfAccounts } = this.entities

  const { CostCenters } = cds.entities ('sap.capire.bookshop')
  const { ListOfCostCenters } = this.entities

  const { Dimensions } = cds.entities ('sap.capire.bookshop')
  const { ListOfDimensions } = this.entities

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

  this.on ('goCompany', async req => {
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
    await this.emit ('OrderedCompany', { plan, quantity, buyer:req.user.id })
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
  // Add some discount for overstocked books
  this.after ('READ', ListOfAccounts, each => {
    if (each.stock > 111) each.title
  })
  return super.init()
}}

module.exports = { CatalogService }
