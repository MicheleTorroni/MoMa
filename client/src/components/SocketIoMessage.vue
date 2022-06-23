<template>
    <div v-if="message" style="width: 100%; background-color: white; color: brown;">
        <v-icon color="warning">mdi-alert</v-icon>
        &nbsp
        {{ message }}
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    props: ["username"],
    data() {
        return {
            message: "",
            socket: {},
        };
    },
    created() {
        this.socket = io("http://localhost:3000")
        this.socket.emit("roomUser", this.$props.username)
    },
    mounted() {
        this.socket.on("serverMessage", data => {
            if (data.priority == "high") {
                this.message = data.message
            } else {
                this.$emit('update')
            }
        })
    },
    methods: {
        emit(message) {
            this.socket.emit("clientMessage", { 'username': this.$props.username, 'message': message })
        }
    }
}
</script>
