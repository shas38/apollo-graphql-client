import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import SelectTestType from './SelectTestType'
import selectedTestTypeQuery from '../../graphql/query/selectedTestTypeQuery';

const style = {

}
const UserForm = (props: any) => {

    const testTypes = props.testTypes;
    const [step, setStep] = useState(1);
    const [state, setState] = useState({
        testType: '',
    })
    let data = useQuery(selectedTestTypeQuery);
    // console.log({data})
    // Proceed to next step
    const nextStep = () => {
    setStep((prevStep: number) => prevStep + 1);
    };

    // Go back to prev step
    const prevStep = () => {
    setStep((prevStep: number) => prevStep - 1);
    };

    // Handle fields change
    const handleChange = (e: any) => {
        
        const newState = {...state, ...{[e.target.name]: e.target.value}};
        console.log(newState, e.target.name)
        setState(newState);
    };

    // const { firstName, lastName, email, occupation, city, bio } = state;
    // const values = { firstName, lastName, email, occupation, city, bio };
    
 
    switch (step) {
        case 1:
            return (        
                <SelectTestType
                    nextStep={nextStep}
                    handleChange={handleChange}
                    testTypes={testTypes}
                    testType={state.testType} 
                />
            );
        // case 2:
        //     return (
        //     <FormPersonalDetails
        //         nextStep={nextStep}
        //         prevStep={prevStep}
        //         handleChange={handleChange}
        //         values={values}
        //     />
        //     );
        // case 3:
        //     return (
        //     <Confirm
        //         nextStep={nextStep}
        //         prevStep={prevStep}
        //         values={values}
        //     />
        //     );
        // case 4:
        //     return <Success />;
        default:
            return(
                <SelectTestType
                    nextStep={nextStep}
                    handleChange={handleChange}
                    testTypes={testTypes}
                    testType={state.testType} 
                />
            );
    }
  
}


export default UserForm;