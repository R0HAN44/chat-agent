const CHUNK_SIZE = 500;
const OVERLAP = 50;

export const splitTextIntoChunks = (text : string) => {
   const chunks : string[] = [];
   let start = 0;

   while(start < text.length){
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start += CHUNK_SIZE - OVERLAP;
   }

   return chunks;
}