declare module 'pdf-parse' {
  type PdfResult = { text: string }
  export default function pdfParse(dataBuffer: Buffer): Promise<PdfResult>
}
