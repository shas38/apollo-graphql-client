export default (_root: any, {search}: {search: String}, { cache, getCacheKey }: any, info: any) => {
    
    cache.writeData({data: { search }});
    return null;
}