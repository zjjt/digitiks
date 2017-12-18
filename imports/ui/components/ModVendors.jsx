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
import ListeVendors from '../components/ListeVendors.jsx';
import {moment} from 'meteor/momentjs:moment';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';



let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ModVendors extends Component {
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
                            name="nomtotal" 
                            component={TextField}
                            hintText="Entrez le nom du vendeur/bouncer"
                            floatingLabelText="Nom du vendeur/bouncer"
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
                    <ListeVendors 
                        nomtotal={this.state.searchTerms?this.state.searchTerms:""}
                    />
                    
                </div>
        );
    }
}



ModVendors=reduxForm({
    form:'getModVendorsform',
})(ModVendors);

const selector = formValueSelector('getModVendorsform');
ModVendors=connect(
    (state,dispatch) => {
    // or together as a group
    //alert(JSON.stringify(state));
    //const {nomtotal } = selector(state, 'nomtotal');
   
    return {
     // nomtotal:typeof nomtotal,
      dispatch
    }
  }
)(ModVendors);


export default ModVendors;

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