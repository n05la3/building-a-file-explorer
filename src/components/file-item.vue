<!-- Icons from 
 https://pictogrammers.com/library/mdi/icon/file/ 
 https://pictogrammers.com/library/mdi/icon/folder/ 
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    isDirectory?: boolean
    name: string
    size?: string
  }>(),
  {
    size: '48px'
  }
)
</script>

<template>
  <div class="file-item-container">
    <svg role="presentation" viewBox="0 0 24 24" :style="{ height: size, width: size }">
      <title>{{ name }}</title>
      <path
        v-if="isDirectory"
        d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
        style="fill: #64748b"
      ></path>

      <path
        v-else
        d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"
        style="fill: #64748b"
      ></path>
    </svg>
    <div class="item-label">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.file-item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 4px;
  transition:
    color,
    background-color 0.2s ease-in-out;
  overflow: hidden;

  &:hover {
    background-color: rgba(100, 116, 139, 0.4);
    border-radius: 4px;
    color: white;
  }

  .item-label {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
