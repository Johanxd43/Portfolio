import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';
import * as comlink from 'comlink';

let model: any = null;
let isInitialized = false;
let memoryUsage = 0;
const MAX_MEMORY_USAGE = 256 * 1024 * 1024; // Reducido a 256MB
const CLEANUP_INTERVAL = 30000; // Reducido a 30 segundos
const MAX_BATCH_SIZE = 32;

const memoryManager = {
  async trackMemory() {
    const info = tf.memory();
    memoryUsage = info.numBytes;
    
    if (memoryUsage > MAX_MEMORY_USAGE * 0.8) { // Cleanup preventivo al 80%
      await this.cleanup();
    }
  },

  async cleanup() {
    try {
      if (model) {
        await model.dispose();
        model = null;
      }
      
      // Limpieza agresiva de memoria
      tf.disposeVariables();
      tf.engine().endScope();
      await tf.ready(); // Esperar a que TF esté listo
      tf.engine().startScope();
      
      // Forzar recolección de basura
      if (global.gc) {
        global.gc();
      }
      
      isInitialized = false;
      memoryUsage = 0;
      
      // Reinicializar después de la limpieza
      await api.initialize();
    } catch (error) {
      console.error('Memory cleanup error:', error);
      throw new Error('Memory cleanup failed');
    }
  }
};

const api = {
  async initialize() {
    if (isInitialized) return true;

    try {
      await tf.ready();
      tf.engine().startScope();
      
      // Configurar TF para usar menos memoria
      tf.setBackend('webgl');
      tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
      
      model = await load({
        modelUrl: 'https://tfhub.dev/tensorflow/universal-sentence-encoder/1',
        fromTFHub: true
      });
      
      isInitialized = true;

      // Configurar limpieza periódica
      setInterval(async () => {
        await memoryManager.trackMemory();
      }, CLEANUP_INTERVAL);

      return true;
    } catch (error) {
      console.error('Model initialization error:', error);
      return false;
    }
  },

  async processText(text: string) {
    if (!isInitialized) {
      await this.initialize();
    }

    try {
      await memoryManager.trackMemory();

      // Procesar en batches si el texto es muy largo
      const chunks = text.match(/.{1,1000}/g) || [text];
      const embeddings = [];
      
      for (let i = 0; i < chunks.length; i += MAX_BATCH_SIZE) {
        const batch = chunks.slice(i, i + MAX_BATCH_SIZE);
        const batchEmbeddings = await model.embed(batch);
        embeddings.push(...await this.optimizeEmbeddings(batchEmbeddings));
        tf.dispose(batchEmbeddings);
      }
      
      return embeddings;
    } catch (error) {
      console.error('Text processing error:', error);
      await memoryManager.cleanup();
      throw error;
    }
  },

  async optimizeEmbeddings(embeddings: tf.Tensor) {
    return tf.tidy(() => {
      try {
        const normalized = tf.div(
          tf.sub(embeddings, tf.mean(embeddings)),
          tf.add(tf.std(embeddings), 1e-8)
        );
        
        const [, dim] = normalized.shape;
        const targetDim = Math.min(64, dim); // Reducido a 64 dimensiones
        
        const { u } = tf.linalg.svd(normalized);
        const reduced = u.slice([0, 0], [-1, targetDim]);
        
        return reduced.arraySync();
      } catch (error) {
        console.error('Embedding optimization error:', error);
        throw error;
      }
    });
  }
};

comlink.expose(api);