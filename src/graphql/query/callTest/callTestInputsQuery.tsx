import { gql } from "apollo-boost";

export default gql`
    query {
        callTest{
            AParty{
                DN
                sbc
                product
                region
                cluster
            }
        }
    }
`
