/**
 * 环境变量类型定义。
 * 如需新增变量，只需在ProcessEnv接口中添加字段即可。
 * 注意：环境变量读取始终是字符串类型，如果需要其他类型，需要在代码中进行转换。
 */
interface ProcessEnv {
  /**
   * 示例：在代码中已使用的常量键
   * 使用：console.log(process.env.CONSTANT)
   */
  readonly CONSTANT: string;

  /**
   * 示例：后端 API 基础地址
   * 使用：http.fetch(`${process.env.API_BASE_URL}/...`)
   */
  readonly API_BASE_URL: string;
}
