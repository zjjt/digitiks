const schema=`

type Query{
            getEvents(_id:String,nom_event:String,statut:String):[EVENT]
            getVendors(nomtotal:String,assignedToEvent:Boolean):[VENDOR]
        }
type EVENT{
    _id:String
    nom_event:String
    date_event:String
    heure_event:String
    lieu_event:String
    ticket_max:Int
    vendeur_max:Int
    ticket_price:Int
    nb_vendeur_restant:Int
    last_ticketNo_givenTo_Vendor:Int
    statut:String

}
type VENDOR{
    _id:String
    fullname:String
    codeRedac:String
    role:String
    telephone:String
    email:String
    ticketIntervalDebut:Int
    ticketIntervalFin:Int
    assignedToEvent:Boolean
    eventId:String
    eventName:String
    redac:String
    dateCreation:String
}
schema{
    query:Query
}

`;
export default schema;