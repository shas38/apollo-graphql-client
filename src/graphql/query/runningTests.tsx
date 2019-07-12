import { gql } from "apollo-boost";

export default gql`
    query RunningTests{
        runningTests @client(always: true){
            runningTests @client(always: true)
        }
    }
`
