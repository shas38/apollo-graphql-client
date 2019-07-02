import { gql } from "apollo-boost";

// export default gql`
//   query Testlogs($testId: ID){
//     testlogs(testId: $testId){
//         id
//         type
//         startTime
//         endTtime
//         results
//     }
//   }
// `
export default gql`
  query Testlogs($testId: ID){
    testlogs(testId: $testId){
        id
        type
        AParty{
          DN
          sbc{
            sbc
            fqdn
            region
            vpn
            product
            probe_ssh
            probe_sip_addr
          }
          product
          region
          cluster
          lineport
          domain
          enterprise
          group
          state
          sip_port
          rtp_port
        }
        BParty{
          DN
          sbc{
            sbc
            fqdn
            region
            vpn
            product
            probe_ssh
            probe_sip_addr
          }
          product
          region
          cluster
          lineport
          domain
          enterprise
          group
          state
          sip_port
          rtp_port
        }
        startTime
        endTtime
        results
    }
  }
`
