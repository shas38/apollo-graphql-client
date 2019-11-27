export default (_root: any, {inputType, inputValue}: {inputType: String, inputValue: String}, { cache }: any, info: any) => {
    console.log({inputType, inputValue})
    cache.writeData({data: {clientsTest: { [inputType as string]: inputValue, __typename: 'ClientsTest', }}});

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