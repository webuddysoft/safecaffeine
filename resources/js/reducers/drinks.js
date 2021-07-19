import  * as R from "ramda";
import { ACTION } from "../config"
import { getDrinkStateFromJson } from "../util";

const initState = {
    isSubmitting: false,
    inited: false,
    isOpenModal: false,
    selectedDrink: null,
    drinks: []
}
export default function drinks(state = initState, action) {
    switch (action.type) {
        case ACTION.SET_IS_SUBMITTING:
            return R.assocPath(["isSubmitting"], action.value, state);
        case ACTION.SET_DRINKS:
            var arr = [];
            action.value.map((item) => arr.push(getDrinkStateFromJson(item)));
            return R.assocPath(["inited"], true, R.assocPath(["drinks"], arr, state));
        case ACTION.VIEW_DRINK_DETAIL:
            return R.assocPath(["isOpenModal"], true, R.assocPath(["selectedDrink"], action.value, state));
        case ACTION.CLOSE_DRINK_DETAIL:
            return R.assocPath(["isOpenModal"], false, R.assocPath(["selectedDrink"], null, state));
        default:
            return state;
    }
}