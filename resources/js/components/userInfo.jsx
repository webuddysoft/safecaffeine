import React from 'react';
import {Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, Skeleton, IconButton, Flex } from "@chakra-ui/react";
import {FaCheck, FaEdit, FaSignOutAlt, FaTimes} from 'react-icons/fa';
import {connect} from 'react-redux';
import { ACTION, API_ROOT } from '../config';
import { showToast, getToken } from '../util';

const mapStateToProps = state => ({...state.user.info}) 
const mapDispatchToProps = dispatch => ({
    goLogin: () => dispatch({type: ACTION.DO_LOGOUT}),
    setUserInfo: (info) => dispatch({type: ACTION.SET_USER_INFO, value: info}),
    onSubmit: (caffeineLimit, callbackS) => {
        dispatch({type: ACTION.SET_IS_SUBMITTING, value: true});
        axios.post(API_ROOT + '/user', {
            caffeineLimit: caffeineLimit
        },{
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(response => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            dispatch({type: ACTION.SET_USER_INFO, value: response.data});
            callbackS(false);
        }).catch(error => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            showToast("error", "Error!", error.response.data.message);
        });
    }
})

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isEdit: false, caffeineLimit: props.caffeineLimit, isInvalid: false}
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    toggleEdit(mode) {
        this.setState({isEdit: mode, isInvalid: false});
    }
    handleChange(e) {
        this.setState({caffeineLimit: e.target.value}, function(){
            const isInvalid = !this.state.caffeineLimit || isNaN(this.state.caffeineLimit) || this.state.caffeineLimit <= 0;
            this.setState({isInvalid: isInvalid});
        });
    }
    onSubmit() {
        if (!this.state.caffeineLimit || isNaN(this.state.caffeineLimit) || this.state.caffeineLimit <= 0) {
            this.setState({isInvalid: true});
        } else {
            this.props.onSubmit(this.state.caffeineLimit, this.toggleEdit);
        }
    }
    componentDidMount() {
        axios.get(API_ROOT + '/user', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(response => {
            this.props.setUserInfo(response.data);
        }).catch(error => {
            this.props.goLogin();
        });
    }
    render() {
        const isEdit = this.state.isEdit;
        if (!this.props.inited) {
            return (
                <Box borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px" mb="5">
                    <Stack>
                        <Skeleton height="24px" />
                        <Skeleton height="16px" />
                        <Skeleton height="16px" />
                        <Skeleton height="16px" />
                    </Stack>
                </Box>
            )
        } else {
            return (
                <Box borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px" mb="5">
                    <Stack>
                        <Flex justifyContent="space-between">
                            <Heading as="h1" size="md" textAlign="left" pb="4">User Information</Heading>
                            <Button type="submit" colorScheme="orange" size="sm" leftIcon={<FaSignOutAlt />} onClick={this.props.goLogin}>
                                Logout
                            </Button>
                        </Flex>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel marginBottom="0" width="120px">Name:</FormLabel>
                            <Text>{this.props.name}&nbsp;</Text>
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel marginBottom="0" width="120px">Email:</FormLabel>
                            <Text>{this.props.email}&nbsp;</Text>
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel marginBottom="0" width="120px">Caffeine Limit:</FormLabel>
                            {!isEdit ? 
                                <Flex alignItems="center">
                                    <Text>{this.props.caffeineLimit}mg</Text>
                                    <IconButton  icon={<FaEdit />} size="sm" ml="2" onClick={() => this.toggleEdit(true)}></IconButton>
                                </Flex> : 
                                <Flex>
                                    <Input isInvalid={this.state.isInvalid} name="caffeine" width="70px" id="caffeine" size="sm" type="text" defaultValue={this.props.caffeineLimit} autoComplete="off" placeholder="Caffeine" onChange={this.handleChange} />
                                    <IconButton icon={<FaCheck />} colorScheme="teal" size="sm" ml="2" onClick={this.onSubmit}></IconButton>
                                    <IconButton icon={<FaTimes />} size="sm" ml="2" onClick={() => this.toggleEdit(false)}></IconButton>
                                </Flex>
                            }
                        </FormControl>
                    </Stack>
                </Box>
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);