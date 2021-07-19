import { Spinner } from "@chakra-ui/react";
import React from "react";
import {connect} from "react-redux";
import { ACTION, STATUS } from "../config";
import { getToken } from "../util";
import Dashboard from "./dashboard";
import LoginForm from "./login";
import RegisterForm from "./register";

const mapStateToProps = state => ({...state.auth}) 
const mapDispatchToProps = dispatch => ({
    goLogin: () => dispatch({type: ACTION.GO_LOGIN_PAGE}),
    goDashboard: () => dispatch({type: ACTION.GO_DASHBOARD_PAGE})
})

class App extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        axios.get('/sanctum/csrf-cookie')
            .then(response => {
                const token = getToken();
                if (!token) {
                    this.props.goLogin();
                } else {
                    this.props.goDashboard();
                }                
            });
    }
    render() {
        return (
            <>
                {this.props.status == STATUS.IN_LOGIN && (<LoginForm />)}
                {this.props.status == STATUS.IN_DASHBOARD && (<Dashboard />)}
                {this.props.status == STATUS.IN_REGISTER && (<RegisterForm />)}
                {this.props.status == STATUS.LOADING && (
                    <Spinner size="xl" position="absolute" left="50%" top="40%" marginLeft="-20px" />
                )}
            </>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);