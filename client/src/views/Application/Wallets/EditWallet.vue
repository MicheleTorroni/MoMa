<template>
    <v-container>
        <message-confirm :text="deleteMessage" ref="dialog" @confirm="deleteCategory"></message-confirm>
        <v-row no-gutters>
            <v-col sm="10" class="mx-auto">
                <v-card class="pa-2">
                    <v-card-title>Edit Category</v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="form" class="pa-5" enctype="multipart/form-data">
                        <v-text-field label=" Category Name" v-model="category.name" prepend-icon="mdi-note"
                            :rules="rules">
                        </v-text-field>
                        <v-select :items="colors" item-title="title" item-value="value" item-color="blue"
                            :bg-color="color" label="Color" prepend-icon="mdi-format-color-fill" v-model="color">
                        </v-select>

                        <v-col>
                            <v-row>
                                <v-btn @click.prevent="openMessageConfirm" class="mt-3" color="error">Delete
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn @click.prevent="updateCategory" class="mt-3" color="primary">Edit</v-btn>
                            </v-row>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import categoryApi from '@/Api/categoryApi'
import MessageConfirm from '@/components/MessageConfirm'

export default {
    props: {
        update: Boolean
    },
    watch: {
        update: function (newVal, OldVal) {
            this.$router.push({ name: 'home', params: { username: this.$route.params.username } })
        }
    },
    data() {
        return {
            deleteMessage: "Are you sure to delete Category and all linked transactions?",
            rules: [(value) => !!value || "This field is required!"],
            category: {
                name: "My New Category",
                color: ""
            },
            color: 'success',
            colors: [
                { title: 'green', value: 'success' },
                { title: 'white', value: 'white' },
                { title: 'red', value: 'error' },
                { title: 'blue', value: 'primary' },
                { title: 'orange', value: 'warning' },
                { title: 'acquamarina', value: 'secondary' },
            ]
        }
    },
    components: {
        messageConfirm: MessageConfirm
    },
    methods: {
        async updateCategory() {
            if (this.category.name != "") {
                try {
                    this.category.color = this.color
                    await categoryApi.updateCategory(this.category._id, this.category)
                    this.$router.push({ name: 'home', params: { username: this.$route.params.username } })
                    this.$emit('updated')
                } catch (err) {
                    console.log(err.message)
                }
            }
        },
        async deleteCategory() {
            try {
                await categoryApi.deleteCategory(this.category._id)
                this.$router.push({ name: 'home', params: { username: this.$route.params.username } })
            } catch (err) {
                console.log(err.message)
            }

        },
        openMessageConfirm() {
            this.$refs.dialog.open()
        }
    },
    async created() {
        const category = await categoryApi.getCategoryByName(this.$route.params.name)
        this.category = category
        this.color = category.color
    }
}
</script>
