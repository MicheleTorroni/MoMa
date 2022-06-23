<template>
    <v-container>
        <v-btn class="rounded-circle floating-button" color="success" @click="buttonAction">
            <v-icon size="30">
                mdi-plus
            </v-icon>
        </v-btn>
    </v-container>
</template>

<script>
export default {
    methods: {
        buttonAction() {
            this.$emit('clicked')
        }
    }
}
</script>

<style scoped>
.floating-button {
    position: fixed;
    bottom: 40px;
    right: 40px;
}

.v-btn {
    padding-top: 31px !important;
    padding-bottom: 31px !important;
    border-radius: 100% !important;
}

.v-button-overlay {
    width: 5px !important;
}
</style>