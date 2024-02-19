export default (filePaths = []) => {
  return {
    name: 'watch-extra-files',
    configureServer(server) {
      const handleFileChange = (file) => {
        if (filePaths.includes(file)) {
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.add(filePaths)
      server.watcher.on('add', handleFileChange)
      server.watcher.on('change', handleFileChange)
      server.watcher.on('unlink', handleFileChange)
    }
  }
}
