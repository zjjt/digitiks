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
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import _ from 'lodash';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

 class CreateEventForm extends Component{
    constructor(props){
        super(props);
        this.state={
            dialogIsOpen:false,
            errorMsg:'',
            snackOpen:false,
            snackMsg:'',
            
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

    render(){
        const {handleSubmit,pristine,submitting,dispatch,REDAC,reset}=this.props;
        //console.log(REDAC);
        const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];
       
         const submit=(values,dispatch)=>{
            if(values.nomEvent===''||!values.nomEvent){
                this.setState({
                    errorMsg:"Le champs Titre de l'event ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.lieu===''||!values.lieu){
                this.setState({
                    errorMsg:"Le champs lieu de l'event ne peut être vide."
                });
                this._dialogOpen();
            }
             else if(values.dateEvent===''||!values.dateEvent){
                this.setState({
                    errorMsg:"Le champs date de l'Event ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(values.heureEvent===''||!values.heureEvent){
                this.setState({
                    errorMsg:"Veuillez fournir l'heure de l'Event."
                });
                this._dialogOpen();
            }
            else if(values.ticketno===''||!values.ticketno||isNaN(values.ticketno)){
                this.setState({
                    errorMsg:"Veuillez fournir le nombre maximum de tickets virtuels disponibles pour cet Event."
                });
                this._dialogOpen();
            }
            else if(values.ticketPrice===''||!values.ticketPrice||isNaN(values.ticketPrice)){
                this.setState({
                    errorMsg:"Veuillez fournir le prix unitaire des tickets virtuels pour cet Event."
                });
                this._dialogOpen();
            }
            else if(values.vendeurno===''||!values.vendeurno||isNaN(values.vendeurno)){
                this.setState({
                    errorMsg:"Veuillez fournir le nombre maximum de vendeurs à dispatcher pour cet event."
                });
                this._dialogOpen();
            }
            
            else{
               //alert(JSON.stringify(values));
                Meteor.call('createNewEvent',values,(err)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Une erreur s'est produite lors de la création de l'Event. "+err.reason+"."
                            });
                        this._dialogOpen();
                    }else{
                        reset();
                        this.setState({
                        snackMsg:`L'Event ${values.nomEvent} a été créé`,
                        snackOpen:true
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
        const required = value => value ? undefined : 'Required';
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
                    name="nomEvent" 
                    component={TextField}
                    hintText="Entrez le titre de l'Event"
                    floatingLabelText="Titre de l'Event"
                    required
                    fullWidth={true}
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="lieu" 
                    component={TextField}
                    hintText="Entrez le lieu où se tiendra l'Event"
                    required
                    floatingLabelText="Lieu de l'Event"
                    fullWidth={true}
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="dateEvent" 
                    DateTimeFormat={DateTimeFormat}
                    className="datepicker"
                    component={DatePicker}
                    hintText="Entrez la date de l'Event"
                    floatingLabelText="Date de l'Event"
                    required
                    dialogContainerStyle={styles.dialogContainerStyle}
                    fullWidth={true}
                    okLabel="OK"
                    cancelLabel="Annuler"
                    locale="fr"
                    format={(value,name)=>{
                        console.log('value being passed ',value);
                        console.log('is of type',typeof value);
                        return value===''?null:value;
                    }}
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="heureEvent" 
                    component={TimePicker}
                    hintText="Heure de début de l'Event"
                    floatingLabelText="Heure de l'Event"
                    format={null}
                    required
                    props={{format: "24hr"}}
                    fullWidth={true}
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="ticketno" 
                    component={TextField}
                    hintText="Entrez le nombre de tickets virtuels disponibles pour cet Event"
                    floatingLabelText="Nombre de tickets virtuels à vendre"
                    fullWidth={true}
                    required
                    max={1000000}
                    type="number"
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="ticketPrice" 
                    component={TextField}
                    hintText="Entrez le prix unitaire des tickets virtuels pour cet Event"
                    floatingLabelText="Prix unitaire des tickets virtuels à vendre"
                    fullWidth={true}
                    required
                    type="number"
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                <Field
                    name="vendeurno" 
                    component={TextField}
                    hintText="Entrez le nombre de vendeurs affectés pour cet Event"
                    floatingLabelText="Nombre de vendeurs à affecter à l'Event"
                    required
                    max={10000}
                    fullWidth={true}
                    type="number"
                    floatingLabelFixed={true}
                    floatingLabelFocusStyle={styles.floatingLabelStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                />
                
                <div className="inAppBtnDiv">
                    <RaisedButton
                        label="Créer l'Event" 
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
CreateEventForm=reduxForm({
    form:'CreateEvent',
})(CreateEventForm);

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

CreateEventForm = connect(
  state => {
    // or together as a group
    const { nom, prenom } = selector(state, 'nom', 'prenom')
    const f1stletter=nom?nom.substring(0,1):'';
    const lastletters=formation2LastLetters(prenom?prenom:'');
    const REDAC=f1stletter+lastletters;
    return {
      REDAC
    }
  }
)(CreateEventForm)

export default CreateEventForm;
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
    dialogContainerStyle:{
        
    }
}