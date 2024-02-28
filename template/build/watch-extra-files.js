// Allows restarting dev server when data file changes
export default (filePaths = [], callback) => {
  return {
    name: 'watch-extra-files',
    configureServer(server) {
      const handleFileChange = (file) => {
        if (filePaths.includes(file)) {
          callback(file, server)
        }
      }
      server.watcher.add(filePaths)
      server.watcher.on('add', handleFileChange)
      server.watcher.on('change', handleFileChange)
      server.watcher.on('unlink', handleFileChange)
    }
  }
}
