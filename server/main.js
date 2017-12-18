import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import EventList from './publications/EventList.js';
import TicketsSold from './publications/TicketsSold.js';
import CurrentUserData from './publications/CurrentUserData.js';
import methods from './methods';

Meteor.startup(()=>{
   // Meteor.users._ensureIndex({codeRedac:1},{unique:true});
   EventList();
   TicketsSold();
   CurrentUserData();
   methods();
});