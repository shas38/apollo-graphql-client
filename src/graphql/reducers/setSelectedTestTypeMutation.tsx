import { gql } from "apollo-boost";


const selectedTestTypeQuery = gql`
    query TestType{
        selectedTestType @client
    }
`
export default (_root: any, {selectedTestType}: {selectedTestType: String}, { cache, getCacheKey }: any, info: any) => {

    cache.writeData({data: { selectedTestType }});
    console.log('selectedTestTypeQuery', cache.readQuery({
        query: selectedTestTypeQuery 
    }))
    return null;
}