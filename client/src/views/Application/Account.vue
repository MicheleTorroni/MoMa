<template>
    <v-container>
        <app-dialog :text="deleteMessage" ref="dialog" @confirm="deleteAccount"></app-dialog>
        <v-row no-gutters>
            <v-col sm="10" class="mx-auto">
                <v-card class="pa-5">
                    <v-card-title> Account Settings </v-card-title>
                    <v-divider></v-divider>
                    <br>
                    <label for="file-upload">
                        <v-avatar size="100" class="custom-file-upload clickable account-image" :rules="rules" readonly>
                            <v-img :src="imageUrl"></v-img>
                        </v-avatar>
                    </label>
                    <input id="file-upload" type="file" @change="selectedFile" :rules="rules">
                    <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
                        <v-text-field label="Username" v-model="account.username" prepend-icon="mdi-account"
                            :rules="rules">
                        </v-text-field>
                        <v-text-field type="password" label="Previous Password" v-model="previousPassword"
                            prepend-icon="mdi-shield-key" :rules="rules"></v-text-field>
                        <v-text-field type="password" label="New Password" v-model="newPassword" prepend-icon="mdi-key"
                            :rules="rules">
                        </v-text-field>
                        <v-text-field type="password" label="Repeat Password" v-model="repeatedPassword"
                            prepend-icon="mdi-key" :rules="rules">
                        </v-text-field>
                        <v-alert close-text="Close Alert" :color="messageColor" light dismissible v-if="message">
                            {{ message }}
                        </v-alert>
                        <br>
                        <v-col>
                            <v-row>
                                <v-btn @click.prevent="openConfirm" class="mt-3" color="error" slot="activator">
                                    Delete
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn type="submit" class="mt-3" color="primary"> Edit
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
import API from '../../Api/accountApi'
import Dialog from '../../components/MessageConfirm.vue'
import CryptoJS from 'crypto-js'

export default {
    data() {
        return {
            deleteMessage: "Are you sure to delete Account and all linked informations?",
            message: "",
            messageColor: "",
            dialog: false,
            rules: [(value) => !!value || "This field is required!"],
            account: {
                username: "",
                password: "",
                image: ""
            },
            previousPassword: "",
            newPassword: "",
            repeatedPassword: "",
            image: "",
            imageUrl: require('@/assets/user.png')
        }
    },
    async mounted() {
        const response = await API.getAccountByUsername(this.$route.params.username)
        this.account = response[0]
        this.imageUrl = "http://localhost:5000/" + this.account.image
    },
    components: {
        appDialog: Dialog,
    },
    methods: {
        selectedFile(event) {
            this.image = event.target.files[0]
            this.imageUrl = URL.createObjectURL(event.target.files[0]);
        },
        showMessage(text, color) {
            this.message = text
            this.messageColor = color
        },
        openConfirm() {
            if (CryptoJS.AES.decrypt(this.account.password, "moma").toString(CryptoJS.enc.Utf8) == this.previousPassword) {
                this.$refs.dialog.open();
            } else {
                console.log(this.account.password)
                console.log(CryptoJS.AES.encrypt(this.previousPassword, "moma"))
                this.showMessage("Insert account password before delete.", "red lighten-1")
            }
        },
        async deleteAccount() {
            try {
                await API.deleteAccount(this.account._id)
                this.$emit('logout')
                vm.$forceUpdate();
            } catch (err) {
                console.log(err.errorMessage)
                this.showMessage("An Error Occurred", "orange darken-1")
            }

        },
        async submitForm() {
            if (this.account.username != "") {
                if (this.newPassword == this.repeatedPassword || this.newPassword == "") {
                    if (CryptoJS.AES.decrypt(this.account.password, "moma").toString(CryptoJS.enc.Utf8) == this.previousPassword) {
                        try {
                            if (this.newPassword != "") {
                                this.account.password = CryptoJS.AES.encrypt(this.newPassword, "pippo")
                                const formData = new FormData()
                                const newImage = this.image = ! "" ? this.image : null
                                formData.append('image', newImage)
                                formData.append('old_image', this.account.image)
                                formData.append('username', this.account.username)
                                formData.append('password', this.newPassword)
                                const response = await API.updateAccount(this.account._id, formData)
                                const account = await API.getAccountByID(this.account._id)
                                this.$emit('update-account', account)
                                this.$router.push({ name: 'home', params: { message: response.message } })
                            }
                        } catch (err) {
                            this.showMessage(err.errorMessage, "red lighten-1")
                        }
                    } else {
                        this.showMessage("Incorrect Account Password", "red lighten-1")
                    }
                } else {
                    this.showMessage("Passwords do not match", "red lighten-1")
                }
            } else {
                this.showMessage("Username can't be blank", "red lighten-1")
            }
        }
    }
}
</script>

<style>
input[type="file"] {
    display: none;
}

.custom-file-upload :hover {
    cursor: pointer;
}

input[type="file"] {
    display: none;
}


.change-login-page-container {
    position: relative;
    min-width: 150px;
}

.change-login-page {
    position: absolute;
    bottom: 0px;
}

.change-login-page-container :hover {
    cursor: pointer;
}

.container {
    padding-top: 50px;
}

.custom-file-upload {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.account-image {
    border: 2px solid #455A64;
}
</style>