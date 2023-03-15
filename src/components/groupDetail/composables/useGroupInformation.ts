import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const groupDetailStore = useGroupDetailStore()
  const { putGroup } = groupDetailStore
  const { group, editedValue } = storeToRefs(groupDetailStore)

  const isSending = ref(false)

  const editMode = ref<EditMode>('')

  const changeEditMode = (mode: EditMode) => {
    if (mode !== '') {
      editMode.value = mode
    } else {
      editMode.value = ''
    }
  }

  const finishEditing = async () => {
    isSending.value = true
    const value = {
      name: editedValue.value.name,
      description: editedValue.value.description,
      budget: editedValue.value.budget
    }
    await putGroup(group.value?.id ?? '', value)
    changeEditMode('')
    isSending.value = false
  }

  return { isSending, editMode, changeEditMode, finishEditing }
}
