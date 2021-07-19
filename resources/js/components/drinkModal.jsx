import React from 'react';
import {Box, Button, Modal, Divider, Flex, Heading, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, FormControl, InputGroup, Input, InputRightAddon, Textarea, Spinner, FormHelperText} from '@chakra-ui/react'
import {FaEdit, FaSave, FaTrash} from 'react-icons/fa';

export default class DrinkModal extends React.Component{
    constructor(props) {
        super(props);
        this.isInvalid = this.isInvalid.bind(this);
    }
    isInvalid(k) {
        let hasError = false;
        if (this.props.drinkForm[k] !== null) {
            switch(k) {
                case "name":
                    hasError = !this.props.drinkForm[k];
                    break;
                case "caffeine":
                    hasError = !this.props.drinkForm[k] || isNaN(this.props.drinkForm[k]) || this.props.drinkForm[k] < 0;
                    break;
                default: 
                    hasError = false;
            }
        }
        return hasError;
    }
    render() {
        if (!this.props.drinkForm)
            return null;
        const isEdit = this.props.isEdit;
        const drink = this.props.drinkForm;
        return (
            <Modal isOpen={this.props.isOpenModal} onClose={this.props.closeModal} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent
                    w={"90%"}
                    maxW={"500px"}
                    pb={6}
                    pt={10}
                    px={6}
                    borderRadius={4}
                >
                    <ModalHeader
                        alignSelf={"center"}
                        fontFamily={"heading"}
                        fontSize={"2xl"}
                        width={"100%"}
                        p="0"
                    >
                        <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
                            <span>{isEdit ? `${drink.id ? "Edit" : "Add"} Drink` : "View Drink"}</span>
                        </Flex>
                        <Divider mt={3} mb={3} />
                    </ModalHeader>
                    <ModalBody maxH={"60vh"} overflowY={"auto"} px={5}>
                        <Stack spacing={4}>
                            <Box>
                                <Heading as="h3" size="sm" mb="5px" pb="5px">Name</Heading>
                                {!isEdit ? 
                                    <Text>{drink.name}</Text> :
                                    <FormControl display="flex" alignItems="center">
                                        <InputGroup>
                                            <Input isInvalid={this.isInvalid("name")} name="name" id="name" type="text" defaultValue={drink.name} autoComplete="off" placeholder="Name" onChange={this.props.handleChange} />
                                        </InputGroup>
                                    </FormControl>
                                }
                            </Box>
                            <Box>
                                <Heading as="h3" size="sm" pb="5px" mb="5px">Caffeine</Heading>
                                {!isEdit ? 
                                    <Text>{drink.caffeine}mg / serving</Text> : 
                                    <FormControl alignItems="center">
                                        <InputGroup>
                                            <Input isInvalid={this.isInvalid("caffeine")} name="caffeine" id="caffeine" type="text" defaultValue={drink.caffeine} autoComplete="off" placeholder="Caffeine" onChange={this.props.handleChange} />
                                            <InputRightAddon children="mg / serving" />
                                        </InputGroup>
                                        <FormHelperText fontSize="xs">This change does not affect the consumed data.</FormHelperText>
                                    </FormControl>
                                }
                            </Box>
                            <Box>
                                <Heading as="h3" size="sm" pb="5px" mb="5px">Description</Heading>
                                {!isEdit ? 
                                    <Text>{drink.description}</Text>:
                                    <FormControl display="flex" alignItems="center">
                                        <InputGroup>
                                            <Textarea name="description" id="description" type="text" defaultValue={drink.description} autoComplete="off" placeholder="Description" onChange={this.props.handleChange} />
                                        </InputGroup>
                                    </FormControl>
                                }
                            </Box>
                        </Stack>
                    </ModalBody>
                    <Divider mt={3} mb={3} />
                    <ModalFooter p="0">
                        {!isEdit ?
                            <>
                                <Button onClick={this.props.onDelete} colorScheme="red" size="sm" variant="solid" leftIcon={<FaTrash />} mr="2" isDisabled={this.props.isSubmitting}>
                                    Delete
                                    {this.props.isSubmitting && 
                                        (<Spinner size="xs" position="absolute" position="absolute" right="5px" top="5px" />)
                                    }
                                </Button>
                                <Button onClick={() => this.props.toggleForm(true)} colorScheme="blue" variant="outline" size="sm" leftIcon={<FaEdit />} mr="2">
                                    Edit
                                </Button>
                                <Button onClick={this.props.closeModal} colorScheme="gray" size="sm" variant="solid">
                                    Close
                                </Button>
                            </>:
                            <>
                                <Button onClick={this.props.onSubmit} colorScheme="teal" size="sm" variant="solid" leftIcon={<FaSave />} mr="2" isDisabled={this.props.isSubmitting}>
                                    Save
                                    {this.props.isSubmitting && 
                                        (<Spinner size="xs" position="absolute" position="absolute" right="5px" top="5px" />)
                                    }
                                </Button>
                                <Button onClick={() => this.props.toggleForm(false)} colorScheme="gray" size="sm" variant="solid">
                                    Cancel
                                </Button>
                            </>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }
}
