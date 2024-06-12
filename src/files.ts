export interface FileOrDirectory {
  id: number
  name: string
  isDirectory: boolean
  parentDirectoryId: number | undefined
}

export function generateFiles(numFiles: number): FileOrDirectory[] {
  const files: FileOrDirectory[] = []

  function generateFile(id: number, parentId: number | undefined = undefined): FileOrDirectory {
    const isDirectory = Math.random() > 0.5 // Randomly choose file or directory
    const name = isDirectory ? `Directory ${id}` : `File ${id}`

    return {
      id,
      name,
      isDirectory: isDirectory,
      parentDirectoryId: parentId
    }
  }

  // Generate root directory
  files.push(generateFile(1))

  // Generate remaining files with some nesting
  for (let i = 2; i < numFiles; i++) {
    const potentialParent = files.at(Math.floor(Math.random() * files.length))

    files.push(generateFile(i, potentialParent?.isDirectory ? potentialParent.id : undefined))
  }

  return files
}
