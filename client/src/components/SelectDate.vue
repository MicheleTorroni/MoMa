<template>
    <div id="overlay" @click.prevent="close()" v-if="dialog == true">
        <v-card width="50%" class="mx-auto" @click.stop="">
            <v-card-text>
                {{ text }}
            </v-card-text>
            <v-text-field class="pa-5" type="number" label="Money" v-model="value" prepend-icon="mdi-cash-usd">
            </v-text-field>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="success" flat @click.prevent="close">
                    Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" flat @click.prevent="accept">
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
            sign: true, // true: +, false: -
            value: 0
        };
    },
    methods: {
        open(bool) {
            this.sign = bool
            this.dialog = true
        },
        accept() {
            this.$emit('confirm-value', this.sign ? this.value : -this.value)
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