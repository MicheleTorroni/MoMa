<template>
    <div id="overlay" @click="close()" v-if="dialog == true">
        <v-card width="50%" class="mx-auto" @click.stop="">
            <v-card-text>
                {{ text }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn color="success" flat @click="close">
                    Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" flat @click="accept">
                    Confirm
                </v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>

<script>
export default {
    props: ["text"],
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        open() {
            this.dialog = true
        },
        accept() {
            this.$emit("confirm")
            this.dialog = false
        },
        close() {
            this.dialog = false;
        }
    }
}
</script>

<style scoped>
#overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 20001 !important;
    cursor: pointer;
}

.v-card {
    top: 30%;
}
</style>