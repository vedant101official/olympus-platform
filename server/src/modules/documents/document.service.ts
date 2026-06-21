import DocumentChunk from "./document.model";

export const splitIntoChunks = (
    text: string,
    chunkSize = 1000
): string[] => {

    const chunks = [];

    for(let i=0;i<text.length;i+=chunkSize){
        chunks.push(
            text.slice(i, i+chunkSize)
        );
    }

    return chunks;
};

export const saveDocumentChunks = async (
    tenantId:string,
    fileName:string,
    text:string
) => {

    const chunks = splitIntoChunks(text);

    const docs = chunks.map(
        (chunk,index)=>({
            tenantId,
            fileName,
            chunkIndex:index,
            content:chunk
        })
    );

    await DocumentChunk.insertMany(docs);
};