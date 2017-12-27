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
import {Random} from 'meteor/random';
import _ from 'lodash';
import {validateEmail} from '../../utils/utils';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

 class CreateVendorForm extends Component{
    constructor(props){
        super(props);
        this.handleEventChange=this.handleEventChange.bind(this);
        this.handleChangeS=this.handleChangeS.bind(this);
        this.state={
            dialogIsOpen:false,
            errorMsg:'',
            eventId:null,
            eventIndex:null,
            snackOpen:false,
            snackMsg:'',
            ticketRest:0,
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
   handleEventChange=(event,index,value)=>{
       //console.log(this.props.data.getEvents[this.props.event]);
    this.setState({
        ticketRest:this.props.data.getEvents[index].ticket_max-this.props.data.getEvents[index].last_ticketNo_givenTo_Vendor,
        eventId:this.props.data.getEvents[index]._id,
        eventIndex:index
    })
   }

   handleChangeS=(event,value)=>{
       console.log(value);
       this.setState({slider:value});
   };

    render(){
        const {handleSubmit,pristine,submitting,dispatch,REDAC,vendorTicketMax,reset}=this.props;
        const {getEvents}=this.props.data;
        console.log(getEvents)
        //console.log(REDAC);
        const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];
       
         const submit=(values,dispatch)=>{
            if(values.nom===''||!values.nom){
                this.setState({
                    errorMsg:"Le champs Nom de famille ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.prenom===''||!values.prenom){
                this.setState({
                    errorMsg:"Le champs Prénom ne peut être vide."
                });
                this._dialogOpen();
            }
             else if(values.username===''||!values.username){
                this.setState({
                    errorMsg:"Veuillez fournir le nom d'utilisateur du Vendeur/Bouncer."
                });
                this._dialogOpen();
            }
            else if(values.password===''||!values.password){
                this.setState({
                    errorMsg:"Le champs mot de passe ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.passwordconf===''||!values.passwordconf){
                this.setState({
                    errorMsg:"Le champs confirmation du mot de passe ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.password!==values.passwordconf){
                this.setState({
                    errorMsg:"Les champs mot de passe et confirmation du mot de passe ne correspondent pas."
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
            else if(values.codeRedac===''||!values.codeRedac){
                this.setState({
                    errorMsg:"Le champs code redacteur ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.codeRedac.length>3||values.codeRedac.length<3){
                this.setState({
                    errorMsg:"Le champs code redacteur doit comporter 3 caractères maximum."
                });
                this._dialogOpen();
            }
            else if(values.role===''||!values.role){
                this.setState({
                    errorMsg:"Veuillez donner un rôle à cet utilisateur."
                });
                this._dialogOpen();
            }
            else if(!this.state.slider){
                this.setState({
                    errorMsg:"Veuillez attribuer un nombre de ticket suffisant au Vendeur/Bouncer."
                });
                this._dialogOpen();
            }
            else if(!this.state.eventId){
                this.setState({
                    errorMsg:"Veuillez attribuer un Event au Vendeur/Bouncer."
                });
                this._dialogOpen();
            }
            else if(!getEvents[this.state.eventIndex].nb_vendeur_restant){
                this.setState({
                    errorMsg:"Cet event ne peut plus avoir de vendeurs/bouncer."
                });
                this._dialogOpen();
            }     
            else{
               //alert(JSON.stringify(values));
               values.slider=this.state.slider;
               values.event=this.state.eventId;
                Meteor.call('createNewUser',values,(err)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Une erreur s'est produite lors de la création du Vendeur/Bouncer. "+err.reason+"."
                            });
                        this._dialogOpen();
                    }else{
                        reset();
                        this.setState({
                        snackMsg:values.role=="V"?`Le vendeur ${values.nom} ${values.prenom} a été créé`:values.role=="B"?`Le bouncer ${values.nom} ${values.prenom} a été créé`:`Le vendeur-bouncer ${values.nom} ${values.prenom} a été créé`,
                        snackOpen:true,
                        eventId:null,
                        ticketRest:0,
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
               <form onSubmit={handleSubmit(submit)}>
               <Field
                    name="nom" 
                    component={TextField}
                    hintText="Entrez le nom de famille du Vendeur/Bouncer"
                    floatingLabelText="Nom de famille"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    validate={[ required ]}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="prenom" 
                    component={TextField}
                    hintText="Entrez les prénoms du Vendeur/Bouncer"
                    floatingLabelText="Prénoms"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="username" 
                    component={TextField}
                    hintText="Entrez le pseudo du Vendeur/Bouncer"
                    floatingLabelText="Nom d'utilisateur du Vendeur/Bouncer"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="password" 
                    component={TextField}
                    hintText="Entrez le mot de passe du Vendeur/Bouncer"
                    floatingLabelText="Mot de passe du Vendeur/Bouncer"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="passwordconf" 
                    component={TextField}
                    hintText="Confirmer le mot de passe du Vendeur/Bouncer"
                    floatingLabelText="Confirmation du mot de passe du Vendeur/Bouncer"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
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
                    hintText="Entrer l'email du Vendeur/Bouncer"
                    floatingLabelText="Email du Vendeur/Bouncer"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    type="mail"
                    floatingLabelFixed={true}
                    validate={[ required,email ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                 <Field
                    name="codeRedac" 
                    component={TextField}
                    hintText={this.props.REDAC?this.props.REDAC:"Entrez le code redacteur du Vendeur/Bouncer"}
                    floatingLabelText="Code redacteur du Vendeur/Bouncer"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="event" 
                    component={SelectField}
                    floatingLabelText="Choix de l'Event"
                    hintText="Choix de l'Event"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    //validate={[required]}
                    onChange={this.handleEventChange}
                    value={this.props.event}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                >
                    {
                        getEvents?getEvents.map((e,i)=>{
                            return(<MenuItem key={i} value={i} primaryText={e.nom_event}/>);
                        }):null
                    }
                  
                </Field>
                <Field
                    name="role" 
                    component={SelectField}
                    floatingLabelText="Rôle de l'entité"
                    hintText="Profile de l'entité"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    validate={[required]}
                    value={this.props.role}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                >
                    <MenuItem value="V" primaryText="VENDEUR"/>
                    <MenuItem value="B" primaryText="BOUNCER"/>
                    <MenuItem value="VB" primaryText="VENDEUR ET BOUNCER"/>
                </Field>
                
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <p style={{flexGrow:1,textAlign:'center'}}>Nombre de tickets restants pour cet Event:<b>{this.state.ticketRest}</b> | Nombre de tickets attribués au Vendeur/Bouncer:<b>{this.state.slider}</b></p>
                        <Slider
                            min={0}
                            max={this.state.ticketRest>0?this.state.ticketRest:1}
                            step={1}
                            value={this.state.slider}
                            onChange={this.handleChangeS}
                            required
                            style={{width:'70%',margin:'auto'}}
                            
                        />
                    </div>
                
                

                
                <div className="inAppBtnDiv">
                    <RaisedButton
                        label="Créer le Vendeur/Bouncer" 
                        labelColor="white"
                        backgroundColor="gray"
                        className="inAppBtnForm"
                        type="submit"
                    />
                </div>
                
               </form>
            </div>
        );
    }
}
CreateVendorForm=reduxForm({
    form:'CreateEvent',
    fields:['nom','prenom','username','password','passwordconf','codeRedac','role']
})(CreateVendorForm);

const selector = formValueSelector('CreateEvent');

const formation2LastLetters=(prenom)=>{
        const arraystring=prenom.split(" ");
        let lastletter='';
        _.times(2,arraystring.forEach((prenoms)=>{
                lastletter+=prenoms.substring(0,1);
            })
        );
        if(lastletter.length>3){
            return lastletter.substring(0,4);
        }else{
            return lastletter;
        }  
    };

    CreateVendorForm = connect(
  state => {
    // or together as a group
    const { nom, prenom ,vendorTicketMax } = selector(state, 'nom', 'prenom','vendorTicketMax');
    const f1stletter=nom?nom.substring(0,1):'';
    const lastletters=formation2LastLetters(prenom?prenom:'');
    const REDAC=f1stletter+lastletters;
    return {
      REDAC,
      vendorTicketMax
    }
  }
)(CreateVendorForm)
const getEventsList=gql`
query getListeEvents($statut:String){
    getEvents(statut:$statut){
        _id
        nom_event
        date_event
        heure_event
        lieu_event
        ticket_max
        vendeur_max
        nb_vendeur_restant
        statut
        last_ticketNo_givenTo_Vendor
    },
    
}`;


export default graphql(getEventsList,{
options:({statut}) => ({  
    variables: {
        statut:"VALIDE",     
},pollInterval: 2000 })
})(CreateVendorForm);

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