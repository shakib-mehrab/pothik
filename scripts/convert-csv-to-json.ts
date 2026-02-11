#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import {
  parseFile,
  splitArray,
  parseBoolean,
  cleanText,
  generateTimestamp,
  type ParseResult,
} from './utils/csv-parser.js';
import { validateData, type SchemaType } from './utils/validators.js';

const program = new Command();

interface ConvertOptions {
  input: string;
  output: string;
  type: SchemaType;
  adminId?: string;
  validate?: boolean;
}

// Type normalization - handles plural forms
const typeAliases: Record<string, SchemaType> = {
  'restaurants': 'restaurant',
  'hotels': 'hotel',
  'resorts': 'resort',
  'markets': 'market',
  'metroStations': 'metroStation',
  'localBuses': 'localBus',
  'longDistanceBuses': 'longDistanceBus',
  'trainSchedules': 'trainSchedule',
};

function normalizeType(type: string): SchemaType {
  const normalized = typeAliases[type] || type;
  return normalized as SchemaType;
}

// Mapping functions for different data types
const mappers: Record<
  SchemaType,
  (row: Record<string, any>, adminId: string) => any
> = {
  restaurant: (row, adminId) => ({
    name: cleanText(row.name),
    location: cleanText(row.location),
    howToGo: cleanText(row.howToGo || row.how_to_go),
    bestItem: cleanText(row.bestItem || row.best_item),
    reviews: cleanText(row.reviews),
    status: 'approved',
    submittedBy: adminId,
    submittedByName: 'Admin',
    submittedAt: generateTimestamp(),
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }),

  hotel: (row, adminId) => ({
    name: cleanText(row.name),
    location: cleanText(row.location),
    howToGo: cleanText(row.howToGo || row.how_to_go),
    coupleFriendly: parseBoolean(row.coupleFriendly || row.couple_friendly),
    documentsNeeded: splitArray(row.documentsNeeded || row.documents_needed),
    facebookPage: cleanText(row.facebookPage || row.facebook_page || ''),
    reviews: cleanText(row.reviews),
    category: cleanText(row.category || 'hotel'),
    status: 'approved',
    submittedBy: adminId,
    submittedByName: 'Admin',
    submittedAt: generateTimestamp(),
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }),

  resort: (row, adminId) => ({
    name: cleanText(row.name),
    location: cleanText(row.location),
    howToGo: cleanText(row.howToGo || row.how_to_go),
    coupleFriendly: parseBoolean(row.coupleFriendly || row.couple_friendly),
    documentsNeeded: splitArray(row.documentsNeeded || row.documents_needed),
    facebookPage: cleanText(row.facebookPage || row.facebook_page || ''),
    reviews: cleanText(row.reviews),
    category: cleanText(row.category || 'resort'),
    status: 'approved',
    submittedBy: adminId,
    submittedByName: 'Admin',
    submittedAt: generateTimestamp(),
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }),

  market: (row, adminId) => ({
    name: cleanText(row.name),
    location: cleanText(row.location),
    howToGo: cleanText(row.howToGo || row.how_to_go),
    specialty: splitArray(row.specialty || row.specialties),
    reviews: cleanText(row.reviews),
    category: cleanText(row.category || 'others'),
    status: 'approved',
    submittedBy: adminId,
    submittedByName: 'Admin',
    submittedAt: generateTimestamp(),
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }),

  metroStation: (row) => ({
    nameBangla: cleanText(row.nameBangla || row.name_bangla),
    nameEnglish: cleanText(row.nameEnglish || row.name_english),
    gates: row.gates
      ? JSON.parse(row.gates)
      : [],
    nearbyPlaces: row.nearbyPlaces
      ? JSON.parse(row.nearbyPlaces)
      : [],
    fare: cleanText(row.fare || '৳20 - ৳100'),
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }),

  localBus: (row) => ({
    name: cleanText(row.name),
    fromStation: cleanText(row.fromStation || row.from_station || row.from),
    toStation: cleanText(row.toStation || row.to_station || row.to),
    route: splitArray(row.route || `${row.fromStation || row.from},${row.toStation || row.to}`),
    hours: cleanText(row.hours || '6:00 AM–10:00 PM'),
    type: row.type || 'Semi-Seating',
  }),

  longDistanceBus: (row) => ({
    company: cleanText(row.company || row.name),
    route: {
      from: cleanText(row.from || row.route_from),
      to: cleanText(row.to || row.route_to),
    },
    fare: cleanText(row.fare || ''),
    contactNumber: cleanText(row.contactNumber || row.contact || ''),
    schedule: cleanText(row.schedule || ''),
    counterLocation: cleanText(row.counterLocation || row.counter || ''),
  }),

  trainSchedule: (row) => ({
    trainName: cleanText(row.trainName || row.train_name),
    trainNumber: cleanText(row.trainNumber || row.train_number),
    route: {
      from: cleanText(row.from || row.route_from),
      to: cleanText(row.to || row.route_to),
    },
    departureTime: cleanText(row.departureTime || row.departure || ''),
    arrivalTime: cleanText(row.arrivalTime || row.arrival || ''),
    fare: cleanText(row.fare || ''),
    trainType: cleanText(row.trainType || row.type || ''),
    daysOfOperation: splitArray(row.daysOfOperation || row.days || ''),
  }),
};

async function convertFile(options: ConvertOptions): Promise<void> {
  const spinner = ora('Starting conversion...').start();

  try {
    // Validate input file exists
    spinner.text = 'Checking input file...';
    try {
      await fs.access(options.input);
    } catch {
      throw new Error(`Input file not found: ${options.input}`);
    }

    // Parse the file
    spinner.text = `Parsing ${path.basename(options.input)}...`;
    const parseResult = await parseFile(options.input);

    spinner.succeed(
      chalk.green(
        `Parsed ${parseResult.totalRows} rows (${parseResult.data.length} valid)`
      )
    );

    if (parseResult.errors.length > 0) {
      console.log(chalk.yellow('\n⚠ Parse Errors:'));
      parseResult.errors.forEach((err) => {
        console.log(
          chalk.yellow(`  Row ${err.row}: ${err.message}`)
        );
      });
    }

    // Map and transform data
    spinner.start('Transforming data...');
    const adminId = options.adminId || 'admin';
    const normalizedType = normalizeType(options.type as string);
    const mapper = mappers[normalizedType];
    const dataArray = parseResult.data as Record<string, any>[];
    const transformedData = dataArray.map((row) =>
      mapper(row, adminId)
    );

    // Validate if requested
    if (options.validate !== false) {
      spinner.text = 'Validating data...';
      const validationErrors: Array<{
        index: number;
        errors: string[];
      }> = [];

      transformedData.forEach((item, index) => {
        const result = validateData(item, normalizedType);
        if (!result.success && result.errors) {
          validationErrors.push({
            index: index + 1,
            errors: result.errors.errors.map((e) => e.message),
          });
        }
      });

      if (validationErrors.length > 0) {
        spinner.fail(chalk.red('Validation failed!'));
        console.log(chalk.red('\n✗ Validation Errors:'));
        validationErrors.forEach((err) => {
          console.log(chalk.red(`  Row ${err.index}:`));
          err.errors.forEach((e) => console.log(chalk.red(`    - ${e}`)));
        });
        process.exit(1);
      }

      spinner.succeed(
        chalk.green(`Validated ${transformedData.length} entries`)
      );
    }

    // Write output file
    spinner.start('Writing JSON file...');
    const outputDir = path.dirname(options.output);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      options.output,
      JSON.stringify(transformedData, null, 2),
      'utf8'
    );

    spinner.succeed(
      chalk.green(
        `Successfully created ${path.basename(options.output)}`
      )
    );

    console.log(
      chalk.cyan(`\n📁 Output: ${options.output}`)
    );
    console.log(
      chalk.cyan(`📊 Total records: ${transformedData.length}`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Conversion failed!'));
    console.error(
      chalk.red(
        `\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    );
    process.exit(1);
  }
}

program
  .name('convert-csv-to-json')
  .description('Convert CSV/Excel files to JSON for Firestore seeding')
  .requiredOption('-i, --input <path>', 'Input CSV or Excel file path')
  .requiredOption('-o, --output <path>', 'Output JSON file path')
  .requiredOption(
    '-t, --type <type>',
    'Data type (restaurant, hotel, resort, market, metroStation, localBus, longDistanceBus, trainSchedule)'
  )
  .option('-a, --admin-id <id>', 'Admin user ID', 'admin')
  .option('--no-validate', 'Skip validation')
  .action(convertFile);

program.parse();
