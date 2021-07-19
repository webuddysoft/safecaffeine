import React from 'react';
import {Box, FormControl, FormLabel, Input, InputGroup, Stack, Heading, Text, Skeleton, InputRightAddon, Flex, Select, Divider } from "@chakra-ui/react";
import {connect} from 'react-redux';
import * as R from 'ramda';

const mapStateToProps = state => ({...state.drinks, caffeineLimit: state.user.info.caffeineLimit}) 
const mapDispatchToProps = dispatch => ({})
const safeStatus = {
    SAFE: "safe",
    WARNING: "warning",
    DANGER: "danger"
}
class ConsumeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {favoriteDrinkId: null, consumedAmount: '', status: null, moreAmount: null, moreServing: null}
        this.changeDrink = this.changeDrink.bind(this);
        this.changeConsumedAmount = this.changeConsumedAmount.bind(this);
        this.calcStatus = this.calcStatus.bind(this);
    }
    changeDrink(e) {
        this.setState({favoriteDrinkId: e.target.value, consumedAmount: ''}, function(){
            document.getElementById('consumed_amount').focus();
            document.getElementById('consumed_amount').select();
            this.calcStatus();
        });
    }
    changeConsumedAmount(e) {
        this.setState({consumedAmount: e.target.value}, function(){
            this.calcStatus();
        });
    }
    calcStatus() {
        const {favoriteDrinkId, consumedAmount} = this.state;
        var status, moreAmount, moreServing;
        if (!favoriteDrinkId || !consumedAmount || isNaN(consumedAmount) || consumedAmount < 0) {
            status = null;
            moreAmount = null;
            moreServing = null;
        } else {
            const drink = R.find(R.propEq('id', parseInt(favoriteDrinkId)))(this.props.drinks);
            const tConsumed = consumedAmount * drink.caffeine;
            const remained = this.props.caffeineLimit - tConsumed;
            if (remained <= 0) {
                status = safeStatus.DANGER;
                moreAmount = Math.abs(remained);
                moreServing = 0;
            } else if (remained <= drink.caffeine) {
                status = safeStatus.WARNING;
                moreAmount = remained;
                moreServing = Math.round(moreAmount / drink.caffeine * 10) / 10;
            } else {
                status = safeStatus.SAFE;
                moreAmount = remained;
                moreServing = Math.round(moreAmount / drink.caffeine);
            }
        }
        this.setState({status: status, moreAmount: moreAmount, moreServing: moreServing});
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
                        <Skeleton height="16px" />
                        <Skeleton height="16px" />
                    </Stack>
                </Box>
            )
        } else {
            const {status, moreAmount, moreServing} = this.state;
            return (
                <Box borderWidth="1px" borderStyle="solid" borderColor="gray.300" p="5" borderRadius="5px" mb="5" >
                    <Stack>
                        <Flex justifyContent="space-between">
                            <Heading as="h1" size="md" textAlign="left" pb="4">How many I have consumed...</Heading>
                            
                        </Flex>
                        <FormControl>
                            <FormLabel marginBottom="0">My Favorite Drink:</FormLabel>
                            <Select placeholder="Selet a drink" onChange={this.changeDrink}>
                                {this.props.drinks.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}                            
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel marginBottom="0">I have consumed:</FormLabel>
                            <InputGroup maxW="250px">
                                <Input name="amount" id="consumed_amount" type="text" autoComplete="off" value={this.state.consumedAmount} placeholder="Amount" onChange={this.changeConsumedAmount} />
                                <InputRightAddon>serving</InputRightAddon>
                            </InputGroup>
                        </FormControl>
                        <Divider pt="2" />
                        <FormControl display="flex">
                            <FormLabel css={{marginBottom: 0}}>You have drinked:</FormLabel>
                            {status == null && <Text>-</Text>}
                            {status == safeStatus.SAFE && <Text>{this.props.caffeineLimit - moreAmount}mg caffeine.</Text>}
                            {status == safeStatus.WARNING && <Text>{this.props.caffeineLimit - moreAmount}mg caffeine.</Text>}
                            {status == safeStatus.DANGER && <Text>{this.props.caffeineLimit + moreAmount}mg caffeine.</Text>}
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel css={{marginBottom: 0}}>Status:</FormLabel>
                            {status == null && <Text>-</Text>}
                            {status == safeStatus.SAFE && (
                                <>
                                <Text mr="2" px="1" backgroundColor="green.500" borderRadius="5" textColor="white" fontSize="xs">Safe</Text>
                                </>
                            )}
                            {status == safeStatus.WARNING && (
                                <>
                                <Text mr="2" px="1" backgroundColor="orange.500" borderRadius="5" textColor="white" fontSize="xs">Warning</Text>
                                </>
                            )}
                            {status == safeStatus.DANGER && (
                                <>
                                <Text mr="2" px="1" backgroundColor="red.500" borderRadius="5" textColor="white" fontSize="xs">Danger</Text>
                                <Text fontSize="sm">(Exceeded {moreAmount}mg.)</Text>
                                </>
                            )}
                        </FormControl>
                        <FormControl display="flex">
                            <FormLabel>You can have more:</FormLabel>
                            {status == null && <Text>-</Text>}
                            {status == safeStatus.SAFE && <Text>{moreServing} serving(s)</Text>}
                            {status == safeStatus.WARNING && <Text>{moreServing} serving(s)</Text>}
                            {status == safeStatus.DANGER && <Text>No serving</Text>}
                        </FormControl>
                    </Stack>
                </Box>
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ConsumeInfo);