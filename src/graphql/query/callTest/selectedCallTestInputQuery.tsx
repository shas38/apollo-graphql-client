import { gql } from "apollo-boost";

export default gql`
    query selectedCallTestInput{
        testName @client(always: true)
        selectedTestType @client(always: true) 
        testDescription @client(always: true) 
        AParty{
            selectedDN @client(always: true)  
            selectedSbc @client(always: true)  
            selectedProduct @client(always: true)  
            selectedRegion @client(always: true)  
            selectedCluster @client(always: true)  
        }
        BParty{
            selectedDN @client(always: true)  
            selectedSbc @client(always: true)  
            selectedProduct @client(always: true)  
            selectedRegion @client(always: true)  
            selectedCluster @client(always: true)  
        }
    }
`
