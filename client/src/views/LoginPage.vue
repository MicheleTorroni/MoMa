<template>
    <v-app :style="moneyImage">
        <v-container class="container">
            <v-row no-gutters>
                <v-col sm="10" class="mx-auto">
                    <v-card class="pa-5">
                        <v-card-title> {{ loginView ? "Login" : "Sign Up" }} </v-card-title>
                        <v-divider></v-divider>
                        <br>
                        <label v-if="!loginView" for="file-upload">
                            <v-avatar size="100" class="custom-file-upload clickable account-image" :rules="rules"
                                readonly>
                                <v-img :src="imageUrl"></v-img>
                            </v-avatar>
                        </label>
                        <input id="file-upload" type="file" @change="selectedFile" :rules="rules">
                        <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
                            <v-text-field label="Username" v-model="account.username" prepend-icon="mdi-account"
                                :rules="rules">
                            </v-text-field>
                            <v-text-field type="password" label="Password" v-model="account.password"
                                prepend-icon="mdi-key" :rules="rules">
                            </v-text-field>
                            <v-text-field v-if="!loginView" type="password" label="Repeat Password"
                                v-model="repeatedPassword" prepend-icon="mdi-key" :rules="rules">
                            </v-text-field>
                            <v-alert close-text="Close Alert" :color="messageColor" light dismissible v-if="message">
                                {{ message }}
                            </v-alert>
                            <br>
                            <v-col>
                                <v-row>
                                    <div class="change-login-page-container" @click.prevent="changePage">
                                        <a href="" class="change-login-page">{{ "Go to " + (loginView ? "Sign Up" :
                                                "Login")
                                        }}</a>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="mt-3" :color="loginView ? 'success' : 'primary'">{{
                                            loginView ? "Login" : "Sign Up"
                                    }}
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import accountAPI from '../Api/accountApi'
import CryptoJS from 'crypto-js'

export default {
    data() {
        return {
            loginView: true,
            message: "",
            messageColor: "",
            rules: [(value) => !!value || "This field is required!"],
            account: {
                username: "",
                password: "",
                image: ""
            },
            accountUsernames: [],
            repeatedPassword: "",
            image: "",
            moneyImage: { backgroundImage: require("@/assets/download.jpg") },
            imageUrl: "@/assets/logo.png",
        }
    },
    async created() {
        this.accountUsernames = await accountAPI.getAccountUsernames()
    },
    mounted() {
        this.imageUrl = require('@/assets/user.png')
    },
    computed: {
        imageName: {
            get() {
                if (this.image) {
                    return this.image.name
                }
                else {
                    return this.account.image
                }
            }
        }
    },
    methods: {
        changePage() {
            this.image = ""
            this.message = ""
            this.imageUrl = require('@/assets/user.png')
            this.account = {
                username: "",
                password: "",
                image: ""
            }
            this.loginView = !this.loginView
        },
        selectedFile(event) {
            this.image = event.target.files[0]
            this.imageUrl = URL.createObjectURL(event.target.files[0]);
        },
        async submitForm() {
            this.loginView ? this.login() : this.SignUp()
        },
        async login() {
            if (this.account.username != "" && this.account.password != "") {
                try {
                    const account = await accountAPI.getAccountByUsername(this.account.username)
                    if (CryptoJS.AES.decrypt(account[0].password, "moma").toString(CryptoJS.enc.Utf8) == this.account.password) {
                        this.account.image = account[0].image
                        this.$emit('login', account[0])
                    } else {
                        this.message = "Username and/or password incorrect"
                        this.messageColor = "orange lighten-1"
                    }
                } catch (err) {
                    this.message = "Username and/or password incorrect"
                    this.messageColor = "orange lighten-1"
                }
            }
        },
        async SignUp() {
            if (this.account.password != this.repeatedPassword) {
                this.message = "Passwords do not match"
                this.messageColor = "warning"
            } else if (this.image == "") {
                this.message = "Choose an image for the account"
                this.messageColor = "warning"
            } else if (this.accountUsernames.includes(this.account.username)) {
                this.message = "Chosen username is already in use"
                this.messageColor = "warning"
            }
            else {
                const formData = new FormData()
                formData.append('image', this.image)
                var encryptedPass = CryptoJS.AES.encrypt(this.account.password, "moma").toString()
                formData.append('username', this.account.username)
                formData.append('password', encryptedPass)

                if (this.account.username != "" && this.account.password != "") {
                    if (this.$refs.form.validate()) {
                        try {
                            const response = await accountAPI.addAccount(formData)
                            this.changePage()
                            this.message = "Account created successfully"
                            this.messageColor = "green accent-2"
                        } catch (err) {
                            this.message = "An error Occurred"
                            this.messageColor = "red lighten-1"
                        }
                    }
                }
            }
        }

    }
}
</script>

<style scoped>
div[data-app='true'] {
    background: url('../assets/download.jpg') no-repeat center center fixed !important;
    background-size: cover;
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