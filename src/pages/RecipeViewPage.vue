<template>
  <div class="container">
    <b-alert class="mt-2" v-if="addedTofav" variant="warning" dismissible show>
      Added to favorites
    </b-alert>
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div>Likes: {{ recipe.aggregateLikes }} likes</div>
            </div>
            Ingredients:
            <ul>
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
              >
                {{ r.original }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            Instructions:
            <ol>
              <li v-for="s in recipe._instructions" :key="s.number">
                {{ s.step }}
              </li>
            </ol>
          </div>
        </div>
      </div>

      <b-form v-if="$root.store.username" @submit.prevent="like">
        <b-button
          type="submit"
          variant="primary"
          style="width:100px;display:block;"
          class="mx-auto w-100"
          >Add To Favourites</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
      addedTofav: false,
    };
  },
  methods: {
    async like() {
      try {
        const response = await this.axios.post(
         // "http://localhost:3000/user/favorites",
          this.$root.store.server_domain+"/user/favorites",
          {
            // withCredentials: true,
            recipe_id: this.$route.params.recipeId,
          }
        );
        this.addedTofav = true;
      } catch (error) {
      }
    },
  },

  async mounted() {
    try {
    
      const response = await this.axios.post(
        //"http://localhost:3000/user/lastSeenRecipes",
        this.$root.store.server_domain+"/user/lastSeenRecipes",
        {
          recipe_id: this.$route.params.recipeId,
        }
      );
      if (response.status !== 200) this.$router.replace("/NotFound");
    } catch (error) {
      this.$router.replace("/NotFound");
      return;
    }
 
    let clicked_recipes = []
    if (localStorage.getItem(localStorage.username) !== null) {
      let clicked_recipes = JSON.parse(
        localStorage.getItem(localStorage.username)
      );
      if (!clicked_recipes.includes(this.$route.params.recipeId)) {
        clicked_recipes.push();
      }
    }
    else{
      clicked_recipes.push(this.$route.params.recipeId)
    }
    localStorage.setItem(localStorage.username, JSON.stringify(clicked_recipes));
  },

  async created() {
    try {
      let response;
      response = this.$route.params.response;

      try {
        response = await this.axios.get(
          // "https://test-for-3-2.herokuapp.com/recipes/info",
          // this.$root.store.server_domain + "/recipes/info",
          
             this.$root.store.server_domain + "/recipes/fullRecipe/" +
            this.$route.params.recipeId
          // process.env.VUE_APP_ROOT_API + "/recipes/fullRecipe",
        );

        if (response.status !== 200) this.$router.replace("/NotFound");
      } catch (error) {
        this.$router.replace("/NotFound");
        return;
      }

      let {
        analyzedInstructions,
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
      } = response.data;

      let _instructions = analyzedInstructions
        .map((fstep) => {
          fstep.steps[0].step = fstep.name + fstep.steps[0].step;
          return fstep.steps;
        })
        .reduce((a, b) => [...a, ...b], []);

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
      };
      this.recipe = _recipe;
    } catch (error) {
    }
  },
 
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.container{
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}
</style>
