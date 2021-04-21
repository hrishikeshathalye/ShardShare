import {dashboardSteps} from "../Dashboard/steps"
import {createSecretSteps} from "../create_secret/steps"
import {sharedByUserSteps} from "../SharedByUser/steps"
import {sharedWithUserSteps} from "../SharedWithUser/steps"
import {recoveryRequestSteps} from "../RecoveryRequests/steps"

let getSteps = () => {
    let loc = window.location.pathname;
    switch(loc){
        case "/dashboard":
        case "/":
            return dashboardSteps;
        case "/create_secret":
            return createSecretSteps;
        case "/sharedbyyou":
            return sharedByUserSteps;
        case "/sharedwithyou":
            return sharedWithUserSteps;
        case "/recoveryrequests":
            return recoveryRequestSteps;
        default :
            return [];
    }
}

export default getSteps;