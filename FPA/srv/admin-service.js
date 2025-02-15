const cds = require('@sap/cds/lib')

module.exports = class AdminService extends cds.ApplicationService { init(){
  this.before ('NEW','Authors', genid)
  this.before ('NEW','Companies', genid)
  this.before ('NEW','Plans', genid)
  this.before ('NEW','Accounts', genid)
  this.before ('NEW','CostCenters', genid)
  this.before ('NEW','Dimensions', genid)
  return super.init()
}}

/** Generate primary keys for target entity in request */
async function genid (req) {
  const {ID} = await cds.tx(req).run (SELECT.one.from(req.target).columns('max(ID) as ID'))
  req.data.ID = ID - ID % 100 + 100 + 1
}
