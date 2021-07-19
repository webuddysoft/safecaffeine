import React from 'react';
import {Box, Skeleton, Text, Table, Tbody, Th, Thead, Tr, Td, Stack, Heading, Button } from "@chakra-ui/react";
import {connect} from 'react-redux';
import { ACTION, API_ROOT } from '../config';
import { showToast, getToken } from '../util';
import { FaPlus } from 'react-icons/fa';
import * as R from 'ramda';
import DrinkModal from './drinkModal'

const mapStateToProps = state => ({...state.drinks}) 
const mapDispatchToProps = dispatch => ({
    goLogin: () => dispatch({type: ACTION.DO_LOGOUT}),
    setDrinksInfo: (info) => dispatch({type: ACTION.SET_DRINKS, value: info}),
    onSubmit: (data, callbackS) => {
        dispatch({type: ACTION.SET_IS_SUBMITTING, value: true});
        axios.post(API_ROOT + '/drink', {...data}, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(response => {
            showToast("success", "Success!", "Successfully saved.");
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            dispatch({type: ACTION.SET_DRINKS, value: response.data.list});
            callbackS(response.data.id);
        }).catch(error => {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
            showToast("error", "Error!", error.response.data.message);
        });
    },
    onDelete: (id, callbackS) => {
        if (confirm("Are you sure that you want to delete the drink?")) {
            dispatch({type: ACTION.SET_IS_SUBMITTING, value: true});
            axios.delete(API_ROOT + '/drink/' + id, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }).then(response => {
                showToast("success", "Success!", "Successfully deleted.");
                dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
                dispatch({type: ACTION.SET_DRINKS, value: response.data.list});
                callbackS();
            }).catch(error => {
                dispatch({type: ACTION.SET_IS_SUBMITTING, value: false});
                showToast("error", "Error!", error.response.data.message);
            });
        }
    }
})

class DrinkInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isOpenModal: false, isEdit: false, drinkForm: null}
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.handleDrinkFormChange  = this.handleDrinkFormChange.bind(this);
        this.getDrinkInfo = this.getDrinkInfo.bind(this);
        this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
    }
    showModal(id = null) {
        this.setState({isOpenModal: true, isEdit: !id, drinkForm: this.getDrinkInfo(id)});
    }
    hideModal() {
        this.setState({isOpenModal: false, isEdit: false, drinkForm: null});
    }
    toggleForm(mode) {
        if (!mode && !this.state.drinkForm.id) {
            this.hideModal();
        } else {
            this.setState({isEdit: mode, drinkForm: this.getDrinkInfo(this.state.drinkForm.id)})
        }
    }
    getDrinkInfo(id) {
        if (id == null) {
            return {id: null, name: null, description: null, caffeine: null};
        } else {
            return R.find(R.propEq('id', id))(this.props.drinks);
        }
    }
    handleDrinkFormChange(e) {
        this.setState({drinkForm: {...this.state.drinkForm, [e.target.name]: e.target.value}});
    }
    onSubmit() {
        //Check Validate
        const hasError = !this.state.drinkForm.name || !this.state.drinkForm.caffeine || isNaN(this.state.drinkForm.caffeine) || this.state.drinkForm.caffeine <= 0;
        if (!hasError) {
            this.props.onSubmit(this.state.drinkForm, this.onSubmitSuccess);
        }
    }
    onSubmitSuccess(id) {
        this.setState({isEdit: false, drinkForm: this.getDrinkInfo(id)})
    }
    onDelete() {
        if (this.state.drinkForm) {
            this.props.onDelete(this.state.drinkForm.id, this.hideModal);
        }
    }
    componentDidMount() {
        axios.get(API_ROOT + '/drinks', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(response => {
            this.props.setDrinksInfo(response.data);
        }).catch(error => {
            this.props.goLogin();
        });
    }
    render() {
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
                <>
                    <Box borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px" mb="5">
                        <Stack>
                            <Box display="flex" justifyContent="space-between">
                                <Heading as="h1" size="md" textAlign="left" pb="4">Favorite Caffeinated Drinks (<small>Total {this.props.drinks.length}</small>)</Heading>
                                <Button leftIcon={<FaPlus />} colorScheme="teal" size="sm" onClick={() => this.showModal()}>Add</Button>
                            </Box>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>No</Th>
                                        <Th>Name</Th>
                                        <Th>Caffeine<br /><Text fontSize="xs">(mg/serving)</Text></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {this.props.drinks.map((item, idx) => (
                                        <Tr key={item.id} cursor="pointer"
                                            _hover={{backgroundColor: "blue.100"}}
                                            backgroundColor={this.state.selectedDrink && this.state.selectedDrink.id == item.id ? "blue.200" : "transparent"}
                                            onClick={() => this.showModal(item.id)}
                                        >
                                            <Td>{idx + 1}</Td>
                                            <Td>{item.name}</Td>
                                            <Td>{item.caffeine}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Stack>
                    </Box>
                    <DrinkModal 
                        {...this.state} 
                        isSubmitting={this.props.isSubmitting}
                        closeModal={this.hideModal} 
                        toggleForm={this.toggleForm} 
                        handleChange={this.handleDrinkFormChange}
                        onSubmit={this.onSubmit} 
                        onDelete={this.onDelete}
                    />
                </>
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrinkInfo);