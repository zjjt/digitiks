import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField,DatePicker,SelectField} from 'redux-form-material-ui';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import ListeEvent from '../components/ListeEvent.jsx';
import {moment} from 'meteor/momentjs:moment';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';



let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ModEvent extends Component {
    constructor(){
        super();
        this.state={
            orderbyNumReg:false,
            suppr:false,
            withRedactor:false,
            searchTerms:""

        }

    }

    componentDidMount(){
        $('.toolbarTitle').delay(18000).show().addClass("fadeInRight animated");
    }

    _orderTable(){
            this.setState({
                orderDesc:!orderDesc
            });
     }

    render(){
        //console.dir(this.props);
        return(
                <div>
                    <form name="getInfoClientform">
                        <div className="topaligned">
                        <Field
                            name="nomEvent" 
                            component={TextField}
                            hintText="Entrez le titre de l'Event"
                            floatingLabelText="Titre de l'Event"
                            fullWidth={true}
                            onChange={(e)=>{
                                this.setState({searchTerms:e.target.value});
                                console.log(this.state.searchTerms)
                            }}
                            floatingLabelFixed={true}
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                        />  
                               
                        </div>
                    </form>
                    <Divider/>
                    <ListeEvent 
                        nomEvent={this.state.searchTerms?this.state.searchTerms:""}
                    />
                    
                </div>
        );
    }
}



ModEvent=reduxForm({
    form:'getModeventform',
})(ModEvent);

const selector = formValueSelector('getModeventform');
ModEvent=connect(
    (state,dispatch) => {
    // or together as a group
    //alert(JSON.stringify(state));
    //const {nomEvent } = selector(state, 'nomEvent');
   
    return {
     // nomEvent:typeof nomEvent,
      dispatch
    }
  }
)(ModEvent);


export default ModEvent;

const styles={
    floatingLabelStyle:{
        color:'gray'
    },
    underlineStyle:{
        borderColor:'gray'
    },
    underlineFocusStyle:{
        color:'gray'
    },
    dialogContainerStyle:{
        
    }
}