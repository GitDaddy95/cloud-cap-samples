using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin') {
  // entity Books as projection on my.Books;
  entity Companies as projection on my.Companies;
  entity Plans as projection on my.Plans;
  entity Accounts as projection on my.Accounts;
  entity CostCenters as projection on my.CostCenters;
  entity Dimensions as projection on my.Dimensions;
  entity Authors as projection on my.Authors;
}
