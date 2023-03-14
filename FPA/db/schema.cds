using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Companies : managed {
  key ID : Integer;
  title  : localized String(111);
  plan : Association to many Plans;
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  currency : Currency;
}

entity Plans : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
}

entity Accounts : managed {
  key ID : Integer;
  accname  : localized String(111);
  externalCode  : localized String(1111);
  account : Association to Accounts;
  genre  : Association to Genres;
  lvl  : Integer;
  balance  : Decimal;
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  plans  : Association to many Plans on plans.author = $self;
}

entity CostCenters : managed {
  key ID : Integer;
  ccname   : String(111);
  dimension : Association to one Dimensions;
  activeFrom  : Date;
  activeTo  : Date;
  active  : Boolean;
  genre  : Association to Genres;
  currency : Currency;
  
}

entity Dimensions : managed {
  key ID : Integer;
  descr   : String(111);
  costcenter  : Association to one CostCenters;
  activeFrom  : Date;
  activeTo  : Date;
  active  : Boolean;
  genre  : Association to Genres;
  currency : Currency;
  
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
