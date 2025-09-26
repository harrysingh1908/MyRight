#!/usr/bin/env node

/**
 * Data Validation Script for MyRight Legal Scenarios
 * 
 * This script validates legal scenario data files for:
 * - Schema compliance
 * - Required field validation
 * - Data integrity checks
 * - Source URL verification
 * - Content quality assessment
 * 
 * Usage:
 *   npm run validate:data [directory|file]
 *   npm run validate:data -- --fix  # Auto-fix issues where possible
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Schema definition for legal scenarios
 */
const SCENARIO_SCHEMA = {
  required: ['id', 'title', 'description', 'category', 'severity', 'rights', 'actionSteps', 'sources'],
  optional: ['keywords', 'variations', 'lastUpdated', 'validationStatus', 'metadata'],
  types: {
    id: 'string',
    title: 'string', 
    description: 'string',
    category: 'string',
    severity: ['low', 'medium', 'high', 'critical'],
    rights: 'array',
    actionSteps: 'array',
    sources: 'array',
    keywords: 'array',
    variations: 'array',
    lastUpdated: 'string',
    validationStatus: 'object',
    metadata: 'object'
  }
};

/**
 * Validation results
 */
class ValidationResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.isValid = true;
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    this.score = 100;
  }

  addError(message, field = null) {
    this.errors.push({ message, field, severity: 'error' });
    this.isValid = false;
    this.score -= 20;
  }

  addWarning(message, field = null) {
    this.warnings.push({ message, field, severity: 'warning' });
    this.score -= 5;
  }

  addSuggestion(message, field = null) {
    this.suggestions.push({ message, field, severity: 'suggestion' });
  }

  getReport() {
    return {
      filePath: this.filePath,
      isValid: this.isValid,
      score: Math.max(0, this.score),
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
      summary: `${this.errors.length} errors, ${this.warnings.length} warnings, ${this.suggestions.length} suggestions`
    };
  }
}

/**
 * Main validator class
 */
class ScenarioValidator {
  constructor(options = {}) {
    this.options = {
      fixIssues: false,
      verbose: false,
      checkUrls: false,
      ...options
    };
  }

  /**
   * Validate a single scenario file
   */
  async validateFile(filePath) {
    const result = new ValidationResult(filePath);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        result.addError(`File not found: ${filePath}`);
        return result;
      }

      // Parse JSON
      const content = fs.readFileSync(filePath, 'utf8');
      let scenario;
      
      try {
        scenario = JSON.parse(content);
      } catch (parseError) {
        result.addError(`Invalid JSON: ${parseError.message}`);
        return result;
      }

      // Schema validation
      await this.validateSchema(scenario, result);
      
      // Content validation
      await this.validateContent(scenario, result);
      
      // Quality checks
      await this.validateQuality(scenario, result);

      if (this.options.checkUrls) {
        await this.validateUrls(scenario, result);
      }

    } catch (error) {
      result.addError(`Validation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Validate schema compliance
   */
  async validateSchema(scenario, result) {
    // Check required fields
    for (const field of SCENARIO_SCHEMA.required) {
      if (!scenario.hasOwnProperty(field)) {
        result.addError(`Missing required field: ${field}`, field);
      } else if (scenario[field] === null || scenario[field] === undefined) {
        result.addError(`Required field cannot be null: ${field}`, field);
      }
    }

    // Check field types
    for (const [field, expectedType] of Object.entries(SCENARIO_SCHEMA.types)) {
      if (scenario.hasOwnProperty(field) && scenario[field] !== null) {
        const value = scenario[field];
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        
        if (Array.isArray(expectedType)) {
          // Enum validation
          if (!expectedType.includes(value)) {
            result.addError(`Invalid value for ${field}. Expected one of: ${expectedType.join(', ')}`, field);
          }
        } else if (expectedType !== actualType) {
          result.addError(`Invalid type for ${field}. Expected ${expectedType}, got ${actualType}`, field);
        }
      }
    }
  }

  /**
   * Validate content structure and completeness
   */
  async validateContent(scenario, result) {
    // Validate ID format
    if (scenario.id && !/^[a-z0-9-]+$/.test(scenario.id)) {
      result.addError('ID should only contain lowercase letters, numbers, and hyphens', 'id');
    }

    // Validate title length
    if (scenario.title) {
      if (scenario.title.length < 10) {
        result.addWarning('Title is too short (minimum 10 characters)', 'title');
      }
      if (scenario.title.length > 100) {
        result.addWarning('Title is too long (maximum 100 characters)', 'title');
      }
    }

    // Validate description
    if (scenario.description) {
      if (scenario.description.length < 50) {
        result.addWarning('Description is too short (minimum 50 characters)', 'description');
      }
      if (scenario.description.length > 500) {
        result.addSuggestion('Consider breaking long description into smaller parts', 'description');
      }
    }

    // Validate action steps
    if (scenario.actionSteps && Array.isArray(scenario.actionSteps)) {
      if (scenario.actionSteps.length === 0) {
        result.addError('At least one action step is required', 'actionSteps');
      } else {
        scenario.actionSteps.forEach((step, index) => {
          if (!step.id || !step.title || !step.description) {
            result.addError(`Action step ${index + 1} is missing required fields`, 'actionSteps');
          }
          if (!step.order || step.order !== index + 1) {
            result.addWarning(`Action step ${index + 1} order should be ${index + 1}`, 'actionSteps');
          }
        });
      }
    }

    // Validate sources
    if (scenario.sources && Array.isArray(scenario.sources)) {
      if (scenario.sources.length === 0) {
        result.addError('At least one source is required', 'sources');
      } else {
        scenario.sources.forEach((source, index) => {
          if (!source.id || !source.title || !source.url) {
            result.addError(`Source ${index + 1} is missing required fields`, 'sources');
          }
          if (source.url && !this.isValidUrl(source.url)) {
            result.addError(`Source ${index + 1} has invalid URL format`, 'sources');
          }
        });
      }
    }

    // Validate keywords
    if (scenario.keywords && Array.isArray(scenario.keywords)) {
      if (scenario.keywords.length < 3) {
        result.addSuggestion('Add more keywords for better searchability (minimum 3 recommended)', 'keywords');
      }
    }
  }

  /**
   * Validate content quality
   */
  async validateQuality(scenario, result) {
    // Check for placeholder text
    const placeholderPatterns = [
      /lorem ipsum/i,
      /placeholder/i,
      /TODO:/i,
      /FIXME:/i,
      /\[.*\]/g
    ];

    const textFields = ['title', 'description'];
    textFields.forEach(field => {
      if (scenario[field]) {
        placeholderPatterns.forEach(pattern => {
          if (pattern.test(scenario[field])) {
            result.addError(`${field} contains placeholder text`, field);
          }
        });
      }
    });

    // Check for proper sentence structure
    if (scenario.description && !scenario.description.trim().endsWith('.')) {
      result.addSuggestion('Description should end with proper punctuation', 'description');
    }

    // Validate last updated date
    if (scenario.lastUpdated) {
      const lastUpdated = new Date(scenario.lastUpdated);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      if (lastUpdated < threeMonthsAgo) {
        result.addWarning('Content may be outdated (last updated > 3 months ago)', 'lastUpdated');
      }
    }
  }

  /**
   * Validate URLs in sources
   */
  async validateUrls(scenario, result) {
    if (scenario.sources && Array.isArray(scenario.sources)) {
      for (const [index, source] of scenario.sources.entries()) {
        if (source.url) {
          try {
            // In a real implementation, this would make HTTP requests
            // For now, just check government domains
            if (!source.url.includes('gov.in') && !source.url.includes('nic.in')) {
              result.addWarning(`Source ${index + 1} URL is not from a government domain`, 'sources');
            }
          } catch (error) {
            result.addError(`Cannot validate URL for source ${index + 1}: ${error.message}`, 'sources');
          }
        }
      }
    }
  }

  /**
   * Check if URL format is valid
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Validate multiple files or directories
   */
  async validatePath(inputPath) {
    const results = [];

    if (fs.statSync(inputPath).isDirectory()) {
      // Find all JSON files in directory
      const pattern = path.join(inputPath, '**/*.json');
      const files = glob.sync(pattern);
      
      for (const file of files) {
        const result = await this.validateFile(file);
        results.push(result);
      }
    } else if (path.extname(inputPath) === '.json') {
      // Single file
      const result = await this.validateFile(inputPath);
      results.push(result);
    } else {
      throw new Error('Invalid input path. Must be a JSON file or directory containing JSON files.');
    }

    return results;
  }

  /**
   * Generate summary report
   */
  generateSummary(results) {
    const totalFiles = results.length;
    const validFiles = results.filter(r => r.isValid).length;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

    return {
      totalFiles,
      validFiles,
      invalidFiles: totalFiles - validFiles,
      totalErrors,
      totalWarnings,
      averageScore: Math.round(avgScore * 100) / 100,
      passRate: Math.round((validFiles / totalFiles) * 10000) / 100
    };
  }
}

/**
 * Command line interface
 */
async function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0] || './data/scenarios';
  const options = {
    fixIssues: args.includes('--fix'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    checkUrls: args.includes('--check-urls')
  };

  console.log('🔍 MyRight Data Validator');
  console.log('==========================');
  console.log(`Validating: ${inputPath}`);
  console.log(`Options: ${JSON.stringify(options, null, 2)}\n`);

  try {
    const validator = new ScenarioValidator(options);
    const results = await validator.validatePath(inputPath);

    // Print individual results
    results.forEach(result => {
      const report = result.getReport();
      console.log(`\n📄 ${path.relative(process.cwd(), report.filePath)}`);
      console.log(`   Status: ${report.isValid ? '✅ Valid' : '❌ Invalid'}`);
      console.log(`   Score: ${report.score}/100`);
      
      if (report.errors.length > 0) {
        console.log(`   ❌ Errors (${report.errors.length}):`);
        report.errors.forEach(error => {
          console.log(`      • ${error.message} ${error.field ? `[${error.field}]` : ''}`);
        });
      }
      
      if (report.warnings.length > 0 && options.verbose) {
        console.log(`   ⚠️  Warnings (${report.warnings.length}):`);
        report.warnings.forEach(warning => {
          console.log(`      • ${warning.message} ${warning.field ? `[${warning.field}]` : ''}`);
        });
      }
      
      if (report.suggestions.length > 0 && options.verbose) {
        console.log(`   💡 Suggestions (${report.suggestions.length}):`);
        report.suggestions.forEach(suggestion => {
          console.log(`      • ${suggestion.message} ${suggestion.field ? `[${suggestion.field}]` : ''}`);
        });
      }
    });

    // Print summary
    const summary = validator.generateSummary(results);
    console.log('\n📊 Validation Summary');
    console.log('=====================');
    console.log(`Files processed: ${summary.totalFiles}`);
    console.log(`Valid files: ${summary.validFiles} (${summary.passRate}%)`);
    console.log(`Invalid files: ${summary.invalidFiles}`);
    console.log(`Total errors: ${summary.totalErrors}`);
    console.log(`Total warnings: ${summary.totalWarnings}`);
    console.log(`Average score: ${summary.averageScore}/100`);

    // Exit with error code if validation failed
    if (summary.totalErrors > 0) {
      console.log('\n❌ Validation failed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ Validation completed successfully');
      process.exit(0);
    }

  } catch (error) {
    console.error(`\n❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ScenarioValidator, ValidationResult };