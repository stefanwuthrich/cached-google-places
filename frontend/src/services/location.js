import { useReducer } from 'react'
import axios from 'axios'
import debounce from 'debounce-fn'

const initialState = {
  isLoading: false,
  error: false,
  data: [],
}
const actionTypes = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
}
function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_REQUEST:
      return { ...state, isLoading: true }
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        error: false,
        isLoading: false,
        data: action.results,
      }
    case actionTypes.FETCH_FAILURE:
      console.log(action.error)
      return { ...state, isLoading: false, error: true }
    default:
      return state
  }
}
export function useLocation() {
  const [{ isLoading, error, data }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const fetchLocationResults = debounce(
    async (searchString) => {
      if (searchString.length > 2) {
        const locationUrl = `http://localhost:9090/${searchString}`
        dispatch({ type: actionTypes.FETCH_REQUEST })
        try {
          const response = await axios.get(locationUrl)
          dispatch({
            type: actionTypes.FETCH_SUCCESS,
            results: response.data,
          })
        } catch (error) {
          dispatch({ type: actionTypes.FETCH_FAILURE, error })
        }
      }
    },
    { wait: 400 }
  )
  return { error, isLoading, data, fetchLocationResults }
}
