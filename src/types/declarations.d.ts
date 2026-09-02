declare module 'multiple-cucumber-html-reporter' {
  interface ReportOptions {
    jsonDir: string;
    reportPath: string;
    metadata?: {
      browser?: {
        name?: string;
        version?: string;
      };
      device?: string;
      platform?: {
        name?: string;
        version?: string;
      };
    };
    customData?: {
      title?: string;
      data?: Array<{ label: string; value: string }>;
    };
    pageTitle?: string;
    reportName?: string;
    displayDuration?: boolean;
    displayReportTime?: boolean;
    [key: string]: any;
  }

  export function generate(options: ReportOptions): void;
}
