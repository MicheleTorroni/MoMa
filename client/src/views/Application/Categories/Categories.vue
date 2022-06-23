<template>
  <v-container>
    <v-alert close-text="Close Alert" color="green accent-4" dark dismissible v-if="this.$route.params.message">
      {{ this.$route.params.message }}
    </v-alert>
    <v-row no-gutters>
      <v-col cols="auto" class="pa-5" v-for="category in categories" :key="category._id">
        <v-card :color="category.color" class="pa-1"
          :to="{ name: 'transactions', params: { username: this.$route.params.username, category: category.name } }">
          <v-card-title class="headline" :prepend-icon="'mdi - account'">
            {{ category.name }}
          </v-card-title>
          <v-card-text class="py-0">
            <p> Total Amount : {{ category.amount }} € </p>
          </v-card-text>
          <br>
          <v-col>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn class="mt-3" @click.prevent="editCategory(category)">
                <v-icon color="white">mdi-wrench</v-icon>
                Edit
              </v-btn>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <floating-button @clicked="addCategory"></floating-button>
</template>

<script>
import API from '@/Api/categoryApi'
import FloatingButton from '@/components/FloatingButton.vue';

export default {
  name: 'Home',
  props: {
    update: Boolean
  },
  watch: {
    update: async function (newVal, oldVal) {
      this.categories = await API.getCategoriesByAccountUsername(this.$route.params.username)
    }
  },
  data() {
    return {
      categories: [],
    }
  },
  components: {
    'floating-button': FloatingButton
  },
  async created() {
    this.categories = await API.getCategoriesByAccountUsername(this.$route.params.username)
  },
  methods: {
    addCategory() {
      this.$router.push({ name: 'add-category', params: { username: this.$route.params.username } })
    },
    editCategory(category) {
      this.$router.push({ name: 'edit-category', params: { name: category.name, username: this.$route.params.username } })
    },
  }
};
</script>

<style scoped>
.v-btn {
  color: white !important;
  background-color: #616161 !important;
}
</style>
