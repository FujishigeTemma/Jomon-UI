import axios from 'axios'
import { defineStore } from 'pinia'

type File = {
  file: string
  name: string
}

export const useFileStore = defineStore('file', {
  state: () => ({
    files: new Array<File>()
  }),
  actions: {
    async getFile(ids: string[]) {
      for (let i = 0; i < ids.length; i++) {
        const response: File = await axios.get('/api/files/' + ids[i])
        this.files.concat(response)
      }
    },
    async postFile(request_id: string, name: string, file: Blob) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('request_id', request_id)
      const header = {
        headers: {
          'Content-Type': 'mutipart/form-data'
        }
      }
      await axios.post('/api/files/', formData, header)
    },
    async deleteFile(id: string) {
      await axios.put('/api/files/' + id)
    }
  }
})
