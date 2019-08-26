import { gql } from "apollo-boost";

export default (parent: any, {testId}: any, { cache, getCacheKey }: any, info: any) => {

 
  const cacheId = getCacheKey({ __typename: "RunningTest", id: testId });
  const fragment = gql`
      fragment runningTest on RunningTest {
        id
        name
        status
        passed
      }
  `;
  return cache.readFragment({ fragment, id: cacheId });
  

}