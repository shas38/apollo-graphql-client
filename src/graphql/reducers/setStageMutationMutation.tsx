import stageQuery from '../query/stageQuery'

export default (_root: any, {stage, modifyTestName = null}: {stage: String, modifyTestName: String | null}, { cache, getCacheKey }: any, info: any) => {

    const oldStage = cache.readQuery({
        query: stageQuery 
    })

    cache.writeData({data: { stage, modifyTestName: modifyTestName ? modifyTestName : oldStage.modifyTestName }});

    return true;
}