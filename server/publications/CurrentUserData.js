import {Meteor} from 'meteor/meteor';

export default EventList=()=>{
Meteor.publish(null, function() {
    return Meteor.users.find({_id: this.userId}, {fields: {codeRedac: 1,
        ticketIntervalDebut:1,
        ticketIntervalFin:1,
        eventId:1,
        eventName:1
    }});
  });
}