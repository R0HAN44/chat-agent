export const getTextEmbeddings = async (texts: string[]): Promise<number[][]> => {
    const results: number[][] = [];

    for (const text of texts) {
      const res = await fetch("http://localhost:11434/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "nomic-embed-text",
          prompt: text,
        }),
      });

      const data : any = await res.json();
      results.push(data.embedding);
    }
    console.log(results)
    return results;
  }

// export const getEmbeddings = (data : any, type : any) => { 
//     // "document" | "text" | "qna" | "website";
//     switch (type){
//         case "text":
//             return getTextEmbeddings(data);
//         default :
//             return getTextEmbeddings(data);
//     }
// }