import {
    CATEGORIES,
    POPULAR_SEARCH_ERROR,
    POPULAR_SEARCH_SUCCESS,
  } from "../type";
  
  const initialState = {
    response: {},
    message: "",
    loading: false,
    error: false,
    success: false,
    errorMessage: "",
  };

export const PopularSearchReducer=(state=initialState,action)=>{

    switch(action.type){
        case 'POPULAR_SEARCH_SUCCESS':
            console.log('POPULAR_SEARCH_SUCCESS')        
            return {
                ...state,
                response:action.response.data,
                success:true
            };

        case 'POPULAR_SEARCH_ERROR'  :
                console.log('POPULAR_SEARCH_ERROR')        
           return state;
        default:   
        return state;
    }

}