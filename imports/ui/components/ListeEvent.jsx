import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import React,{PropTypes,Component} from 'react';
import {englishToFrenchDate} from '../../utils/utils.js';


class ListeEvent extends Component{
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
        let {getEvents}=this.props.data;
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
                        <TableHeaderColumn tooltip="Titre de l'Event">Titre</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Lieu de l'Event">Lieu</TableHeaderColumn>  
                        <TableHeaderColumn tooltip="Date de l'Event">Date</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Heure de l'Event">Heure</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Nombre de tickets virtuels">No. Tickets</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Prix unitaire des tickets virtuels">Prix unitaire</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Nombre de vendeurs attribués">No. Vendeurs</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Statut de l'Event">Statut</TableHeaderColumn>
                        
                                    
                    </TableRow>
                </TableHeader>
                    <TableBody
                        displayRowCheckbox={this.state.table.showCheckboxes}
                        deselectOnClickaway={this.state.table.deselectOnClickaway}
                        showRowHover={this.state.table.showRowHover}
                        stripedRows={this.state.table.stripedRows}
                    >
                    {
                            typeof getEvents!= "undefined" && getEvents.length ?getEvents.map((row,index)=>{
                                    return(<TableRow key={index} className="animated bounceInLeft"  ref={`user${index}`}>
                                            <TableRowColumn title="">{index+1}</TableRowColumn>
                                            <TableRowColumn title={row.nom_event}>{row.nom_event}</TableRowColumn>
                                            <TableRowColumn title={row.lieu_event}>{row.lieu_event}</TableRowColumn>
                                            <TableRowColumn title={moment(row.date_event).format('LLLL')}>{moment(row.date_event).format('LLLL')}</TableRowColumn>
                                            <TableRowColumn title={moment(row.heure_event).format('HH:MM:ss')}>{moment(row.heure_event).format('HH:MM:ss')}</TableRowColumn>
                                            <TableRowColumn title={row.ticket_max}>{row.ticket_max}</TableRowColumn>
                                            <TableRowColumn title={row.ticket_price}>{row.ticket_price}</TableRowColumn>
                                            <TableRowColumn title={row.vendeur_max}>{row.vendeur_max}</TableRowColumn>
                                            <TableRowColumn title={row.statut}>{row.statut}</TableRowColumn>
                                                
                                    </TableRow>);
                                }):<TableRow>
                                    <TableRowColumn colSpan="8">
                                        <div style={{textAlign:'center'}}>
                                        Si votre recherche est infructueuse cela signifie que cet Event n'est pas disponible dans la base ou n'a pas encore été créé.    
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                    }
                    
                    </TableBody>
                </Table>
        );
    }
}

const getEventsList=gql`
query getListeEvents($nomEvent:String){
    getEvents(nom_event:$nomEvent){
        nom_event
        date_event
        heure_event
        lieu_event
        ticket_max
        vendeur_max
        ticket_price
        statut
    },
    
}`;


export default graphql(getEventsList,{
    options:({nomEvent}) => ({  
        variables: {
            nomEvent,     
    },pollInterval: 2000 })
    })(ListeEvent);