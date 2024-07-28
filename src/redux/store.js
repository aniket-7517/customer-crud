import { configureStore } from "@reduxjs/toolkit";
import customerReducer from './reducer';

const store= configureStore({
    reducer : {
        customers : customerReducer
    }
})

export default store;