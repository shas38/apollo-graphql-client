import stageQuery from '../query/stageQuery'

export default (_root: any, {stage}: {stage: String}, { cache, getCacheKey }: any, info: any) => {

    cache.writeData({data: { stage }});
    console.log('stageQuery', cache.readQuery({
        query: stageQuery 
    }))
    return null;
}