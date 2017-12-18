import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';

let Events=new Mongo.Collection('Events');
let Tickets=new Mongo.Collection('Tickets');
let Sales=new Mongo.Collection("Sales");

export {Events,Tickets,Sales};