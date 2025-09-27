/**
 * EmbeddingService: Handles vector embedding generation.
 * This is a simplified version for now.
 */
export class EmbeddingService {
  private config: {
    modelName: string;
    dimensions: number;
    batchSize: number;
  };
  private isInitialized: boolean;

  constructor(config?: { modelName: string; dimensions: number; batchSize: number }) {
    this.config = config || {
      modelName: 'sentence-transformers/all-MiniLM-L6-v2',
      dimensions: 384,
      batchSize: 32
    };
    this.isInitialized = false;
  }

  async initialize(): Promise<void> {
    // Initialize the embedding model
    // This would load the actual model in a real implementation
    this.isInitialized = true;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isInitialized) {
      // Auto-initialize if not already done
      await this.initialize();
    }

    // Handle empty text
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    // Generate deterministic embedding based on text content
    // Make it more content-aware for better semantic differentiation
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    const embedding = new Array(this.config.dimensions).fill(0);
    
    // Create embedding based on word positions and character codes for more distinction
    for (let i = 0; i < words.length && i < 20; i++) {
      const word = words[i];
      if (!word) continue;
      const wordSeed = this.hashString(word + i);
      const wordRng = this.seedRandom(wordSeed);
      
      // Distribute word influence across embedding dimensions
      for (let j = 0; j < Math.min(50, this.config.dimensions); j++) {
        const dim = (i * 50 + j) % this.config.dimensions;
        embedding[dim] += wordRng() * (1.0 / (i + 1)); // Decay influence by position
      }
    }
    
    // Normalize the embedding
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1;
    return embedding.map(val => val / norm);
  }

  /**
   * Generate a hash from string for deterministic seeding
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Seeded random number generator for consistent embeddings
   */
  private seedRandom(seed: number): () => number {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i += this.config.batchSize) {
      const batch = texts.slice(i, i + this.config.batchSize);
      const batchEmbeddings = await Promise.all(
        batch.map(text => this.generateEmbedding(text))
      );
      embeddings.push(...batchEmbeddings);
    }

    return embeddings;
  }

  getModelInfo(): { name: string; dimensions: number } {
    return {
      name: this.config.modelName,
      dimensions: this.config.dimensions
    };
  }

  /**
   * Get the dimension of embedding vectors
   */
  getDimension(): number {
    return this.config.dimensions;
  }

  /**
   * Calculate cosine similarity between two embedding vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0;
      const bVal = b[i] ?? 0;
      dotProduct += aVal * bVal;
      normA += aVal * aVal;
      normB += bVal * bVal;
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Find the most similar embeddings to a query embedding
   */
  findMostSimilar(
    queryEmbedding: number[], 
    candidateEmbeddings: Array<{ id: string; vector: number[] }>, 
    limit: number
  ): Array<{ id: string; similarity: number }> {
    const similarities = candidateEmbeddings.map(candidate => ({
      id: candidate.id,
      similarity: this.cosineSimilarity(queryEmbedding, candidate.vector)
    }));

    // Sort by similarity (highest first) and return top results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}

