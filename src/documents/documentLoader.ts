import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../vectorStore";
import { CSVLoader } from "langchain/dist/document_loaders/fs/csv";
import { TextLoader } from "langchain/dist/document_loaders/fs/text";
import { DocxLoader } from "@langchain/community/dist/document_loaders/fs/docx";

const excludeFile = [
  "Notice of Benefit and Payment Parameters for 2025 Final Rule",
];
/* Load all PDFs within the specified directory */
const run = async () => {
  const directoryLoader = new DirectoryLoader("src/documents/data/", {
    ".pdf": (path) => new PDFLoader(path),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
    ".docx": (path) => new DocxLoader(path),
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
  const docsToLoad = splitDocs.filter(
    (doc) => !excludeFile.includes(doc.metadata.pdf_info_Title),
  );
  await vectorStore.addDocuments(docsToLoad);
};
run();
