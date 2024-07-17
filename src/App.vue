<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import BadgeEditor from './components/BadgeEditor.vue'





</script>

<template>
    
   <BadgeEditor :defdimensions="{width:2000,height:3000}"></BadgeEditor>


</template>

<style scoped>
*{display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    }
</style>
