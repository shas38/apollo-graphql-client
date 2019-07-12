import runningTestsQuery from '../query/runningTests';

export default (_root: any, {testId}: {testId: String}, { cache, getCacheKey }: any, info: any) => {
    
    const runningTests = cache.readQuery({
        query: runningTestsQuery 
    })
    delete runningTests[testId as string]

    cache.writeData({data: { runningTests }});

    console.log('runningTestsQuery', cache.readQuery({
        query: runningTestsQuery 
    }))
    return null;
}