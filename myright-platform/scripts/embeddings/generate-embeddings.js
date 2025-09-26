#!/usr/bin/env node

/**
 * Embedding Generation Script for MyRight Legal Scenarios
 * 
 * This script generates semantic embeddings for legal scenario content using
 * sentence-transformers models. Embeddings are used for semantic search.
 * 
 * Features:
 * - Generate embeddings for titles, descriptions, and combined text
 * - Batch processing for efficiency
 * - Caching to avoid regeneration
 * - Multiple embedding strategies
 * 
 * Usage:
 *   npm run embeddings:generate [input-dir] [output-dir]
 *   npm run embeddings:generate -- --model all-MiniLM-L6-v2
 *   npm run embeddings:generate -- --force  # Regenerate all
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');

/**
 * Mock embedding service for development
 * In production, this would use actual sentence-transformers
 */
class EmbeddingGenerator {
  constructor(options = {}) {
    this.options = {
      modelName: 'sentence-transformers/all-MiniLM-L6-v2',
      dimensions: 384,
      batchSize: 32,
      force: false,
      ...options
    };
    
    this.cache = new Map();
    this.loadCache();
  }

  /**
   * Load existing embeddings cache
   */
  loadCache() {
    try {
      const cachePath = path.join(process.cwd(), '.embeddings-cache.json');
      if (fs.existsSync(cachePath)) {
        const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        this.cache = new Map(Object.entries(cacheData));
        console.log(`📋 Loaded ${this.cache.size} cached embeddings`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load embeddings cache:', error.message);
    }
  }

  /**
   * Save embeddings cache
   */
  saveCache() {
    try {
      const cachePath = path.join(process.cwd(), '.embeddings-cache.json');
      const cacheData = Object.fromEntries(this.cache);
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`💾 Saved ${this.cache.size} embeddings to cache`);
    } catch (error) {
      console.warn('⚠️  Could not save embeddings cache:', error.message);
    }
  }

  /**
   * Generate hash for text to use as cache key
   */
  getTextHash(text, modelName) {
    return crypto.createHash('md5').update(`${modelName}:${text}`).digest('hex');
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text) {
    if (!text || text.trim().length === 0) {
      return new Array(this.options.dimensions).fill(0);
    }

    const hash = this.getTextHash(text, this.options.modelName);
    
    // Check cache first
    if (!this.options.force && this.cache.has(hash)) {
      return this.cache.get(hash);
    }

    // Generate new embedding (mocked for development)
    const embedding = this.generateMockEmbedding(text);
    
    // Cache the result
    this.cache.set(hash, embedding);
    
    return embedding;
  }

  /**
   * Generate mock embedding based on text content
   * In production, this would call actual sentence-transformers
   */
  generateMockEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(this.options.dimensions);
    
    // Create a deterministic but realistic embedding
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i);
    }
    
    // Use seeded random for consistent results
    const random = this.seededRandom(seed);
    
    for (let i = 0; i < this.options.dimensions; i++) {
      // Generate values between -1 and 1 with normal distribution
      const u1 = random();
      const u2 = random();
      const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      // Scale and adjust based on text characteristics
      let value = normal * 0.3;
      
      // Add some semantic meaning based on keywords
      if (words.includes('salary') || words.includes('wages')) value += 0.1;
      if (words.includes('employment') || words.includes('work')) value += 0.05;
      if (words.includes('legal') || words.includes('law')) value -= 0.05;
      
      embedding[i] = Math.max(-1, Math.min(1, value));
    }
    
    // Normalize to unit length
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  /**
   * Seeded random number generator for consistent results
   */
  seededRandom(seed) {
    let state = seed % 2147483647;
    if (state <= 0) state += 2147483646;
    
    return function() {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  /**
   * Generate embeddings for multiple texts in batches
   */
  async generateBatchEmbeddings(texts) {
    const embeddings = [];
    
    for (let i = 0; i < texts.length; i += this.options.batchSize) {
      const batch = texts.slice(i, i + this.options.batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i / this.options.batchSize) + 1}/${Math.ceil(texts.length / this.options.batchSize)}`);
      
      const batchEmbeddings = await Promise.all(
        batch.map(text => this.generateEmbedding(text))
      );
      
      embeddings.push(...batchEmbeddings);
    }
    
    return embeddings;
  }

  /**
   * Process a single scenario file
   */
  async processScenario(scenarioPath) {
    try {
      const content = fs.readFileSync(scenarioPath, 'utf8');
      const scenario = JSON.parse(content);
      
      console.log(`📄 Processing: ${scenario.title || scenario.id}`);
      
      // Prepare texts for embedding
      const texts = {
        title: scenario.title || '',
        description: scenario.description || '',
        combined: `${scenario.title || ''} ${scenario.description || ''}`.trim(),
        keywords: (scenario.keywords || []).join(' '),
        variations: (scenario.variations || []).join(' ')
      };
      
      // Generate embeddings
      const embeddings = {};
      for (const [key, text] of Object.entries(texts)) {
        if (text.trim().length > 0) {
          embeddings[key] = await this.generateEmbedding(text);
        }
      }
      
      return {
        scenarioId: scenario.id,
        scenarioPath,
        embeddings,
        metadata: {
          modelName: this.options.modelName,
          dimensions: this.options.dimensions,
          generatedAt: new Date().toISOString(),
          textLengths: Object.fromEntries(
            Object.entries(texts).map(([key, text]) => [key, text.length])
          )
        }
      };
      
    } catch (error) {
      console.error(`❌ Error processing ${scenarioPath}:`, error.message);
      return null;
    }
  }

  /**
   * Process all scenarios in a directory
   */
  async processDirectory(inputDir, outputDir) {
    const pattern = path.join(inputDir, '**/*.json');
    const files = glob.sync(pattern);
    
    console.log(`🔍 Found ${files.length} scenario files`);
    
    if (files.length === 0) {
      throw new Error('No JSON files found in input directory');
    }
    
    const results = [];
    const errors = [];
    
    for (const file of files) {
      try {
        const result = await this.processScenario(file);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        errors.push({ file, error: error.message });
      }
    }
    
    // Save embeddings
    if (results.length > 0) {
      await this.saveEmbeddings(results, outputDir);
    }
    
    // Save cache
    this.saveCache();
    
    return {
      processed: results.length,
      errors: errors.length,
      results,
      errors
    };
  }

  /**
   * Save embeddings to output directory
   */
  async saveEmbeddings(results, outputDir) {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save individual embedding files
    for (const result of results) {
      const outputFile = path.join(outputDir, `${result.scenarioId}.json`);
      const embeddingData = {
        scenarioId: result.scenarioId,
        embeddings: result.embeddings,
        metadata: result.metadata
      };
      
      fs.writeFileSync(outputFile, JSON.stringify(embeddingData, null, 2));
    }
    
    // Save combined embeddings file
    const combinedFile = path.join(outputDir, 'all-embeddings.json');
    const combinedData = {
      metadata: {
        totalScenarios: results.length,
        modelName: this.options.modelName,
        dimensions: this.options.dimensions,
        generatedAt: new Date().toISOString()
      },
      embeddings: Object.fromEntries(
        results.map(result => [result.scenarioId, result.embeddings])
      )
    };
    
    fs.writeFileSync(combinedFile, JSON.stringify(combinedData, null, 2));
    
    console.log(`💾 Saved embeddings for ${results.length} scenarios to ${outputDir}`);
  }
}

/**
 * Command line interface
 */
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || './data/scenarios';
  const outputDir = args[1] || './data/embeddings';
  
  const options = {
    modelName: args.find(arg => arg.startsWith('--model='))?.split('=')[1] || 'sentence-transformers/all-MiniLM-L6-v2',
    force: args.includes('--force'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    batchSize: parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1]) || 32
  };

  console.log('🤖 MyRight Embedding Generator');
  console.log('===============================');
  console.log(`Input directory: ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`Model: ${options.modelName}`);
  console.log(`Batch size: ${options.batchSize}`);
  console.log(`Force regenerate: ${options.force}\n`);

  try {
    const generator = new EmbeddingGenerator(options);
    const startTime = Date.now();
    
    const result = await generator.processDirectory(inputDir, outputDir);
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n📊 Generation Summary');
    console.log('====================');
    console.log(`Processed: ${result.processed} scenarios`);
    console.log(`Errors: ${result.errors} scenarios`);
    console.log(`Duration: ${duration} seconds`);
    
    if (result.errors > 0) {
      console.log('\n❌ Errors encountered:');
      result.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }
    
    if (result.processed > 0) {
      console.log('\n✅ Embeddings generated successfully');
      console.log(`📁 Output saved to: ${outputDir}`);
    }
    
    process.exit(result.errors > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(`\n❌ Generation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EmbeddingGenerator };