import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import React,{PropTypes,Component} from 'react';
import {englishToFrenchDate} from '../../utils/utils.js';


class ListeVendors extends Component{
    constructor(){
        super();
        this.state={
            dialogIsOpen:false,
            dialogTIsOpen:false,
            errorMsg:'',
            showLoader:false,
            error:false,
            alreadyOp:false,
            decoupage:[],
            currentFile:false,
            progress:null,
            table:{
                fixedHeader:true,
                fixedFooter:true,
                stripedRows:false,
                showRowHover:false,
                selectable:false,
                multiSelectable: false,
                enableSelectAll:false,
                deselectOnClickaway:true,
                showCheckboxes:false,
                height:'450px'
            }

        }
    }

    _onRowSelection(rowsarr){
            let regarray=[];
            if(rowsarr){
                rowsarr.map((r)=>{
                regarray.push(this.props.listeDispo[r]);
                //console.dir(this.props.data.userSQL[r])
             });
            }
            switch(regarray[0].domaine){
                case "I":
                regarray[0].domainefull="INDIVIDUEL";
                break;
                 case "G":
                regarray[0].domainefull="GROUPE";
                break;
                 case "R":
                regarray[0].domainefull="RENTE";
                break;
                
            }
            this.setState({
                selectedRows:rowsarr,
                regSelected:regarray,
                //dialogTIsOpen:true
            });
            console.dir(regarray);
            
        }
    render(){
        let {getVendors}=this.props.data;
        console.log(this.props);
        return(
            <Table
                height={this.state.table.height}
                fixedHeader={this.state.table.fixedHeader}
                fixedFooter={this.state.table.fixedFooter}
                selectable={this.state.table.selectable}
                multiSelectable={this.state.table.multiSelectable}
                onRowSelection={this._onRowSelection.bind(this)}
                className="tableau"
                
            >
                <TableHeader
                    displaySelectAll={this.state.table.showCheckboxes}
                    adjustForCheckbox={this.state.table.showCheckboxes}
                    enableSelectAll={this.state.table.enableSelectAll}
                >
                    <TableRow>
                        <TableHeaderColumn tooltip="Ligne numero">N°</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Nom du Vendeur/Bouncer">Nom</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Role du Vendeur/Bouncer">Role</TableHeaderColumn>  
                        <TableHeaderColumn tooltip="Téléphone">Téléphone</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Email">Email</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Nombre de tickets virtuels à vendre pour cet event">No. Tickets à vendre</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Numéro du premier ticket ">Numéro du 1er ticket</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Numéro du dernier ticket">Numéro du dernier ticket</TableHeaderColumn>
                        <TableHeaderColumn tooltip="dispatché à un event">Dispatché à un event</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Nom de l'event auquel le vendeur/bouncer est assigné">Nom Event</TableHeaderColumn>
                        <TableHeaderColumn tooltip="code du vendeur">Code Vendeur</TableHeaderColumn>
                        <TableHeaderColumn tooltip="créer le">Créer le</TableHeaderColumn>
                       
                        
                                    
                    </TableRow>
                </TableHeader>
                    <TableBody
                        displayRowCheckbox={this.state.table.showCheckboxes}
                        deselectOnClickaway={this.state.table.deselectOnClickaway}
                        showRowHover={this.state.table.showRowHover}
                        stripedRows={this.state.table.stripedRows}
                    >
                    {
                            typeof getVendors!= "undefined" && getVendors.length ?getVendors.map((row,index)=>{
                                    return(<TableRow key={index} className="animated bounceInLeft"  ref={`user${index}`}>
                                            <TableRowColumn title="">{index+1}</TableRowColumn>
                                            <TableRowColumn title={row.fullname}>{row.fullname}</TableRowColumn>
                                            <TableRowColumn title={row.role=="V"?'Vendeur':row.role=="B"?'Bouncer':'Vendeur Bouncer'}>{row.role=="V"?'Vendeur':row.role=="B"?'Bouncer':'Vendeur Bouncer'}</TableRowColumn>
                                            <TableRowColumn title={row.telephone}>{row.telephone}</TableRowColumn>
                                            <TableRowColumn title={row.email}>{row.email}</TableRowColumn>
                                            <TableRowColumn title={row.ticketIntervalFin-row.ticketIntervalDebut}>{row.ticketIntervalFin-row.ticketIntervalDebut}</TableRowColumn>
                                            <TableRowColumn title={row.ticketIntervalDebut}>{row.ticketIntervalDebut}</TableRowColumn>
                                            <TableRowColumn title={row.ticketIntervalFin}>{row.ticketIntervalFin}</TableRowColumn>
                                            <TableRowColumn title={row.assignedToEvent?"Assigné":"Non Assigné"}>{row.assignedToEvent?"Assigné":"Non Assigné"}</TableRowColumn>
                                            <TableRowColumn title={row.eventName}>{row.eventName}</TableRowColumn>
                                            <TableRowColumn title={row.redac}>{row.redac}</TableRowColumn>
                                            <TableRowColumn title={moment(row.dateCreation).format("DD-MM-YYYY")}>{moment(row.dateCreation).format("DD-MM-YYYY")}</TableRowColumn>    
                                    </TableRow>);
                                }):<TableRow>
                                    <TableRowColumn colSpan="8">
                                        <div style={{textAlign:'center'}}>
                                        Si votre recherche est infructueuse cela signifie que ce Vendeur/Bouncer n'est pas disponible dans la base ou n'a pas encore été créé.    
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                    }
                    
                    </TableBody>
                </Table>
        );
    }
}

const getVendorsList=gql`
query getListeVendors($nomtotal:String){
    getVendors(nomtotal:$nomtotal){
        _id
        fullname
        codeRedac
        role
        telephone
        email
        ticketIntervalDebut
        ticketIntervalFin
        assignedToEvent
        eventId
        eventName
        redac
        dateCreation
    },
    
}`;


export default graphql(getVendorsList,{
    options:({nomtotal}) => ({  
        variables: {
            nomtotal,     
    },pollInterval: 2000 })
    })(ListeVendors);