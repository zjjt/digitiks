import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Divider from 'material-ui/Divider';
import SalesStats from '../components/SalesStats';
//import ModVendor from '../components/ModVendor';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import CreateSaleForm from '../components/CreateSaleForm.jsx';


export default class Sellboard extends Component {
    constructor(){
        super();
        this.state={
            slideIndex: 0,
            slideTitle:[`${Meteor.user().username},effectuez une vente`,`${Meteor.user().username},Voir mes statistiques`]
        };

    }
    handleSlideChange = (value) => {
        this.setState({
          slideIndex: value,
        });
      };
    componentDidMount(){
        $('.toolbarTitle').delay(18000).show().addClass("fadeInRight animated");
    }
    render(){
        return(
            <div className="centeredContentSingle">
                <Tabs
                    onChange={this.handleSlideChange}
                    value={this.state.slideIndex}
                    tabTemplateStyle={style.tabTemplate}
                    inkBarStyle={style.inkBarStyle}
                >
                    <Tab label="Réaliser une vente" value={0} buttonStyle={style.tabTemplate}/>
                    <Tab label="Mes statistiques" value={1} buttonStyle={style.tabTemplate} />
                </Tabs>
                <div className="contentWrapper fadeInUp animated">
                <Toolbar style={style.toolbar}>
                        <ToolbarGroup>
                           <ActionExitToApp style={style.homeicon} 
                            color="#212f68" 
                            hoverColor="#cd9a2e" 
                            title="Déconnectez vous"
                            className="icono"
                            title="Aller au menu"
                            onClick={()=>{
                                Meteor.logout((err,res)=>{
                                    FlowRouter.go('home');
                                        alert("Vous êtes déconnecté");
                                })
                            }}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.slideTitle[this.state.slideIndex]} className="toolbarTitle"/>
                        </ToolbarGroup>
                </Toolbar>
                    <Divider/>
                    <SwipeableViews
                        index={this.state.slideIndex}
                        onChangeIndex={this.handleSlideChange}
                    >
                        <div>
                            <CreateSaleForm/>
                        </div>
                        <div>
                            <SalesStats/>
                        </div>
                    </SwipeableViews>
                </div>
               
            </div>
        );
    }
}


const style={
    homeicon:{
        width: 40,
        height: 40
    },
    toolbar:{
        backgroundColor:'white',
    },
    tabTemplate:{
        backgroundColor:'#202e67'
    },
    inkBarStyle:{
        backgroundColor:'#cd9a2e'
    }
};