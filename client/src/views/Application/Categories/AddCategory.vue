<template>

    <v-container>
        <v-row no-gutters>
            <v-col sm="10" class="mx-auto">
                <v-card class="pa-2">
                    <v-card-title> Add Category</v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
                        <v-text-field label=" Category Name" v-model="category.name" prepend-icon="mdi-note"
                            :rules="rules">
                        </v-text-field>
                        <v-select :items="colors" item-title="title" item-value="value" item-color="blue"
                            :bg-color="color" label="Color" prepend-icon="mdi-format-color-fill" v-model="color">
                        </v-select>
                        <v-alert close-text="Close Alert" color="warning" v-if="message">
                            {{ message }}
                        </v-alert>
                        <v-col class="text-right">
                            <v-btn @click="addCategory" class="mt-3" color="success">Add Category</v-btn>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import accountApi from '@/Api/accountApi'
import categoryApi from '@/Api/categoryApi'

export default {
    props: {
        update: Boolean
    },
    watch: {
        update: async function (newVal, OldVal) {
            const categories = await categoryApi.getCategoriesByAccountUsername(this.$route.params.username)
            for (const c of categories) {
                this.categoryNamesUsed.push(c.name)
            }
        }
    },
    data() {
        return {
            rules: [(value) => !!value || "This field is required!"],
            category: {
                name: "My New Category",
                color: "",
            },
            message: "",
            categoryNamesUsed: [],
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
    async created() {
        const categories = await categoryApi.getCategoriesByAccountUsername(this.$route.params.username)
        for (const c of categories) {
            this.categoryNamesUsed.push(c.name)
        }
    },
    methods: {
        async addCategory() {
            if (this.category.name != "") {
                if (!this.categoryNamesUsed.includes(this.category.name)) {
                    try {
                        const account = await accountApi.getAccountByUsername(this.$route.params.username)
                        const newCategory = {
                            name: this.category.name,
                            color: this.color,
                            accountFK: account[0]._id
                        }
                        await categoryApi.addCategory(newCategory)
                        this.$router.push({ name: 'home', params: { username: this.$route.params.username } })
                        this.$emit('updated')
                    } catch (err) {
                        console.log(err.message)
                    }
                } else {
                    this.message = "Chosen category name is already in use"
                }
            }
        }
    }
}
</script>
