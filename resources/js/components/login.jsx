import React from 'react';
import {Box, Button, FormControl, FormLabel, Input, InputGroup, Stack, Heading, InputLeftElement, Spinner, Link } from "@chakra-ui/react";
import {FaLock, FaRegUser, FaSave} from 'react-icons/fa';
import {connect} from 'react-redux';
import { ACTION, API_ROOT } from '../config';
import { showToast, hasError, validateEmail, setToken } from '../util';

const mapStateToProps = state => ({...state.auth});
const mapDispatchToProps = dispatch => ({
    goSignup: () => dispatch({type: ACTION.GO_REGISTER_PAGE}),
    onSubmit: (email, password) => {
        dispatch({type: ACTION.SET_IS_SUBMITTING, value: true});
        axios.post(API_ROOT + '/login', {
            email: email,
            password: password
        }).then(response => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            setToken(response.data.access_token.split("|")[1]);
            dispatch({type: ACTION.GO_DASHBOARD_PAGE});
        }).catch(error => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            showToast("error", "Login Error!", error.response.data.message);
        });
    }
});

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: null, password: null, error: {email: false, password: false}};
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
    }
    isInvalid(k) {
        return this.state.error[k];
    }
    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value}, function(){
            //validation
            this.setState({error: {...this.state.error, [evt.target.name]: !this.state[evt.target.name]}});
        });
    }
    submitForm() {
        this.setState({error: {email: !this.state.email || !validateEmail(this.state.email), password: !this.state.password}}, function(){
            if (!hasError(this.state.error))
                this.props.onSubmit(this.state.email, this.state.password);
        });
    }
    render() {
        return (
        <Box display="flex" pt="20" justifyContent="center">
            <Stack maxWidth="500px" borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px">
                <Heading as="h1" size="md" textAlign="center" pb="4">Login</Heading>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Email</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaRegUser />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("email")} name="email" id="email" type="text" autoComplete="off" placeholder="Email" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Password</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaLock />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("password")} name="password" id="password" type="password" autoComplete="off" placeholder="Password" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl pt="2" display="flex" justifyContent="space-between" alignItems="center" flexDirection="row-reverse">
                    <Button type="submit" colorScheme="teal" size="sm" onClick={this.submitForm} leftIcon={<FaSave />} isDisabled={this.props.isSubmitting}>
                        Login
                        {this.props.isSubmitting && 
                            (<Spinner size="xs" position="absolute" position="absolute" right="5px" top="5px" />)
                        }
                    </Button>
                    <Button colorScheme="blue" variant="link" size="sm" onClick={this.props.goSignup}>
                        Create an account
                    </Button>
                </FormControl>
            </Stack >
        </Box>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);