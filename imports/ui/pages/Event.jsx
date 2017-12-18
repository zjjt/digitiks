import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import ModEvent from '../components/ModEvent';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import CreateEventForm from '../components/CreateEventForm.jsx';


export default class Event extends Component {
    constructor(){
        super();
        this.state={
            slideIndex: 0,
            slideTitle:["Création d'un Event","Modification d'un Event"]
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
                    <Tab label="Créer un Event" value={0} buttonStyle={style.tabTemplate}/>
                    <Tab label="Modifier les Events" value={1} buttonStyle={style.tabTemplate} />
                </Tabs>
                <div className="contentWrapper fadeInUp animated">
                <Toolbar style={style.toolbar}>
                        <ToolbarGroup>
                           <Home style={style.homeicon} 
                            color="#212f68" 
                            hoverColor="#cd9a2e" 
                            className="icono"
                            title="Aller au menu"
                            onClick={()=>FlowRouter.go('adminDashboard')}
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
                            <CreateEventForm form="createEvent"/>
                        </div>
                        <div>
                            <ModEvent form="getInfoClientform"/>
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