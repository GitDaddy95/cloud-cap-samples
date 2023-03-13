using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  /** For displaying lists of Books */
  // @readonly entity ListOfBooks as projection on Books
  // excluding { descr };

  @readonly entity ListOfPlans as projection on Plans
  excluding { descr };

  @readonly entity ListOfTodos as projection on Todos
  excluding { descr };

  /** For display in details pages */
  // @readonly entity Books as projection on my.Books { *,
  //   author.name as author
  // } excluding { createdBy, modifiedBy };

  @readonly entity Plans as projection on my.Plans { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly entity Todos as projection on my.Todos { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  // @requires: 'authenticated-user'
  // action submitOrder ( book: Books:ID, quantity: Integer ) returns { stock: Integer };
  // event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action goPlan ( plan: Plans:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action editPlan ( plan: Plans:ID, quantity: Integer ) returns { stock: Integer };
  //event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action goTodo ( todo: Todos:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedTodo : { todo: Todos:ID; quantity: Integer; buyer: String };

  @requires: 'authenticated-user'
  action editTodo ( todo: Todos:ID, quantity: Integer ) returns { stock: Integer };
  //event OrderedPlan : { plan: Plans:ID; quantity: Integer; buyer: String };
}
