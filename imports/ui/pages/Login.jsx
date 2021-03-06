import React,{PropTypes,Component} from 'react';
import AppBar from 'material-ui/AppBar';
import LoginForm from '../components/LoginForm.jsx';

export default class Login extends Component{
    constructor(){
        super();
    }
    
    render(){
        return(
           <div className="centeredContent">
                <div className="loginDiv zoomIn animated">
                    <AppBar
                        title="Identification du vendeur"
                        style={{backgroundColor: '#202e67'}}
                        iconClassNameLeft="none"
                        titleStyle={{
                            textAlign:'center'
                        }}
                    />
                    <LoginForm/>
                </div>
           </div>
        )
    }
}