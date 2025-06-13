class ErrorService {
  private static instance: ErrorService;
  private errors: Error[] = [];

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public logError(error: Error, severity: string = 'medium', context?: any): void {
    console.error(`[${severity}]`, error, context);
    this.errors.push(error);
  }

  public getErrors(): Error[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

export { ErrorService };
export default ErrorService;