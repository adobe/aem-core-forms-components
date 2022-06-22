import FormContainer from "./view/FormContainer";
import readData, {registerMutationObserver} from "./utils";
import DatePicker from "./view/DatePicker";

window.af = {
    formsRuntime: {
        model: {
            form: {}
        },
        view: {
            formContainer: {},
            utils: {}
        },
        event: {}
    }
}
export {DatePicker, FormContainer, readData, registerMutationObserver};