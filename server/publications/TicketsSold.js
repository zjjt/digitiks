import {Meteor} from 'meteor/meteor';
import {Tickets} from '../../imports/api/collections.js';

export default EventList=()=>{
    Meteor.publish('TicketsSold',function(){
        return Tickets.find();
       
    });
}