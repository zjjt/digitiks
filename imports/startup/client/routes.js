import {FlowRouter} from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';
import {mount} from 'react-mounter';
import React from 'react';
import store from '../../redux/store.js'
import MainLayout from '../../ui/layouts/MainLayout.jsx';
import Login from '../../ui/pages/Login.jsx';
import AdminLogin from '../../ui/pages/AdminLogin.jsx';
import AdminDashboard from '../../ui/pages/AdminDashboard.jsx';
import SellBoard from '../../ui/pages/SellBoard.jsx';
import Event from '../../ui/pages/Event.jsx';
import Vendors from '../../ui/pages/Vendors.jsx';
import {Events} from '../../api/collections.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {Session} from 'meteor/session';

injectTapEventPlugin();
FlowRouter.route('/',{
	name:'home',
	triggersEnter:[(context,redirect)=>{
		if(Meteor.user()){
			redirect('/sellboard');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><Login/>})
	}
});

FlowRouter.route('/sellboard',{
	name:'sellboard',
	triggersEnter:[(context,redirect)=>{
		if(!Meteor.user()){
			redirect('/');
		}
	}],
	action(){
		
		mount(MainLayout,
			{content:()=><SellBoard/>})
	}
});

FlowRouter.route('/admin',{
	name:'admin',
	action(){
		mount(MainLayout,
			{content:()=><AdminLogin/>})
	}
});

FlowRouter.route('/admin/dashboard',{
	name:'adminDashboard',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><AdminDashboard/>})
	}
});

FlowRouter.route('/admin/dashboard/events',{
	name:'Event',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><Event/>})
	}
});

FlowRouter.route('/admin/dashboard/vendors',{
	name:'Vendors',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		let res=Events.find().count();
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}else if(!res){
			alert("Veuillez créer des Events avant de procéder à la création des 'vendeurs/bouncers'");
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><Vendors/>})
	}
});
