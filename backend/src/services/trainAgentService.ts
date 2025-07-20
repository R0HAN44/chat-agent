import { addToVectorStore } from "../agent-rag/chroma"
import { ISource } from "../models/Source"
import { splitTextIntoChunks } from "../utils/chunker"
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export const handlePDFSource = async (source: ISource, agentId: any) => {
    try {
        console.log("pdf srouceL", source)
        // Your PDF source has fileUrl, not sourcesArray
        if (!source.fileUrl) {
            console.warn('No fileUrl found in PDF source');
            return;
        }

        // Extract text from the PDF file
        const filePath = source.fileUrl; 

        // For now, placeholder for PDF text extraction
        const extractedText = await extractTextFromPDF(filePath);
        
        if (!extractedText || extractedText.trim().length === 0) {
            console.warn(`No text content extracted from PDF: ${source.title}`);
            return;
        }

        // Split the extracted text into chunks
        const textChunks = splitTextIntoChunks(extractedText);
        console.log(`PDF "${source.title}" - text chunks:`, textChunks.length);

        // Add chunks to vector store
        const sObj = await addToVectorStore(agentId, textChunks);
        console.log('PDF source processed:', source.title, sObj);
        
        return sObj;
    } catch (error) {
        console.error(`Error handling PDF source "${source.title}":`, error);
        throw error;
    }
};

// Helper function to extract text from PDF
const extractTextFromPDF = async (fileUrl: string): Promise<string> => {
    try {
        
        const fullPath = path.join(process.cwd(), fileUrl);
        
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            throw new Error(`PDF file not found: ${fullPath}`);
        }
        
        // Read PDF file as buffer
        const pdfBuffer = fs.readFileSync(fullPath);
        
        // Extract text using pdf-parse
        const pdfData = await pdf(pdfBuffer, {
            // Options for pdf-parse
            max: 0, // Maximum number of pages to parse (0 = all pages)
            version: 'v1.10.100', // PDF.js version to use
        });
        
        // Clean up the extracted text
        let extractedText = pdfData.text;
        
        // Basic text cleaning
        extractedText = extractedText
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
            .trim();
        
        console.log(`Successfully extracted ${extractedText.length} characters from PDF: ${fileUrl}`);
        console.log(`PDF Info - Pages: ${pdfData.numpages}, Version: ${pdfData.version}`);
        
        return extractedText;
        
    } catch (error : any) {
        console.error('Error extracting text from PDF:', error);
        
        // If it's a file not found error, provide more specific message
        if (error.code === 'ENOENT') {
            throw new Error(`PDF file not found at path: ${fileUrl}`);
        }
        
        // If it's a PDF parsing error, provide context
        if (error.message && error.message.includes('Invalid PDF')) {
            throw new Error(`Invalid or corrupted PDF file: ${fileUrl}`);
        }
        
        throw error;
    }
};

export const handleQNASource = async (source: ISource, agentId: any) => {
    console.log("QNA source",source)
    console.log(agentId)
    // try {
    //     // Process Q&A pairs from sourcesArray
    //     const qnaTextArray = source?.sourcesArray?.map((s: any) => {
    //         // Handle different Q&A formats
    //         if (s.question && s.answer) {
    //             // Format: Question: ... Answer: ...
    //             return `Question: ${s.question}\nAnswer: ${s.answer}`;
    //         } else if (s.q && s.a) {
    //             // Alternative format: q & a
    //             return `Question: ${s.q}\nAnswer: ${s.a}`;
    //         } else if (s.content) {
    //             // Pre-formatted Q&A content
    //             return s.content;
    //         } else if (typeof s === 'string') {
    //             // Direct string content
    //             return s;
    //         } else {
    //             // Fallback: try to extract any text content
    //             const question = s.question || s.q || s.title || '';
    //             const answer = s.answer || s.a || s.response || s.text || '';
                
    //             if (question || answer) {
    //                 return `${question ? 'Question: ' + question : ''}${question && answer ? '\n' : ''}${answer ? 'Answer: ' + answer : ''}`;
    //             }
                
    //             return '';
    //         }
    //     });

    //     // Filter out empty entries and join
    //     const validQNAs = qnaTextArray.filter((qna : any) => qna && qna.trim().length > 0);
        
    //     if (validQNAs.length === 0) {
    //         console.warn('No valid Q&A content found');
    //         return;
    //     }

    //     // Join Q&A pairs with separators
    //     const combinedQNAText = validQNAs.join('\n\n---\n\n');
        
    //     // Split into chunks (Q&A pairs might be longer, so adjust chunk size if needed)
    //     const textChunks = splitTextIntoChunks(combinedQNAText);
    //     console.log("Q&A text chunks:", textChunks.length);

    //     // Add to vector store
    //     const sObj = await addToVectorStore(agentId, textChunks);
    //     console.log('Q&A source processed:', sObj);
        
    //     return sObj;
    // } catch (error) {
    //     console.error('Error handling Q&A source:', error);
    //     throw error;
    // }
};

// Optional: Enhanced version with metadata preservation
export const handleQNASourceWithMetadata = async (source: ISource, agentId: any) => {
    try {
        const qnaChunks = source?.sourcesArray?.map((s: any, index: number) => {
            const question = s.question || s.q || '';
            const answer = s.answer || s.a || '';
            
            if (!question && !answer) return null;
            
            // Create structured content with metadata
            const content = `Question: ${question}\nAnswer: ${answer}`;
            
            return {
                content,
                metadata: {
                    type: 'qna',
                    index,
                    question: question.substring(0, 100), // First 100 chars for reference
                    sourceId: source._id || source.id
                }
            };
        }).filter((chunk : any) => chunk !== null);

        if (qnaChunks.length === 0) {
            console.warn('No valid Q&A content found');
            return;
        }

        console.log("Q&A chunks with metadata:", qnaChunks.length);

        // If addToVectorStore supports metadata, pass it along
        const sObj = await addToVectorStore(agentId, qnaChunks);
        console.log('Q&A source with metadata processed:', sObj);
        
        return sObj;
    } catch (error) {
        console.error('Error handling Q&A source with metadata:', error);
        throw error;
    }
};
export const handleWebsiteSource = (source : ISource, agentId : any) => {
    
}
export const handleTextSource = async (source : ISource, agentId : any) => {
    console.log(source)
    const textStringArray = source?.sourcesArray?.map((s : any) => s.content);
    const texts = textStringArray.join(",");
    const textChunks = splitTextIntoChunks(texts);
    console.log("textchunks",textChunks);
    const sObj = await addToVectorStore(agentId, textChunks); 
    console.log(sObj)
    return;
}