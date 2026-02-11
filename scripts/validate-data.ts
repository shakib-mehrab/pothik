#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { validateData, type SchemaType } from './utils/validators.js';

const program = new Command();

interface ValidateOptions {
  file: string;
  type: SchemaType;
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

interface ValidationReport {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: Array<{
    index: number;
    record: any;
    errors: string[];
  }>;
}

async function validateFile(options: ValidateOptions): Promise<void> {
  const spinner = ora('Starting validation...').start();

  try {
    // Check if file exists
    spinner.text = 'Reading JSON file...';
    const fileContent = await fs.readFile(options.file, 'utf8');
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of objects');
    }

    spinner.succeed(
      chalk.green(`Loaded ${data.length} records from ${path.basename(options.file)}`)
    );

    // Validate each record
    spinner.start('Validating records...');
    const normalizedType = normalizeType(options.type as string);
    const report: ValidationReport = {
      totalRecords: data.length,
      validRecords: 0,
      invalidRecords: 0,
      errors: [],
    };

    data.forEach((record, index) => {
      const result = validateData(record, normalizedType);
      
      if (result.success) {
        report.validRecords++;
      } else {
        report.invalidRecords++;
        report.errors.push({
          index: index + 1,
          record,
          errors: result.errors?.errors.map((e) => `${e.path.join('.')}: ${e.message}`) || [],
        });
      }
    });

    // Display report
    spinner.stop();
    console.log(chalk.bold('\n📋 Validation Report\n'));
    console.log(chalk.cyan(`Total Records:   ${report.totalRecords}`));
    console.log(chalk.green(`✓ Valid:         ${report.validRecords}`));
    console.log(chalk.red(`✗ Invalid:       ${report.invalidRecords}`));

    if (report.errors.length > 0) {
      console.log(chalk.red('\n\n❌ Validation Errors:\n'));
      
      report.errors.slice(0, 10).forEach((error) => {
        console.log(chalk.yellow(`Record #${error.index}:`));
        console.log(chalk.gray(`  ${JSON.stringify(error.record).substring(0, 100)}...`));
        error.errors.forEach((err) => {
          console.log(chalk.red(`  ✗ ${err}`));
        });
        console.log('');
      });

      if (report.errors.length > 10) {
        console.log(chalk.yellow(`... and ${report.errors.length - 10} more errors\n`));
      }

      process.exit(1);
    } else {
      console.log(chalk.green('\n✓ All records are valid!\n'));
    }
  } catch (error) {
    spinner.fail(chalk.red('Validation failed!'));
    console.error(
      chalk.red(
        `\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    );
    process.exit(1);
  }
}

program
  .name('validate-data')
  .description('Validate JSON data files against schemas')
  .requiredOption('-f, --file <path>', 'JSON file to validate')
  .requiredOption(
    '-t, --type <type>',
    'Data type (restaurant, hotel, resort, market, metroStation, localBus, longDistanceBus, trainSchedule)'
  )
  .action(validateFile);

program.parse();
