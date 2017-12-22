import {Meteor} from 'meteor/meteor';
import {SSR} from 'meteor/meteorhacks:ssr';
import{Promise} from 'meteor/promise';
import { check } from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import {moment} from 'meteor/momentjs:moment';
import {Email} from 'meteor/email';
import Future from 'fibers/future';

import {Events,Tickets,Sales} from '../imports/api/collections.js';
var qr = require('qr-image');  
var fs = require('fs');

SSR.compileTemplate('htmlEmail', Assets.getText('mailTemplate.html'));
export default ()=>{
    Meteor.methods({
        checkAdminUser(username,mdp){
            if(username===Meteor.settings.ADMINLOGMDP && mdp===Meteor.settings.ADMINLOGMDP)
            return true;
            else
            return false;
        },
        createNewEvent(values){
            let eventExists=Events.findOne({nom_event:values.nomEvent,date_event:values.dateEvent,heure_event:values.heureEvent,lieu_event:values.lieu});
            if(!eventExists){
                Events.insert({
                    nom_event:values.nomEvent,
                    lieu_event:values.lieu,
                    date_event:values.dateEvent,
                    heure_event:values.heureEvent,
                    ticket_max:values.ticketno,
                    vendeur_max:values.vendeurno,
                    ticket_price:values.ticketPrice,
                    nb_vendeur_restant:values.vendeurno,
                    last_ticketNo_givenTo_Vendor:0,
                    statut:'VALIDE',//ANNULE,VALIDE,DONE
                });
            }else{
                throw new Meteor.Error("Cet event existe déjà. Veuillez en créer un autre.");
            }
        },
        sendEmail(to,from,subject,text,cc,values){
            //check([to],[Array]);
            check([from,subject,text],[String]);
            this.unblock();
            if(!values){
                Email.send({to,from,subject,html:text,cc});   
            }else{

                Email.send({to,from,subject,html:SSR.render('htmlEmail',values),cc});                
            }
        },
        createNewUser(values){
            let chosenEvent=Events.findOne({_id:values.event});
            if(!chosenEvent.nb_vendeur_restant){
                throw new Meteor.Error("Le nombre maximum de Vendeur/Bouncer pour l'event "+values.event+" a été atteint.Veuillez choisir un autre event ou effecuer une modification sur l'event choisi.");     
            }
            let codeFound=Meteor.users.findOne({codeRedac:values.codeRedac.toUpperCase()});
            if(codeFound){
                 throw new Meteor.Error("Veuillez re vérifier, il se pourrait que le code rédacteur de ce Vendeur/Bouncer existe déja");
                 //return false;
            }
            let otherVendors=Meteor.users.find({eventId:chosenEvent._id},{sort:{dateCreation:1}}).fetch();
            let last_ticketNo_givenTo_Previous_Vendor=0;
            if(typeof otherVendors[0] !="undefined" || otherVendors.length){
                console.dir(otherVendors);
                last_ticketNo_givenTo_Previous_Vendor=otherVendors[0].ticketInterval.fin;
            }
            
            //-----------------------------
            if( Accounts.createUser({
                        username:values.username,
                        password:values.password
                    })){
                        let nuser=Meteor.users.findOne({username:values.username});
                        if(Meteor.users.update(nuser._id,{
                            $set:{
                                uncrypted:values.passwordconf,
                                nom:values.nom,
                                prenoms:values.prenom,
                                fullname: values.nom+' '+values.prenom,
                                codeRedac:values.codeRedac.toUpperCase(),
                                role:values.role,
                                telephone:values.telephone,
                                email:values.email,
                                ticketIntervalDebut:otherVendors.length?last_ticketNo_givenTo_Previous_Vendor+1:1,
                                ticketIntervalFin:values.slider+1,
                                assignedToEvent:true,
                                eventId:chosenEvent._id,
                                eventName:chosenEvent.nom_event,
                                redac:values.codeRedac,
                                dateCreation:new Date()
                            }
                        })){
                           Events.update(chosenEvent._id,{
                               $set:{
                                nb_vendeur_restant:--chosenEvent.nb_vendeur_restant,
                                last_ticketNo_givenTo_Vendor:values.slider+1
                               }
                           });
                           for(let i=otherVendors.length?last_ticketNo_givenTo_Previous_Vendor+1:1;i<=values.slider+1;i++){
                            Tickets.insert({
                                ticket_no:i,
                                eventId:chosenEvent._id,
                                buyerName:'',
                                buyerContacts:[],
                                buyerMail:'',
                                vendorCodeRedac:values.codeRedac,
                                dateCreation:new Date(),
                                statut:'NOT_SOLD',//NOT_SOLD,SOLD
                                price:chosenEvent.ticket_price,
                                passedEvent:false,
                                datePassed:null,
                                QRCODE:''

                            });
                           }
                           let message="";
                           if(values.role=="V"){
                             message="<em>Ceci est un message automatique, veuillez ne pas y répondre.</em><br/><br/>Bonjour Monsieur/Madame,<br/><br/>Veuillez trouver ci dessous vos accès à l'application <b>QRPASS</b> en tant que <b>VENDEUR</b> . <br/><br/>Identifiant: <b>"+values.username+"</b><br/> Mot de passe: <b>"+values.passwordconf+"</b>. <br/><br/>Votre application est accèssible via le lien suivant: http://10.11.100.48:8087 <br/>Pour un fonctionnement optimal sur le web veuillez ouvrir l'application avec les navigateurs <b>Google Chrome</b> ou <b>Mozilla Firefox.</b><br/><br/> Cordialement, <br/><br/><b>QRPASS 2017 tous droits réservés</b>";
                           }else if(values.role=="B"){
                            message="<em>Ceci est un message automatique, veuillez ne pas y répondre.</em><br/><br/>Bonjour Monsieur/Madame,<br/><br/>Veuillez trouver ci dessous vos accès à l'application <b>QRPASS Mobile</b> en tant que <b>BOUNCER</b> . <br/><br/>Identifiant: <b>"+values.username+"</b><br/> Mot de passe: <b>"+values.passwordconf+"</b>. <br/><br/> Cordialement, <br/><br/><b>QRPASS 2017 tous droits réservés</b>";                            
                           }else{
                            message="<em>Ceci est un message automatique, veuillez ne pas y répondre.</em><br/><br/>Bonjour Monsieur/Madame,<br/><br/>Veuillez trouver ci dessous vos accès à l'application <b>QRPASS</b> et <b>QRPASS Mobile</b> en tant que <b>VENDEUR-BOUNCER</b> . <br/><br/>Identifiant: <b>"+values.username+"</b><br/> Mot de passe: <b>"+values.passwordconf+"</b>. <br/><br/>Votre application est accèssible via le lien suivant: http://10.11.100.48:8087 <br/>Pour un fonctionnement optimal sur le web veuillez ouvrir l'application avec les navigateurs <b>Google Chrome</b> ou <b>Mozilla Firefox.</b><br/><br/> Cordialement, <br/><br/><b>QRPASS 2017 tous droits réservés</b>";                            
                           }
                            //console.log("Valeur de la variable environment mail "+process.env.MAIL_URL);
                           // try{
                                Meteor.call("sendEmail",values.email,"info@qrpass.com","Vos identifiants sur l'application QRPASS",message,Meteor.settings.ADMINMAIL);   
                            /*}catch(e){
                                throw new Meteor.Error("L'envoi par mail des accès du vendeur n'a pas pu être effectuer");
                            }*/
                            return ;
                        }
                        else{
                            Meteor.users.remove({username:values.username});
                            throw new Meteor.Error("Veuillez re vérifier vos champs");
                            
                        }
                    }else{
                       throw new Meteor.Error("Veuillez re vérifier vos champs, cet utilisateur existe deja");
                    }
             
            
        },
        createSale(values){
            this.unblock();
            let fut=new Future();
            if(!values.ticketsRestants){
                throw Meteor.Error("Vous ne disposez plus de tickets à vendre.");
            }else{
                let ticketsNotSold=Tickets.find({statut:"NOT_SOLD",passedEvent:false,},{sort:{dateCreation:1},limit:values.slider}).fetch();
                let event=Events.findOne({_id:values.eventId});
                //console.dir(ticketsNotSold);
                if(ticketsNotSold.length===values.slider){
                    for(let i=0;i<ticketsNotSold.length;i++){
                        //console.dir(ticketsNotSold[i]);
                        let messagetext=`Event: ${values.eventName}
    Ticket N°: ${ticketsNotSold[i].ticket_no}
    Ticket au nom de: ${values.civilite} ${values.buyername}
    Contacts: ${values.telephone}
    Prix d'achat: ${ticketsNotSold[i].price} FCFA
    Date d'achat: ${moment(new Date()).format("DD-MM-YYYY")}
                        `;
                        var code = qr.image(messagetext, { type: 'png' }); 
                        code.pipe(require('fs').createWriteStream(`ticket_${ticketsNotSold[i].ticket_no}_${values.eventName}QR.png`));
                        //console.dir(code)
                        let nv=values;
                        let path=Meteor.rootPath+`/ticket_${ticketsNotSold[i].ticket_no}_${values.eventName}QR.png`;
                        nv.ticketno=ticketsNotSold[i].ticket_no;
                        nv.nomtotal=values.civilite+" "+values.buyername;
                        nv.codeqr=path;
                        nv.dateEvent=moment(event.date_event).format("DD-MM-YYYY");
                        nv.timeEvent=moment(event.heure_event).format('hh:mm');
                        
                        console.log(Meteor.rootPath)

                        Tickets.update(ticketsNotSold[i]._id,
                            {
                                $set:{
                                    buyerName:`${values.civilite} ${values.buyername}`,
                                    buyerContacts:ticketsNotSold[i].buyerContacts.push(values.telephone),
                                    statut:"SOLD",
                                    QRCODE:code

                                }
                            });
                            
                        require('fs').readFile(path,Meteor.bindEnvironment((err,res)=>{
                            if(err){
                                throw Meteor.Error("Erreur lors de la génération du ticket");
                            }
                            console.log("check res "+path);
                            Email.send({
                                to: values.email,
                                from: "info@qrpass.com",
                                subject: `Votre ticket N° ${ticketsNotSold[i].ticket_no} pour l'évènement ${values.eventName}`,
                                html: SSR.render('htmlEmail', nv),
                                cc:Meteor.settings.ADMINMAIL,
                                attachments: [{
                                    filename: `ticket_${ticketsNotSold[i].ticket_no}_${values.eventName}QR.png`,
                                    path:path,
                                }]
                            });
                            require('fs').unlinkSync(`ticket_${ticketsNotSold[i].ticket_no}_${values.eventName}QR.png`);    
                        }));
                        
                        
                    // Meteor.call("sendEmail",values.email,"info@qrpass.com",`Votre ticket N° ${ticketsNotSold[i].ticket_no} pour l'évènement ${values.eventName}` ,Meteor.settings.ADMINMAIL,nv);                       
                    }
                    return true
                }else{
                    throw new Meteor.Error("Veuillez re vérifier Il n'y a plus de tickets à vendre pour cet event");
                }
            }
           // return fut.wait();
        }
    });
};