import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { debounce } from '../components/ChatBot/utils/debounce';
import { z } from 'zod';

interface AnalyticsEvent {
  id?: string;
  event_name: string;
  event_data: Record<string, unknown>;
  timestamp: string;
  user_id?: string;
  session_id?: string;
}

interface MetricRecord {
  metric_name: string;
  value: number;
  timestamp: string;
}

interface TimelineEntry {
  date: string;
  users: number;
  files: number;
  errors: number;
  avgProcessingTime: number;
}

interface UserDistributionEntry {
  type: string;
  value: number;
}

interface RecentActivity {
  id: string;
  type: string;
  user: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface DetailedMetrics {
  timelineData: TimelineEntry[];
  userDistribution: UserDistributionEntry[];
  errorRate: number;
}

// Schema validation
const eventSchema = z.object({
  event_name: z.string().min(1),
  event_data: z.record(z.unknown()),
  timestamp: z.string().datetime(),
  user_id: z.string().optional(),
  session_id: z.string().optional()
});

// Simple metrics tracking
class Metrics {
  private static metrics = {
    queueSize: 0,
    processingTimes: [] as number[],
    failedBatches: 0
  };

  static setQueueSize(size: number) {
    this.metrics.queueSize = size;
  }

  static addProcessingTime(time: number) {
    this.metrics.processingTimes.push(time);
    // Keep only last 100 measurements
    if (this.metrics.processingTimes.length > 100) {
      this.metrics.processingTimes.shift();
    }
  }

  static incrementFailedBatches() {
    this.metrics.failedBatches++;
  }

  static getMetrics() {
    const avgProcessingTime = this.metrics.processingTimes.length > 0
      ? this.metrics.processingTimes.reduce((a, b) => a + b, 0) / this.metrics.processingTimes.length
      : 0;

    return {
      queueSize: this.metrics.queueSize,
      averageProcessingTime: avgProcessingTime,
      failedBatches: this.metrics.failedBatches
    };
  }
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private supabase!: SupabaseClient;
  private refreshInterval: number = 5 * 60 * 1000; // 5 minutos
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private refreshTimer: NodeJS.Timeout | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private readonly MAX_BATCH_SIZE = 100;
  private readonly MIN_BATCH_SIZE = 10;
  private currentBatchSize = 50;
  private readonly BATCH_INTERVAL = 5000; // 5 seconds
  private readonly MAX_RETRY_ATTEMPTS = 5;

  constructor() {
    if (AnalyticsService.instance) {
      return AnalyticsService.instance;
    }
    this.initializeSupabase();
    this.startRefreshTimer();
    this.initializeBatchProcessing();
    AnalyticsService.instance = this;
  }

  private adjustBatchSize() {
    const queueLength = this.eventQueue.length;
    if (queueLength > this.MAX_BATCH_SIZE) {
      this.currentBatchSize = this.MAX_BATCH_SIZE;
    } else if (queueLength < this.MIN_BATCH_SIZE) {
      this.currentBatchSize = this.MIN_BATCH_SIZE;
    } else {
      this.currentBatchSize = queueLength;
    }
    Metrics.setQueueSize(queueLength);
  }

  private async insertEventsBatch(batch: AnalyticsEvent[], attempt = 1): Promise<void> {
    const startTime = Date.now();
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert(batch);

      if (error) throw error;

      const duration = (Date.now() - startTime) / 1000;
      Metrics.addProcessingTime(duration);
    } catch (error) {
      console.error(`Batch insert failed on attempt ${attempt}:`, error);
      Metrics.incrementFailedBatches();

      if (attempt < this.MAX_RETRY_ATTEMPTS) {
        const delay = Math.min(Math.pow(2, attempt) * 1000, 30000); // Max 30s delay
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.insertEventsBatch(batch, attempt + 1);
      } else {
        console.error('Max retry attempts reached, discarding batch');
        throw error;
      }
    }
  }

  private initializeBatchProcessing() {
    this.processBatch = debounce(async () => {
      if (this.eventQueue.length === 0) return;

      this.adjustBatchSize();
      const batch = this.eventQueue.splice(0, this.currentBatchSize);

      try {
        await this.insertEventsBatch(batch);
      } catch (error) {
        console.error('Batch processing error:', error);
        this.eventQueue.unshift(...batch);
      }
    }, this.BATCH_INTERVAL);
  }

  private startRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.refreshTimer = setInterval(() => {
      this.cache.clear();
    }, this.refreshInterval);
  }

  private initializeSupabase() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  public cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    // Process any remaining events in the queue
    if (this.eventQueue.length > 0) {
      this.processBatch();
    }
    this.cache.clear();
  }

  private validateEvent(event: AnalyticsEvent): boolean {
    try {
      eventSchema.parse(event);
      return true;
    } catch (err) {
      console.error('Event validation failed:', err);
      return false;
    }
  }

  async getAnalytics() {
    try {
      // Verificar caché
      const cached = this.getFromCache('analytics');
      if (cached) return cached;

      const [metrics, events] = await Promise.all([
        this.supabase
          .from('analytics_metrics')
          .select('*')
          .order('timestamp', { ascending: false })
          .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .limit(1000),
        this.supabase
          .from('analytics_events')
          .select('*')
          .order('timestamp', { ascending: false })
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(5000)
      ]);

      if (metrics.error) {
        throw metrics.error;
      }

      if (events.error) {
        throw events.error;
      }

      const processedData = this.processAnalyticsData(metrics.data, events.data);
      this.setCache('analytics', processedData);
      return processedData;

    } catch (error) {
      console.error('Analytics fetch error:', error);
      throw error;
    }
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.refreshInterval) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private processAnalyticsData(metrics: MetricRecord[], events: AnalyticsEvent[]) {
    const activeUsers = metrics.find(m => m.metric_name === 'active_users')?.value || 0;
    const processedFiles = metrics.find(m => m.metric_name === 'processed_files')?.value || 0;
    const avgProcessingTime = metrics.find(m => m.metric_name === 'average_processing_time')?.value || 0;

    const { timelineData, userDistribution, errorRate } = this.processDetailedMetrics(events);

    return {
      activeUsers,
      processedFiles,
      averageProcessingTime: avgProcessingTime,
      successRate: this.calculateSuccessRate(events),
      errorRate,
      timelineData,
      userDistribution,
      recentActivity: this.getRecentActivity(events)
    };
  }

  private processDetailedMetrics(events: AnalyticsEvent[]): DetailedMetrics {
    const groupedByDay: Record<string, {
      users: Set<string | undefined>;
      files: number;
      errors: number;
      processingTime: number[];
    }> = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          users: new Set(),
          files: 0,
          errors: 0,
          processingTime: []
        };
      }
      acc[date].users.add(event.user_id);
      if (event.event_name === 'file_processed') {
        acc[date].files++;
        if (event.event_data?.error) {
          acc[date].errors++;
        }
        if (typeof event.event_data?.processing_time === 'number') {
          acc[date].processingTime.push(event.event_data.processing_time);
        }
      }
      return acc;
    }, {} as Record<string, {
      users: Set<string | undefined>;
      files: number;
      errors: number;
      processingTime: number[];
    }>);

    const timelineData: TimelineEntry[] = Object.entries(groupedByDay).map(([date, data]) => ({
      date,
      users: data.users.size,
      files: data.files,
      errors: data.errors,
      avgProcessingTime: data.processingTime.length > 0
        ? data.processingTime.reduce((a, b) => a + b, 0) / data.processingTime.length
        : 0
    }));

    const userDistribution = this.processUserDistribution(events);
    const errorRate = this.calculateErrorRate(events);

    return { timelineData, userDistribution, errorRate };
  }

  private processUserDistribution(events: AnalyticsEvent[]): UserDistributionEntry[] {
    const userTypes = events.reduce<Record<string, number>>((acc, event) => {
      const type = (event.event_data.user_type as string) || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(userTypes).map(([type, value]) => ({
      type,
      value
    }));
  }

  private calculateSuccessRate(events: AnalyticsEvent[]): number {
    const processedEvents = events.filter(e => e.event_name === 'file_processed');
    const successfulEvents = processedEvents.filter(e => e.event_data.success);
    return processedEvents.length > 0
      ? (successfulEvents.length / processedEvents.length) * 100
      : 0;
  }

  private calculateErrorRate(events: AnalyticsEvent[]): number {
    const processedEvents = events.filter(e => e.event_name === 'file_processed');
    const errorEvents = processedEvents.filter(e => e.event_data.error);
    return processedEvents.length > 0
      ? (errorEvents.length / processedEvents.length) * 100
      : 0;
  }

  private getRecentActivity(events: AnalyticsEvent[]): RecentActivity[] {
    return events
      .slice(0, 10)
      .map(event => ({
        id: String(event.id),
        type: event.event_name,
        user: event.user_id ?? '',
        timestamp: event.timestamp,
        details: event.event_data
      }));
  }

  async trackEvent(eventName: string, data: Record<string, unknown>) {
    if (!this.supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        event_data: data,
        timestamp: new Date().toISOString()
      };

      if (!this.validateEvent(event)) {
        console.error('Invalid event data');
        return;
      }

      this.eventQueue.push(event);
      this.events.push(event);

      if (this.eventQueue.length >= this.currentBatchSize) {
        await this.processBatch();
      }
    } catch (error) {
      console.error('Event tracking error:', error);
    }
  }
}