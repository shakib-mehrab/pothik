#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import admin from 'firebase-admin';

const program = new Command();

interface SeedOptions {
  file: string;
  collection: string;
  batchSize?: number;
  dryRun?: boolean;
  skipDuplicates?: boolean;
  clearExisting?: boolean;
  serviceAccount?: string;
}

// Collection name mapping
const collectionMap: Record<string, string> = {
  restaurant: 'restaurants',
  restaurants: 'restaurants',
  hotel: 'hotels',
  hotels: 'hotels',
  resort: 'hotels',
  resorts: 'hotels',
  market: 'markets',
  markets: 'markets',
  metroStation: 'metroStations',
  metroStations: 'metroStations',
  localBus: 'localBuses',
  localBuses: 'localBuses',
  longDistanceBus: 'longDistanceBuses',
  longDistanceBuses: 'longDistanceBuses',
  trainSchedule: 'trainSchedules',
  trainSchedules: 'trainSchedules',
};

// Initialize Firebase Admin
async function initializeFirebase(serviceAccountPath?: string): Promise<void> {
  if (admin.apps.length > 0) {
    return; // Already initialized
  }

  try {
    const serviceAccountFile =
      serviceAccountPath || './serviceAccountKey.json';

    const serviceAccountData = await fs.readFile(
      path.resolve(serviceAccountFile),
      'utf-8'
    );
    const serviceAccount = JSON.parse(serviceAccountData);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    throw new Error(
      `Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}\n` +
        'Make sure serviceAccountKey.json exists in the scripts folder.\n' +
        'Download it from Firebase Console: Project Settings > Service Accounts > Generate New Private Key'
    );
  }
}

async function checkDuplicate(
  collectionRef: admin.firestore.CollectionReference,
  record: any
): Promise<boolean> {
  // Check for duplicates based on name and location (for most collections)
  if (record.name && record.location) {
    const snapshot = await collectionRef
      .where('name', '==', record.name)
      .where('location', '==', record.location)
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  // For metro stations, check by nameEnglish
  if (record.nameEnglish) {
    const snapshot = await collectionRef
      .where('nameEnglish', '==', record.nameEnglish)
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  // For buses, check by name and route
  if (record.route) {
    const snapshot = await collectionRef
      .where('route.from', '==', record.route.from)
      .where('route.to', '==', record.route.to)
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  // For trains, check by trainNumber
  if (record.trainNumber) {
    const snapshot = await collectionRef
      .where('trainNumber', '==', record.trainNumber)
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  return false;
}

async function seedFirestore(options: SeedOptions): Promise<void> {
  const spinner = ora('Starting seeding process...').start();

  try {
    // Initialize Firebase
    spinner.text = 'Initializing Firebase Admin...';
    await initializeFirebase(options.serviceAccount);
    const db = admin.firestore();

    // Read JSON file
    spinner.text = 'Reading JSON file...';
    const fileContent = await fs.readFile(options.file, 'utf8');
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of objects');
    }

    spinner.succeed(
      chalk.green(
        `Loaded ${data.length} records from ${path.basename(options.file)}`
      )
    );

    // Get collection name
    const collectionName =
      collectionMap[options.collection] || options.collection;
    const collectionRef = db.collection(collectionName);

    console.log(
      chalk.cyan(`\n📦 Target collection: ${collectionName}`)
    );

    // Clear existing data if requested
    if (options.clearExisting && !options.dryRun) {
      spinner.start('Clearing existing data...');
      const snapshot = await collectionRef.get();
      const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePromises);
      spinner.succeed(
        chalk.yellow(`Deleted ${snapshot.size} existing documents`)
      );
    }

    // Dry run
    if (options.dryRun) {
      console.log(
        chalk.yellow(
          '\n🔍 DRY RUN MODE - No data will be written\n'
        )
      );
      console.log(chalk.cyan('Sample records:'));
      data.slice(0, 3).forEach((record, index) => {
        console.log(
          chalk.gray(`\n  Record ${index + 1}:`)
        );
        console.log(
          chalk.gray(
            `  ${JSON.stringify(record, null, 2).split('\n').join('\n  ')}`
          )
        );
      });
      console.log(
        chalk.green(
          `\n✓ Would seed ${data.length} documents to ${collectionName}`
        )
      );
      return;
    }

    // Process in batches
    const batchSize = options.batchSize || 500;
    let totalSeeded = 0;
    let totalSkipped = 0;

    spinner.start('Seeding data...');

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = db.batch();
      const chunk = data.slice(i, Math.min(i + batchSize, data.length));

      for (const record of chunk) {
        // Check for duplicates if requested
        if (options.skipDuplicates) {
          const isDuplicate = await checkDuplicate(
            collectionRef,
            record
          );
          if (isDuplicate) {
            totalSkipped++;
            continue;
          }
        }

        // Use the id field from the record if it exists, otherwise auto-generate
        const docId = record.id;
        const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();
        
        // Remove id from the data if it exists (it should only be the document ID)
        const { id, ...dataWithoutId } = record;
        batch.set(docRef, dataWithoutId);
        totalSeeded++;
      }

      await batch.commit();
      
      const progress = Math.min(i + batchSize, data.length);
      spinner.text = `Seeding data... ${progress}/${data.length}`;
    }

    spinner.succeed(
      chalk.green(
        `Successfully seeded ${totalSeeded} documents`
      )
    );

    if (totalSkipped > 0) {
      console.log(
        chalk.yellow(`⚠ Skipped ${totalSkipped} duplicates`)
      );
    }

    console.log(chalk.cyan(`\n📊 Summary:`));
    console.log(chalk.green(`  ✓ Seeded: ${totalSeeded}`));
    if (totalSkipped > 0) {
      console.log(
        chalk.yellow(`  ⊘ Skipped: ${totalSkipped}`)
      );
    }
    console.log(
      chalk.cyan(`  📁 Collection: ${collectionName}\n`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Seeding failed!'));
    console.error(
      chalk.red(
        `\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    );
    process.exit(1);
  } finally {
    // Clean up
    if (admin.apps.length > 0) {
      await admin.app().delete();
    }
  }
}

program
  .name('seed-firestore')
  .description('Seed JSON data to Firestore using Firebase Admin SDK')
  .requiredOption('-f, --file <path>', 'JSON file to seed')
  .requiredOption('-c, --collection <name>', 'Target Firestore collection')
  .option(
    '-b, --batch-size <number>',
    'Number of documents per batch',
    '500'
  )
  .option('-d, --dry-run', 'Preview without writing data')
  .option('-s, --skip-duplicates', 'Skip duplicate entries')
  .option('--clear-existing', 'Delete all existing documents before seeding')
  .option(
    '--service-account <path>',
    'Path to service account JSON',
    './serviceAccountKey.json'
  )
  .action((options) => {
    seedFirestore({
      ...options,
      batchSize: parseInt(options.batchSize),
    });
  });

program.parse();
