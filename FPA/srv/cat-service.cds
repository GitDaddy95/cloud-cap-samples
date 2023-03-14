using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  /** For displaying lists of Books */
  // @readonly entity ListOfBooks as projection on Books
  // excluding { descr };

  @readonly entity ListOfPlans as projection on Plans
  excluding { descr };

  @readonly entity ListOfAccounts as projection on Accounts
  excluding { name };

  @readonly entity ListOfCostCenters as projection on CostCenters
  excluding { name };

  @readonly entity ListOfDimensions as projection on Dimensions
  excluding { name };

   @readonly entity ListOfCompanies as projection on Companies
  excluding { companyname };

  /** For display in details pages */
  // @readonly entity Books as projection on my.Books { *,
  //   author.name as author
  // } excluding { createdBy, modifiedBy };

  @readonly entity Plans as projection on my.Plans { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly entity Accounts as projection on my.Accounts { *,
    account.accname as account
  } excluding { createdBy, modifiedBy };

  @readonly entity CostCenters as projection on my.CostCenters { *,
    dimension.descr as dimension
  } excluding { createdBy, modifiedBy };

   @readonly entity Dimensions as projection on my.Dimensions { *,
    costcenter.ccname as costcenter
  } excluding { createdBy, modifiedBy };

  @readonly entity Companies as projection on my.Companies { *,
    author.name as author
  } excluding { createdBy, modifiedBy };


  @requires: 'authenticated-user'
  action goPlan ( plan: Plans:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action editPlan ( plan: Plans:ID, quantity: Integer ) returns { stock: Integer };
  //event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action goAccount ( account: Accounts:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedTodo : { todo: Accounts:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action goCompany ( company: Companies:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedCompany : { todo: Companies:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action editAccount ( account: Accounts:ID, quantity: Integer ) returns { stock: Integer };
  //event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };
}
