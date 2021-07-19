import { createStandaloneToast } from "@chakra-ui/react";
import { AUTH_TOKEN } from "./config";

const toast = createStandaloneToast();
export const showToast = (status, title, message) => {
    toast({
        title: title,
        description: message,
        status: status,
        position: "top",
        duration: 1500,
        isClosable: true,
    });
} 

export const hasError = (errors) => {
    return Object.values(errors).indexOf(true) >= 0;
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getToken = () => localStorage.getItem(AUTH_TOKEN);
export const removeToken = () => localStorage.removeItem(AUTH_TOKEN);
export const setToken = (token) => localStorage.setItem(AUTH_TOKEN, token);

export const getUserStateFromJson = (json) => ({
    inited: true,
    name: json['name'], 
    caffeineLimit: json['caffeine_limit'],
    email: json['email']
});

export const getDrinkStateFromJson = (json) => ({
    id: json['id'], 
    name: json['name'], 
    description: json['description'],
    caffeine: json['caffeine'],
});