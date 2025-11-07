/**
 * 错误处理工具
 * 用于监控和处理HTTP错误，提高SEO表现
 */

// 记录错误的函数
export function logHttpError(statusCode: number, url: string, userAgent?: string): void {
  // 在生产环境中，这里可以集成错误监控服务如Sentry等
  console.warn(`HTTP ${statusCode} error for URL: ${url}`, {
    userAgent,
    timestamp: new Date().toISOString()
  });
}

// 检查是否为客户端错误(400-499)
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

// 检查是否为服务器错误(500-599)
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}

// 生成SEO友好的错误页面元数据
export function generateErrorMetadata(statusCode: number): { 
  title: string; 
  description: string;
} {
  switch (statusCode) {
    case 400:
      return {
        title: "请求错误 - 页面无法显示",
        description: "由于请求格式错误，无法处理您的请求。请检查URL是否正确。"
      };
    case 401:
      return {
        title: "未授权访问",
        description: "您需要登录才能访问此页面。"
      };
    case 403:
      return {
        title: "访问被拒绝",
        description: "您没有权限访问此页面。"
      };
    case 404:
      return {
        title: "页面未找到",
        description: "抱歉，您访问的页面不存在。"
      };
    case 429:
      return {
        title: "请求过于频繁",
        description: "您的请求过于频繁，请稍后再试。"
      };
    default:
      return {
        title: "页面无法访问",
        description: "发生了一个错误，无法显示页面内容。"
      };
  }
}