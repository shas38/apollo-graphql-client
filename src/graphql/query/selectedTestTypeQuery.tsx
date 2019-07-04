import { gql } from "apollo-boost";

export default gql`
    query SelectedTestType{
        selectedTestType @client(always: true)
    }
`
