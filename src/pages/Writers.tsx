import React, {useEffect, useReducer} from 'react';
import { connect } from 'react-redux';
import addWritersAction from '../actions/addWritersAction';

type IappState = {
  writers?: Array<object>,
  isLoading: boolean,
  isError: boolean,
}
type IappAction = {
  type: string,
  payload?: Array<object>,
}


const Writers = (props: any) => {

  console.log({props});
  const initialDataFetchReducer = (state: IappState, action: IappAction) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          writers: action.payload,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(initialDataFetchReducer, {
    isLoading: false,
    isError: false,
    writers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT'});
      try{
        const result = await fetch("http://localhost:5000/writers");
        const writers = await result.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: writers });
        props.addWriters(writers);
      }
      catch(err){
        console.log(err)
        dispatch({ type: 'FETCH_FAILURE' });
      }
    }

    fetchData();
  }, []);

  return (
    <div>
        {state.isError && <div>Something went wrong ...</div>}
        {state.isLoading?<div>loading...</div>:<ul>
        {
        !state.isError && state.writers!.map((data:any)=>{
            return <li key={data.id}>{data.name}</li>
            })
        }
        </ul>}
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) =>{
  console.log({dispatch})
  return {
    addWriters: (writers: any) => {
      dispatch(addWritersAction(writers));
    }
  }
}
export default connect(null, mapDispatchToProps)(Writers);