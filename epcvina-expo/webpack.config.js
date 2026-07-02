const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons'],
      },
    },
    argv
  )

  // Add Bundle Analyzer plugin in production
  if (env.mode === 'production' && process.env.ANALYZE) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,
      })
    )
  }

  return config
}
