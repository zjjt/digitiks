import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import {TextField,DatePicker,SelectField,TimePicker} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import Slider from 'material-ui/Slider';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Meteor} from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Random} from 'meteor/random';
import _ from 'lodash';
import {validateEmail} from '../../utils/utils';
import { Tickets } from '../../api/collections';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

 class CreateSaleForm extends Component{
    constructor(props){
        super(props);
        this.handleEventChange=this.handleEventChange.bind(this);
        this.handleChangeS=this.handleChangeS.bind(this);
        this.state={
            dialogIsOpen:false,
            errorMsg:'',
            eventId:Meteor.user()?Meteor.user().eventId:'',
            //Meteor.user().ticketIntervalFin-Meteor.user().ticketIntervalDebut,            
            snackOpen:false,
            snackMsg:'',
            slider:0,
            
        };
    }
    _dialogOpen(){
        this.setState({dialogIsOpen: true});
    }

   _dialogClose(){
       this.setState({dialogIsOpen: false});
   }

   _snackClose(){
       this.setState({
           snackOpen:false
       });
   }

   componentDidUpdate(){
      
   }
   componentDidMount(){
       
   }
   handleEventChange=(event,index,value)=>{
       //console.log(this.props.data.getEvents[this.props.event]);
    this.setState({
        eventId:this.props.data.getEvents[index]._id
    })
   }

   handleChangeS=(event,value)=>{
       console.log(value);
       this.setState({slider:value});
   };

    render(){
        const {handleSubmit,pristine,submitting,dispatch,REDAC,vendorTicketMax,reset}=this.props;
        console.log(vendorTicketMax)
        //console.log(REDAC);
        const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];
       
         const submit=(values,dispatch)=>{
            if(values.civilite===''||!values.civilite){
                this.setState({
                    errorMsg:"Le champs civilité ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.buyername===''||!values.buyername){
                this.setState({
                    errorMsg:"Le champs Nom de l'acheteur ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.telephone===''||isNaN(Number(values.telephone))||values.telephone.length<8||values.telephone.length>8){
                this.setState({
                    errorMsg:"Veuillez fournir un numéro de téléphone valide."+this.state.eventId
                });
                this._dialogOpen();
            }
            else if(values.email===''||!validateEmail(values.email)){
                this.setState({
                    errorMsg:"Veuillez fournir un email valide."
                });
                this._dialogOpen();
            }  
            else if(!this.state.slider){
                this.setState({
                    errorMsg:"Veuillez attribuer un nombre de ticket suffisant à l'acheteur."
                });
                this._dialogOpen();
            }
            else{
               //alert(JSON.stringify(values));
               values.slider=this.state.slider;
               values.eventId=this.state.eventId;
               values.ticketsRestants=this.props.ticketsNotSoldNo;
               values.eventName=Meteor.user().eventName;
                Meteor.call('createSale',values,(err)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Une erreur s'est produite lors de la création du ticket. "+err.reason+"."
                            });
                        this._dialogOpen();
                    }else{
                        reset();
                        this.setState({
                        snackMsg:"Les "+this.state.slider+" tickets de "+values.civilite+" "+values.buyername+" ont été générés et envoyé à son adresse mail",
                        snackOpen:true,
                        slider:0,
                        });
                    }
                });
                /*const retourServer=Meteor.call('createNewUser',values);
                if(retourServer.ok){
                   this.setState({
                        snackMsg:`L'utilisateur ${values.username} a été créé`,
                        snackOpen:true
                        });
                }else{
                    this.setState({
                    errorMsg:"Une erreur s'est produite lors de la creation de l'utilisateur."
                    });
                 this._dialogOpen();
                }*/
                
               // dispatch(connection());
                //FlowRouter.go('adminDashboard');
            }
        };

        const maxLength = max => value =>(value && value.length > max)||(value && value.length < max) ? `ce champs doit être de ${max} caractères` : undefined;
        const maxLength3=maxLength(3);
        const maxLength8=maxLength(8);
        const required = value => value ? undefined : 'Requis';
        const number = value => value && isNaN(Number(value)) ?"Ce champs n'accepte que des nombres":undefined;
        const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?'Adresse e-mail invalide' : undefined
       console.log(this.props);
        return(
            <div className="formDiv">
                <Dialog
                actions={dialogActions}
                modal={false}
                open={this.state.dialogIsOpen}
                onRequestClose={this._dialogClose}
                >
                    <span className="errorMsg">{this.state.errorMsg}</span>
                </Dialog>
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    autoHideDuration={5000}
                    onRequestClose={this._snackClose.bind(this)}
                />
                <h2 style={{textAlign:'center'}}>{Meteor.user()?Meteor.user().eventName:''}</h2><br/>
                <div style={{display:'flex',width:'100%',justifyContent:"space-between"}}>
                    <span style={{fontSize:"40px"}}>Tickets restants: <b>{this.props.ticketsNotSoldNo}</b></span>
                    <span style={{fontSize:"40px"}}>Tickets vendus: <b>{this.props.ticketsSoldNo}</b></span>
                </div>
                <Divider/>
               <form onSubmit={handleSubmit(submit)}>
               <Field
                    name="civilite" 
                    component={SelectField}
                    floatingLabelText="Civilité"
                    hintText="Civilité de l'acheteur"
                    fullWidth={true}
                    floatingLabelFixed={true}
                    validate={[required]}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                >
                    <MenuItem  value="M." primaryText="Monsieur"/>
                    <MenuItem  value="Mme" primaryText="Madame"/>
                    <MenuItem  value="Mlle" primaryText="Mademoiselle"/>

                </Field>
               <Field
                    name="buyername" 
                    component={TextField}
                    hintText="Entrez le nom de famille de l'acheteur"
                    floatingLabelText="Nom de l'acheteur"
                    fullWidth={true}
                    floatingLabelFixed={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    validate={[ required ]}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="telephone" 
                    component={TextField}
                    hintText="Entrez le numéro de téléphone (fixe ou mobile)"
                    floatingLabelText="Numéro de téléphone (fixe ou mobile)"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required,maxLength8,number]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="email" 
                    component={TextField}
                    hintText="Entrer l'email de l'acheteur"
                    floatingLabelText="Email de l'acheteur"
                    fullWidth={true}
                    type="mail"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required,email ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                
                
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <p style={{flexGrow:1,textAlign:'center'}}>Nombre de tickets restants à vendre pour cet Event:<b>{this.props.ticketsNotSoldNo}</b> | Nombre de tickets attribués à l'acheteur:<b>{this.state.slider}</b></p>
                        <Slider
                            min={0}
                            max={this.props.ticketsNotSoldNo>0?this.props.ticketsNotSoldNo:1}
                            step={1}
                            disabled={this.props.ticketsNotSoldNo>0?false:true}
                            value={this.state.slider}
                            onChange={this.handleChangeS}
                            required
                            style={{width:'70%',margin:'auto'}}
                            
                        />
                    </div>
                
                

                
                <div className="inAppBtnDiv">
                    <RaisedButton
                        label="Générer le ticket" 
                        labelColor="white"
                        backgroundColor="#cd9a2e"
                        className="inAppBtnForm"
                        type="submit"
                    />
                </div>
                
               </form>
            </div>
        );
    }
}
CreateSaleForm=reduxForm({
    form:'CreateEvent',
    fields:['nom','prenom','username','password','passwordconf','codeRedac','role']
})(CreateSaleForm);



 


export default createContainer(()=>{
    const tickethandle=Meteor.subscribe('TicketsSold');
    const loading=!tickethandle.ready();
    const ticketsone=Tickets.findOne({vendorCodeRedac:Meteor.user()?Meteor.user().codeRedac:'',statut:"NOT_SOLD"});    
    const ticketsExist=!loading && !! ticketsone;
    
    return{
        loading,
        ticketsone,
        ticketsExist,  
        ticketsNotSoldNo:ticketsExist?Tickets.find({vendorCodeRedac:Meteor.user().codeRedac,statut:"NOT_SOLD"},{sort:{datePassed:1}}).count():0,
        ticketsSoldNo:ticketsExist?Tickets.find({vendorCodeRedac:Meteor.user().codeRedac,statut:"SOLD"},{sort:{datePassed:1}}).count():0

    };
},CreateSaleForm);

const styles={
    floatingLabelStyle:{
        color:'gray'
    },
    underlineStyle:{
        borderColor:'gray'
    },
    underlineFocusStyle:{
        color:'gray',
        borderColor:'gray'
    },
    hintStyle:{
        color:'darkgray'
    },floatingLabelStyle:{
        color:'darkgray'
    },
    dialogContainerStyle:{
        
    }
}