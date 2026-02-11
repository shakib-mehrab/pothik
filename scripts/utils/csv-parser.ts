import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { Readable } from 'stream';

export interface ParseOptions {
  skipEmptyLines?: boolean;
  trim?: boolean;
  encoding?: BufferEncoding;
}

export interface ParseResult<T> {
  data: T[];
  errors: Array<{ row: number; message: string }>;
  totalRows: number;
}

/**
 * Parse CSV file and return structured data
 */
export async function parseCSV<T>(
  filePath: string,
  options: ParseOptions = {}
): Promise<ParseResult<T>> {
  const results: T[] = [];
  const errors: Array<{ row: number; message: string }> = [];
  let rowNumber = 0;

  const {
    skipEmptyLines = true,
    trim = true,
    encoding = 'utf8',
  } = options;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { encoding })
      .pipe(csv())
      .on('data', (row) => {
        rowNumber++;
        try {
          // Check if row is empty
          if (skipEmptyLines && Object.values(row).every((val) => !val)) {
            return;
          }
          results.push(row as T);
        } catch (error) {
          errors.push({
            row: rowNumber,
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      })
      .on('end', () => {
        resolve({
          data: results,
          errors,
          totalRows: rowNumber,
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Parse Excel (XLS/XLSX) file and return structured data
 */
export function parseExcel<T>(
  filePath: string,
  sheetName?: string
): ParseResult<T> {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = sheetName
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error(`Sheet ${sheetName || 'default'} not found`);
    }

    const data = xlsx.utils.sheet_to_json<T>(sheet, {
      raw: false,
      defval: '',
    });

    return {
      data,
      errors: [],
      totalRows: data.length,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Detect file type and parse accordingly
 */
export async function parseFile<T>(
  filePath: string,
  options: ParseOptions = {}
): Promise<ParseResult<T>> {
  const ext = filePath.toLowerCase().split('.').pop();

  if (ext === 'csv') {
    return parseCSV<T>(filePath, options);
  } else if (ext === 'xlsx' || ext === 'xls') {
    return parseExcel<T>(filePath);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
}

/**
 * Helper to split comma-separated string into array
 */
export function splitArray(value: string | undefined, separator = ','): string[] {
  if (!value) return [];
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Convert string to boolean
 */
export function parseBoolean(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  
  const normalized = value.toString().toLowerCase().trim();
  return ['yes', 'true', '1', 'হ্যাঁ', 'য'].includes(normalized);
}

/**
 * Clean and normalize text
 */
export function cleanText(value: string | undefined): string {
  if (!value) return '';
  return value.toString().trim().replace(/\s+/g, ' ');
}

/**
 * Generate timestamp
 */
export function generateTimestamp(): { seconds: number; nanoseconds: number } {
  const now = Date.now();
  return {
    seconds: Math.floor(now / 1000),
    nanoseconds: (now % 1000) * 1000000,
  };
}
