import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../vectorStore";

/* Load all PDFs within the specified directory */
const run = async () => {
  const directoryLoader = new DirectoryLoader("src/documents/data/", {
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await directoryLoader.load();

  console.log({ docs });

  /* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  console.log({ splitDocs });
  await vectorStore.addDocuments(splitDocs);
};
run()
