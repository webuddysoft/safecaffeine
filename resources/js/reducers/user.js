import  * as R from "ramda";
import { ACTION } from "../config"
import { getUserStateFromJson } from "../util";

const initState = {
    isSubmitting: false,
    info: {
        inited: false,
        email: null,
        name: null,
        caffeineLimit: null,
    }
}
export default function user(state = initState, action) {
    switch (action.type) {
        case ACTION.SET_USER_INFO:
            return R.assocPath(["info"], getUserStateFromJson(action.value), state);
        case ACTION.DO_LOGOUT:
            return initState;
        default:
            return state;
    }
}