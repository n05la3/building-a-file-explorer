import type { FileOrDirectory } from '@/files'
import { computed, readonly, type ComputedRef, type Ref } from 'vue'

export type Directory = FileOrDirectory & { children?: FileOrDirectory[] }
type FlatDirectory = Map<number, Directory>

/**
 * Constructs a flat directory structure containing all directories and the files/subdirectories in them
 * Preferring this flat structure to a recursive one because it makes lookup easier and faster
 * @param files The files from which to build the structure
 */
function buildFileStructure(files: FileOrDirectory[]) {
  const flatDirectory: FlatDirectory = new Map()
  const rootDirectory: FileOrDirectory[] = []

  for (const file of files) {
    if (file.isDirectory) {
      flatDirectory.set(file.id, {
        ...file,
        children: files.filter(({ parentDirectoryId }) => parentDirectoryId === file.id)
      })
    }

    if (!file.parentDirectoryId) {
      rootDirectory.push(file)
    }
  }

  return {
    flatDirectory,
    rootDirectory
  }
}

function buildPathToRoot(flatDirectory: FlatDirectory, directoryId: number, paths: Directory[]) {
  const directory = flatDirectory.get(directoryId)
  if (directory) {
    paths.push(directory)
  }

  if (directory?.parentDirectoryId) {
    buildPathToRoot(flatDirectory, directory.parentDirectoryId, paths)
  }

  return paths
}

export function useFileOrDirectoryStructure(
  files: Ref<FileOrDirectory[]>,
  currentDirectoryId: ComputedRef<number | undefined>
) {
  const directoryStructure = computed(() => buildFileStructure(files.value))
  const currentDirectoryPathToRoot: Record<string, Directory[] | undefined> = {}

  function isInDirectory(directoryId: number, filename?: string): boolean {
    if (!filename) {
      return true
    }

    const needle = filename?.toLowerCase()
    if (!directoryStructure.value.flatDirectory.get(directoryId)) {
      return false
    }

    const directory = directoryStructure.value.flatDirectory.get(directoryId)
    if (needle && directory?.name.toLowerCase().includes(needle)) {
      return true
    }

    if (!directory?.children) {
      return false
    }

    if (needle) {
      const matchFoundInChildren = directory.children.some(
        (file) => !needle || file.name.toLowerCase().includes(needle)
      )
      if (matchFoundInChildren) {
        return true
      }
    }

    const directoriesInChildren = directory.children.filter(({ isDirectory }) => isDirectory)

    for (const directory of directoriesInChildren) {
      if (isInDirectory(directory.id, needle)) {
        return true
      }
    }

    return false
  }

  return {
    itemsAtDirectory: readonly(
      computed(() => {
        let directoryHierarchy: Directory[] = []
        let currentDirectory: Directory | undefined = undefined

        if (!currentDirectoryId.value) {
          return {
            files: directoryStructure.value.rootDirectory,
            pathToRoot: directoryHierarchy
          }
        }
        if (!directoryStructure.value.flatDirectory.get(currentDirectoryId.value)) {
          return {
            files: [],
            pathToRoot: directoryHierarchy
          }
        }

        // Builds the path structure in the form of a an array containing all the directories.
        // It only builds this structure if the directory is visited and saves it so that when
        // the path is visited the saved version is used instead.
        const path = currentDirectoryPathToRoot[currentDirectoryId.value]
        if (path) {
          directoryHierarchy = path
        } else {
          directoryHierarchy = buildPathToRoot(
            directoryStructure.value.flatDirectory,
            currentDirectoryId.value,
            []
          )
          currentDirectoryPathToRoot[currentDirectoryId.value] = directoryHierarchy
        }

        currentDirectory = directoryStructure.value.flatDirectory.get(currentDirectoryId.value)

        return {
          files: currentDirectory?.children ?? [],
          pathToRoot: directoryHierarchy.slice().reverse()
        }
      })
    ),
    isInDirectory
  }
}
