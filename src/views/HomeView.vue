<script setup lang="ts">
import FileItem from '@/components/FileItem.vue'
import { generateFiles, type FileOrDirectory } from '@/files'
import { computed } from 'vue'
import { useFolderOrFolderStructure } from '@/composables/file-or-folder'
import { useRouter, RouterLink } from 'vue-router'

const props = defineProps<{
  id?: string
}>()

const files = generateFiles(100)

console.log(files)
const currentDirectoryId = computed(() => (props.id ? Number(props.id) : undefined))
const { itemsAtDirectory, isInFolder, removeFolderPath } = useFolderOrFolderStructure(
  files,
  currentDirectoryId
)

const router = useRouter()
function handleFileClick(file: FileOrDirectory) {
  if (!file.isDirectory) {
    return
  }

  router.push({ name: 'home', params: { id: file.id } })
}
</script>

<template>
  <div class="main-container">
    <div>
      <div class="breadcrumb">
        <router-link v-if="itemsAtDirectory.directory.length > 0" :to="{ name: 'home' }">
          Home -->
        </router-link>
        <template v-for="(file, index) in itemsAtDirectory.directory" :key="file.id">
          <router-link :to="{ name: 'home', params: { id: file.id } }">{{ file.name }}</router-link>
          <span v-if="index !== itemsAtDirectory.directory.length - 1"> --> </span>
        </template>
      </div>
      <div v-if="itemsAtDirectory.files.length === 0" class="no-files">
        No files in this directory
      </div>
      <div v-else class="grid-container">
        <FileItem
          v-for="file in itemsAtDirectory.files"
          :key="file.id"
          :is-directory="file.isDirectory"
          :name="file.name"
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

  width: 70vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 24px;
}

.no-files {
  font-size: 20px;
  text-align: center;

  width: 70vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 24px;
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
</style>
