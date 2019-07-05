import { gql } from "apollo-boost";

export default gql`
    query Stage{
        stage @client(always: true)
    }
`
