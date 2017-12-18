import {Meteor} from 'meteor/meteor';
import {Events} from '../collections';

const resolvers={
    Query:{
        getEvents(_,args,context){
            if(args.nom_event && !args.statut){
            let found=Events.find({nom_event:{$regex:args.nom_event,$options: 'i'}},{sort:{date_event:1}}).fetch();
            console.log(found);
                if(found){
                    return found;
                }
                else{
                    return [];
                }
            }else if(!args.nom_event && args.statut){
                let found=Events.find({statut:args.statut},{sort:{date_event:1}}).fetch();
                return found;
            }else{
                let allEvents=Events.find({},{sort:{date_event:1}}).fetch();
                return allEvents;
            }
        },
        getVendors(_,args,context){
            if(args.nomtotal && !args.assignedToEvent){
                //console.log(args.nomtotal)
                let found=Meteor.users.find({fullname:{$regex:args.nomtotal,$options: 'i'}},{sort:{dateCreation:1}}).fetch();
                console.log(found);
                    if(found){
                        return found;
                    }
                    else{
                        return [];
                    }
                }else if(!args.nomtotal && args.assignedToEvent){
                    let found=Meteor.users.find({assignedToEvent:args.assignedToEvent},{sort:{dateCreation:1}}).fetch();
                    return found;
                }else{
                    let allVendors=Meteor.users.find({},{sort:{dateCreation:1}}).fetch();
                    return allVendors;
                }
        },
        
    }
};

export default resolvers; 