export default (_root: any, {inputType, inputValue}: {inputType: String, inputValue: String}, { cache }: any, info: any) => {
    
    cache.writeData({data: {umsTest: { [inputType as string]: inputValue, __typename: 'UmsTest', }}});

    // console.log('umsTestInputsQuery', cache.readQuery({
    //     query: gql`
    //         query selectedUmsTestInput{
    //             testName @client(always: true)
    //             selectedTestType @client(always: true) 
    //             testDescription @client(always: true) 
    //             umsTest{
    //                 selectedDN @client(always: true)  
    //                 selectedUms @client(always: true)  
    //                 selectedCluster @client(always: true)  
    //             }
    //         }
    //     ` 
    // }))
    return null;
}