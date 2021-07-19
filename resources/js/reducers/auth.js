import  * as R from "ramda";
import { ACTION, API_ROOT, STATUS } from "../config"
import { removeToken } from "../util";

const initState = {
    status: STATUS.LOADING,
    isSubmitting: false
}
export default function auth(state = initState, action) {
    switch (action.type) {
        case ACTION.GO_LOGIN_PAGE:
            return R.assocPath(["status"], STATUS.IN_LOGIN, state);
        case ACTION.GO_REGISTER_PAGE:
            return R.assocPath(["status"], STATUS.IN_REGISTER, state);
        case ACTION.GO_DASHBOARD_PAGE:
            return R.assocPath(["status"], STATUS.IN_DASHBOARD, state);
        case ACTION.DO_LOGOUT:
            removeToken();
            return {status: STATUS.IN_LOGIN, userID: null, userName: null};
        case ACTION.SET_IS_SUBMITTING:
            return R.assocPath(["isSubmitting"], action.value, state);
        default:
            return state;
    }
}