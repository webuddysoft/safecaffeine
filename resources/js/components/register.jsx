import React from 'react';
import {connect} from 'react-redux';
import {Box, Button, FormControl, FormLabel, Input, InputGroup, Stack, Heading, InputLeftElement, Spinner} from "@chakra-ui/react";
import {ACTION, API_ROOT} from '../config';
import {hasError, setToken, showToast, validateEmail} from '../util';
import {FaEdit, FaLock, FaRegUser, FaSave} from 'react-icons/fa';

const mapStateToProps = state => ({...state.auth}); 
const mapDispatchToProps = dispatch => ({
    goLogin: () => dispatch({type: ACTION.GO_LOGIN_PAGE}),
    onSubmit: (email, name, password) => {
        dispatch({type: ACTION.SET_IS_SUBMITTING, value: true});
        axios.post(API_ROOT + '/register', {
            email: email,
            name: name,
            password: password
        }).then(response => {
            setToken(response.data.access_token.split("|")[1]);
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            dispatch({type: ACTION.GO_DASHBOARD_PAGE});
        }).catch(error => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            const message = Object.values(error.response.data.errors).join("\r\n");
            showToast("error", error.response.data.message, message);
        });
    }
});

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null, 
            name: null, 
            password: null, 
            password2: null, 
            error: {
                email: false, 
                name: false, 
                password: false,
                password2: false
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);

    }
    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value}, function(){
            //validate
            this.setState({error: {...this.state.error, [evt.target.name]: !this.state[evt.target.name]}});
        });
    }
    submitForm() {
        this.setState({error: {
            email: !this.state.email || !validateEmail(this.state.email), 
            name: !this.state.name,
            password: !this.state.password || this.state.password != this.state.password2,
            password2: !this.state.password2 || this.state.password != this.state.password2,
        }}, function(){ 
            if (!hasError(this.state.error))
                this.props.onSubmit(this.state.email, this.state.name, this.state.password);
        });
    }
    isInvalid(k) {
        return this.state.error[k];
    }
    render() {
        return (
        <Box display="flex" pt="20" justifyContent="center">
            <Stack maxWidth="500px" borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px">
                <Heading as="h1" size="md" textAlign="center" pb="4">Register</Heading>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Email</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaRegUser />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("email")}  name="email" id="email" type="email" autoComplete="off" placeholder="Email" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Full Name</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaEdit />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("name")}  name="name" id="name" type="text" autoComplete="off" placeholder="Full Name" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Password</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaLock />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("password")}  name="password" id="password" type="password" autoComplete="off" placeholder="Password" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel marginBottom="0" width="100px">Confirm</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FaLock />} color="gray.300" />
                        <Input isInvalid={this.isInvalid("password2")}  name="password2" id="password2" type="password" autoComplete="off" placeholder="Confirm Password" onChange={this.handleChange} />
                    </InputGroup>
                </FormControl>
                <FormControl pt="2" display="flex" justifyContent="space-between" alignItems="center" flexDirection="row-reverse">
                    <Button colorScheme="teal" onClick={this.submitForm} isDisabled={this.props.isSubmitting} leftIcon={<FaSave />} size="sm">
                        Signup
                        {this.props.isSubmitting && 
                            (<Spinner size="xs" position="absolute" position="absolute" right="5px" top="5px" />)
                        }
                    </Button>
                    <Button colorScheme="blue" variant="link" size="sm" onClick={this.props.goLogin}>
                        Go to login
                    </Button>
                </FormControl>
            </Stack >
        </Box>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);