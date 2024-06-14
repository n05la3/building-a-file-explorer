<script setup lang="ts">
import FileItem from '@/components/file-item.vue'
import { generateFiles, type FileOrDirectory } from '@/files'
import { computed, ref } from 'vue'
import { useFileOrDirectoryStructure } from '@/composables/file-or-directory'
import { useRouter, RouterLink } from 'vue-router'

const props = defineProps<{
  id?: string
}>()

const filter = ref('')
const files = ref(generateFiles(100))

const currentDirectoryId = computed(() => (props.id ? Number(props.id) : undefined))
const { itemsAtDirectory: currentDirectory, isInDirectory } = useFileOrDirectoryStructure(
  files,
  currentDirectoryId
)

const filteredFiles = computed(() =>
  currentDirectory.value.files.filter((file) =>
    file.isDirectory
      ? isInDirectory(file.id, filter.value)
      : file.name.toLowerCase().includes(filter.value.toLowerCase())
  )
)

const router = useRouter()
function handleFileClick(file: FileOrDirectory) {
  if (!file.isDirectory) {
    console.error('File opening is not implemented yet')
    return
  }

  router.push({ name: 'home', params: { id: file.id } })
}

function handleDragStart(event: DragEvent, file: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  event.dataTransfer!.setData('moved-item', JSON.stringify(file))
}

function moveFile(draggedItemId: number, newFolderId: number) {
  files.value = files.value.map((file) =>
    file.id === draggedItemId
      ? {
          ...file,
          parentDirectoryId: newFolderId
        }
      : file
  )
}

function handleDrop(event: DragEvent, file: FileOrDirectory) {
  const draggedItemData = event.dataTransfer?.getData('moved-item')
  if (!draggedItemData) {
    return
  }
  const draggedItem = JSON.parse(draggedItemData) as FileOrDirectory

  const isDroppingToSameFolder = file.id === draggedItem.id
  if (isDroppingToSameFolder || !file.isDirectory) {
    return
  }
  moveFile(draggedItem.id, file.id)
}
</script>

<template>
  <div class="main-container">
    <div class="search-container">
      <input v-model="filter" type="text" class="search-field" placeholder="Search file" />
    </div>
    <div>
      <div class="breadcrumb">
        <router-link :to="{ name: 'home' }"> Home </router-link>
        <span v-if="currentDirectory.pathToRoot.length > 0"> / </span>
        <template v-for="(file, index) in currentDirectory.pathToRoot" :key="file.id">
          <router-link :to="{ name: 'home', params: { id: file.id } }" class="link">
            {{ file.name }}
          </router-link>
          <span v-if="index !== currentDirectory.pathToRoot.length - 1"> / </span>
        </template>
      </div>
      <div v-if="filteredFiles.length === 0" class="no-files outline-container">
        No files in this directory
      </div>
      <div v-else class="grid-container outline-container">
        <!-- @dragover.prevent is needed to register the @drop event -->
        <file-item
          v-for="file in filteredFiles"
          :key="file.id"
          :is-directory="file.isDirectory"
          :name="file.name"
          draggable="true"
          @dragover.prevent
          @dragstart="handleDragStart($event, file)"
          @drop="file.isDirectory ? handleDrop($event, file) : undefined"
          @click="handleFileClick(file)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.grid-container {
  display: grid;
  grid-auto-rows: 100px;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 24px;
  justify-content: start;
  padding: 10px;
}
.outline-container {
  width: 70vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 24px;
}

.no-files {
  font-size: 20px;
  text-align: center;
}

.breadcrumb {
  display: flex;
  gap: 4px;
  width: 70vw;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 24px;
  margin-bottom: 4px;
  align-self: start;
}

.breadcrumb a {
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
}
.router-link-exact-active {
  color: rgba(0, 0, 0, 0.87) !important;
}

.search-container {
  display: flex;
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 24px;
}
.search-field {
  padding: 8px;
  font-size: 16px;
  border: none;
  outline: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  color: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
}
</style>
