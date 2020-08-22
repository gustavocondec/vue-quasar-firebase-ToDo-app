<template>
  <q-page class="q-pa-md">
    <q-editor v-if="!modeEdit" v-model="editor" min-height="5rem"
    :definitions="{
        save: {
          tip: 'Guardar el texto',
          icon: 'save',
          label: 'Guardar',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['save']
      ]">
    </q-editor>
    <div v-if="tasks.length==0" class="flex flex-center">
      <h6>Sin notas</h6>
    </div>

    <q-card
      flat bordered v-for="(item,index) in tasks" :key="index" style="margin-top:10px">
      <div class="row"><q-card-section class="col" v-html="item.text" :class="item.state?'tachar':''" ></q-card-section>
     <!-- <q-btn :class="item.state?'tachar':''" flat color="blue" @click="item.state=!item.state">Accion</q-btn>-->
      <q-btn flat color="primary" @click="edit(index,item.id)">Editar</q-btn>
      <q-btn flat color="red" @click="deleteTask(index,item.id)">Borrar</q-btn></div>
       <q-editor v-if="modeEdit&&idEdit===item.id" v-model="editorEdit" min-height="5rem"
          :definitions="{
            edit: {
              tip: 'Actualizar el texto',
              icon: 'edit',
              label: 'Actualizar',
              handler: updateWork
            },
            cancelar:{
              tip:'Cancelar',
              icon:'cancel',
              label:'Cancelar',
              handler:cancelUpdate
            }
          }"
          :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['edit','cancelar']
          ]">
        </q-editor>
    </q-card>
  </q-page>
</template>

<script>
import { db } from 'boot/firebase'
export default {
  data () {
    return {
      isLoading: false,
      editor: '',
      editorEdit: '',
      tasks: [
      ],
      indexEdit: null,
      modeEdit: false,
      idEdit: null
    }
  },
  async created () {
    console.log('Created')
    await this.listTasks()
    // console.log('Lista de : ', process.env.VUE_APP_apiKey)
  },
  methods: {
    async listTasks () {
      try {
        const resDB = await db.collection('tasks').get()
        resDB.forEach(res => {
          const task = {
            id: res.id,
            text: res.data().text,
            state: res.data().state
          }
          this.tasks.push(task)
        })
        this.$q.notify({
          message: 'Se cargaron las tareas',
          color: 'green-10',
          textColor: 'white',
          icon: 'cloud_done'
        })
      } catch (error) {
        console.log(error)
        this.$q.notify({
          message: 'Ocurrio un error al cargar la lista',
          color: 'red-10',
          textColor: 'white',
          icon: 'cloud_done'
        })
      } finally {
      }
    },
    async saveWork () {
      console.log('Llama a sabe work')
      if (this.editor.length > 0) {
        try {
          const resDB = await db.collection('tasks').add({
            text: this.editor,
            state: false
          })
          this.tasks.push({
            id: resDB.id,
            state: false,
            text: this.editor
          })
          this.editor = ''
          this.$q.notify({
            message: 'Se guardo texto',
            color: 'green-10',
            textColor: 'white',
            icon: 'cloud_done'
          })
        } catch (error) {
          console.log(error)
          this.$q.notify({
            message: 'Ocurrio un error',
            color: 'red-10',
            textColor: 'white',
            icon: 'cloud_done'
          })
        }
      }
    },
    deleteTask (index, id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Seguro de borrar?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          db.collection('tasks').doc(id).delete()// accedemeos al documento de id, y lo eliminamos
          this.tasks.splice(index, 1)// se borrra
          this.$q.notify({
            message: 'Se borro tarea',
            color: 'red-10',
            textColor: 'white',
            icon: 'cloud_done'
          })
        } catch (error) {
          this.$q.notify({
            message: 'Ocurrio un error',
            color: 'red-10',
            textColor: 'white',
            icon: 'cloud_done'
          })
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      console.log('recibe indesx', index)
    },
    edit (index, id) {
      console.log('click editar')
      this.modeEdit = true
      this.indexEdit = index
      this.idEdit = id
      this.editorEdit = this.tasks[index].text
    },
    async updateWork () {
      try {
        await db.collection('tasks').doc(this.idEdit).update({ text: this.editorEdit })
        this.tasks[this.indexEdit].text = this.editorEdit
        this.$q.notify({
          message: 'Se actualizo texto',
          color: 'green-10',
          textColor: 'white',
          icon: 'cloud_done'
        })
        this.cancelUpdate()// para restablecer
      } catch (error) {
        this.$q.notify({
          message: 'Ocurrio un error',
          color: 'red-10',
          textColor: 'white',
          icon: 'cloud_done'
        })
        console.log(error)
      }
    },
    cancelUpdate () {
      this.modeEdit = false
      this.indexEdit = null
      this.idEdit = null
      this.editorEdit = ''
    }
  }
}
</script>
<style>
  .tachar{
    text-decoration: line-through;
  }
</style>
