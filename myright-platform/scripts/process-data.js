#!/usr/bin/env node

/**
 * Data Processing Pipeline for MyRight Legal Scenarios
 * 
 * This script orchestrates the complete data processing workflow:
 * 1. Validate scenario data files
 * 2. Generate embeddings for valid scenarios
 * 3. Update search indices
 * 4. Generate statistics and reports
 * 
 * Usage:
 *   npm run process:data
 *   npm run process:data -- --skip-validation
 *   npm run process:data -- --embeddings-only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { ScenarioValidator } = require('./validation/validate-data');
const { EmbeddingGenerator } = require('./embeddings/generate-embeddings');

/**
 * Data processing pipeline orchestrator
 */
class DataProcessor {
  constructor(options = {}) {
    this.options = {
      inputDir: './data/scenarios',
      outputDir: './data/processed',
      embeddingsDir: './data/embeddings', 
      skipValidation: false,
      embeddingsOnly: false,
      force: false,
      verbose: false,
      ...options
    };
    
    this.results = {
      validation: null,
      embeddings: null,
      startTime: Date.now(),
      endTime: null
    };
  }

  /**
   * Run the complete data processing pipeline
   */
  async run() {
    console.log('🚀 MyRight Data Processing Pipeline');
    console.log('===================================');
    console.log(`Input: ${this.options.inputDir}`);
    console.log(`Output: ${this.options.outputDir}`);
    console.log(`Embeddings: ${this.options.embeddingsDir}\n`);

    try {
      // Ensure directories exist
      this.ensureDirectories();

      // Step 1: Validate data (unless skipped)
      if (!this.options.skipValidation && !this.options.embeddingsOnly) {
        await this.validateData();
      }

      // Step 2: Generate embeddings
      if (!this.options.validationOnly) {
        await this.generateEmbeddings();
      }

      // Step 3: Update search indices (placeholder)
      if (!this.options.skipValidation && !this.options.embeddingsOnly) {
        await this.updateSearchIndices();
      }

      // Step 4: Generate reports
      await this.generateReports();

      this.results.endTime = Date.now();
      
      console.log('\n🎉 Pipeline completed successfully!');
      this.printSummary();
      
      return this.results;

    } catch (error) {
      console.error(`\n❌ Pipeline failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [
      this.options.outputDir,
      this.options.embeddingsDir,
      path.join(this.options.outputDir, 'reports'),
      path.join(this.options.outputDir, 'indices')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  /**
   * Step 1: Validate scenario data
   */
  async validateData() {
    console.log('🔍 Step 1: Validating scenario data...');
    console.log('=====================================');

    const validator = new ScenarioValidator({
      verbose: this.options.verbose,
      checkUrls: true
    });

    try {
      const results = await validator.validatePath(this.options.inputDir);
      this.results.validation = validator.generateSummary(results);
      
      console.log(`✅ Validation completed:`);
      console.log(`   • ${this.results.validation.validFiles}/${this.results.validation.totalFiles} files valid (${this.results.validation.passRate}%)`);
      console.log(`   • ${this.results.validation.totalErrors} errors, ${this.results.validation.totalWarnings} warnings`);
      console.log(`   • Average score: ${this.results.validation.averageScore}/100`);

      // Stop pipeline if critical errors found
      if (this.results.validation.totalErrors > 0 && !this.options.force) {
        throw new Error('Validation failed with errors. Use --force to continue anyway.');
      }

    } catch (error) {
      if (error.message.includes('Validation failed with errors')) {
        throw error;
      }
      console.error(`⚠️  Validation error: ${error.message}`);
      if (!this.options.force) {
        throw new Error('Validation step failed. Use --force to continue anyway.');
      }
    }
  }

  /**
   * Step 2: Generate embeddings
   */
  async generateEmbeddings() {
    console.log('\n🤖 Step 2: Generating embeddings...');
    console.log('===================================');

    const generator = new EmbeddingGenerator({
      force: this.options.force,
      verbose: this.options.verbose
    });

    try {
      const results = await generator.processDirectory(
        this.options.inputDir,
        this.options.embeddingsDir
      );
      
      this.results.embeddings = results;
      
      console.log(`✅ Embeddings generated:`);
      console.log(`   • ${results.processed} scenarios processed`);
      console.log(`   • ${results.errors} errors encountered`);
      
      if (results.errors > 0) {
        console.log('   ⚠️  Some embeddings failed to generate');
      }

    } catch (error) {
      console.error(`⚠️  Embeddings error: ${error.message}`);
      if (!this.options.force) {
        throw new Error('Embeddings step failed. Use --force to continue anyway.');
      }
    }
  }

  /**
   * Step 3: Update search indices (placeholder)
   */
  async updateSearchIndices() {
    console.log('\n📊 Step 3: Updating search indices...');
    console.log('====================================');

    try {
      // This would integrate with the SearchService to update indices
      // For now, we'll create a simple index file
      
      const indexData = {
        lastUpdated: new Date().toISOString(),
        totalScenarios: this.results.embeddings?.processed || 0,
        validation: this.results.validation,
        embeddings: {
          model: 'sentence-transformers/all-MiniLM-L6-v2',
          dimensions: 384,
          processed: this.results.embeddings?.processed || 0
        }
      };
      
      const indexFile = path.join(this.options.outputDir, 'indices', 'search-index.json');
      fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
      
      console.log('✅ Search indices updated');
      console.log(`   • Index file: ${indexFile}`);

    } catch (error) {
      console.error(`⚠️  Index update error: ${error.message}`);
      // Don't fail pipeline for index errors
    }
  }

  /**
   * Step 4: Generate reports
   */
  async generateReports() {
    console.log('\n📋 Step 4: Generating reports...');
    console.log('=================================');

    try {
      const reportData = {
        pipeline: {
          startTime: new Date(this.results.startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration: Date.now() - this.results.startTime,
          options: this.options
        },
        validation: this.results.validation,
        embeddings: this.results.embeddings,
        summary: {
          totalScenarios: this.results.embeddings?.processed || 0,
          validationPassed: this.results.validation?.totalErrors === 0,
          embeddingsGenerated: this.results.embeddings?.processed > 0,
          overallSuccess: (this.results.validation?.totalErrors || 0) === 0 && 
                         (this.results.embeddings?.processed || 0) > 0
        }
      };

      // Save detailed report
      const reportFile = path.join(this.options.outputDir, 'reports', 
        `pipeline-report-${new Date().toISOString().split('T')[0]}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));

      // Save latest report
      const latestReportFile = path.join(this.options.outputDir, 'reports', 'latest.json');
      fs.writeFileSync(latestReportFile, JSON.stringify(reportData, null, 2));

      console.log('✅ Reports generated');
      console.log(`   • Detailed report: ${reportFile}`);
      console.log(`   • Latest report: ${latestReportFile}`);

    } catch (error) {
      console.error(`⚠️  Report generation error: ${error.message}`);
      // Don't fail pipeline for report errors
    }
  }

  /**
   * Print pipeline summary
   */
  printSummary() {
    const duration = Math.round((this.results.endTime - this.results.startTime) / 1000);
    
    console.log('\n📊 Pipeline Summary');
    console.log('==================');
    console.log(`Duration: ${duration} seconds`);
    
    if (this.results.validation) {
      console.log(`Validation: ${this.results.validation.validFiles}/${this.results.validation.totalFiles} files valid`);
    }
    
    if (this.results.embeddings) {
      console.log(`Embeddings: ${this.results.embeddings.processed} scenarios processed`);
    }
    
    console.log(`Status: ${this.getOverallStatus()}`);
  }

  /**
   * Get overall pipeline status
   */
  getOverallStatus() {
    const validationOk = !this.results.validation || this.results.validation.totalErrors === 0;
    const embeddingsOk = !this.results.embeddings || this.results.embeddings.processed > 0;
    
    if (validationOk && embeddingsOk) {
      return '✅ Success';
    } else if (!validationOk && !embeddingsOk) {
      return '❌ Failed (validation + embeddings)';
    } else if (!validationOk) {
      return '⚠️  Partial (validation failed)';
    } else {
      return '⚠️  Partial (embeddings failed)';
    }
  }
}

/**
 * Command line interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  const options = {
    inputDir: args[0] || './data/scenarios',
    skipValidation: args.includes('--skip-validation'),
    embeddingsOnly: args.includes('--embeddings-only'), 
    validationOnly: args.includes('--validation-only'),
    force: args.includes('--force'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };

  try {
    const processor = new DataProcessor(options);
    const results = await processor.run();
    
    // Exit with appropriate code
    const success = results.validation?.totalErrors === 0 && 
                   results.embeddings?.processed > 0;
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error(`\n💥 Pipeline execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DataProcessor };