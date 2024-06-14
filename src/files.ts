export interface FileOrDirectory {
  id: number
  name: string
  isDirectory: boolean
  parentDirectoryId: number | undefined
}

export function generateFiles(totalNumberOfFiles: number): FileOrDirectory[] {
  const files: FileOrDirectory[] = []

  function generateFile(id: number, parentId?: number, directory?: boolean): FileOrDirectory {
    const isDirectory = directory ?? Math.random() > 0.5 // Randomly choose file or directory
    const name = isDirectory ? `Folder ${id}` : `File ${id}`

    return {
      id,
      name,
      isDirectory: isDirectory,
      parentDirectoryId: parentId
    }
  }

  // Let's start off by generating a directory
  const directory = generateFile(1, undefined, true)
  files.push(directory)

  const directoriesGenerated: FileOrDirectory[] = [directory]
  let rootFileCount = 1

  // Generate remaining files with some nesting
  for (let i = 2; i < totalNumberOfFiles; i++) {
    // If there are too many files at the root, let's ensure new files are placed in an existing directory
    const hasTooManyRootFiles = rootFileCount >= totalNumberOfFiles / 5
    const pickFileFrom = hasTooManyRootFiles ? directoriesGenerated : files

    const potentialParent = pickFileFrom.at(Math.floor(Math.random() * pickFileFrom.length))
    const file = generateFile(i, potentialParent?.isDirectory ? potentialParent.id : undefined)

    if (!file.parentDirectoryId) {
      rootFileCount += 1
    }
    if (file.isDirectory) {
      directoriesGenerated.push(file)
    }

    files.push(file)
  }

  return files
}
