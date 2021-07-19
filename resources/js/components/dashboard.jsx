import React from 'react';
import {Box, Container} from "@chakra-ui/react";
import {connect} from 'react-redux';
import UserInfo from './userInfo';
import ConsumeInfo from './consumeInfo';
import DrinkInfo from './drinkInfo';

const mapStateToProps = state => ({...state}) 
const mapDispatchToProps = dispatch => ({})

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <Container p={5} display="flex" maxW="container.xl" justifyContent="space-between" flexWrap="wrap">
            <Box width={{base: "100%", md: "40%", lg: "40%"}}>
                <UserInfo />
                <ConsumeInfo />
            </Box>
            <Box width={{base: "100%", md: "55%", lg: "57%"}}><DrinkInfo /></Box>
        </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);