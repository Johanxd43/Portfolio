class AnalyticsService {
  private static instance: AnalyticsService;
  private events: any[] = [];

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public trackEvent(eventName: string, data: any): void {
    this.events.push({
      eventName,
      data,
      timestamp: new Date()
    });
  }

  public getEvents(): any[] {
    return this.events;
  }

  public clearEvents(): void {
    this.events = [];
  }
}

export { AnalyticsService };
export default AnalyticsService;