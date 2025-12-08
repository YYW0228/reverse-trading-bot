<template>
  <div class="basic-info-form">
    <q-form @submit="handleNext" class="form-content">
      <div class="form-section">
        <q-input
          v-model="localData.childName"
          label="孩子姓名"
          filled
          :rules="[val => !!val || '请输入孩子姓名']"
          class="form-input"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="purple" />
          </template>
        </q-input>

        <q-input
          v-model.number="localData.childAge"
          label="孩子年龄"
          type="number"
          filled
          :rules="[
            val => !!val || '请输入年龄',
            val => (val >= 3 && val <= 18) || '年龄应在3-18岁之间'
          ]"
          class="form-input"
        >
          <template v-slot:prepend>
            <q-icon name="cake" color="purple" />
          </template>
          <template v-slot:append>
            <span class="text-grey-6">岁</span>
          </template>
        </q-input>

        <q-select
          v-model="localData.gender"
          :options="genderOptions"
          label="性别"
          filled
          emit-value
          map-options
          class="form-input"
        >
          <template v-slot:prepend>
            <q-icon name="wc" color="purple" />
          </template>
        </q-select>

        <q-select
          v-model="localData.handedness"
          :options="handednessOptions"
          label="惯用手"
          filled
          emit-value
          map-options
          class="form-input"
        >
          <template v-slot:prepend>
            <q-icon name="pan_tool" color="purple" />
          </template>
        </q-select>
      </div>

      <div class="form-actions">
        <q-btn
          type="submit"
          color="purple"
          label="下一步"
          icon-right="arrow_forward"
          size="lg"
          class="next-btn"
          no-caps
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
interface BasicInfo {
  childName: string
  childAge: number
  gender: string
  handedness: string
}

const props = defineProps<{ modelValue: BasicInfo }>()
const emit = defineEmits(['update:modelValue', 'next'])

const localData = ref({ ...props.modelValue })

const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
]

const handednessOptions = [
  { label: '右手', value: 'right' },
  { label: '左手', value: 'left' },
  { label: '双手', value: 'both' }
]

watch(localData, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.basic-info-form {
  padding: 1rem 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-input {
  width: 100%;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  min-width: 150px;
}
</style>
