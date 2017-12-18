import {Meteor} from 'meteor/meteor';
import {Events} from '../../imports/api/collections.js';

export default EventList=()=>{
    Meteor.publish('EventList',function(){
        return Events.find();
       
    });
}