<template>
  <div class="container">
    <b-form-input
      placeholder="Search Recipes"
      id="searchBar"
      type="text"
      v-model="search"
    ></b-form-input>
    <b-form>
      <p>Please enter number of Recipes to return:</p>
      <div class="input-group-text">
        <input
          type="radio"
          id="5"
          name="returnedNumber"
          :value="5"
          checked="checked"
          v-model="numberOfResults"
        />
        <label for="5">5</label>
        <input
          type="radio"
          id="10"
          name="returnedNumber"
          :value="10"
          v-model="numberOfResults"
        />
        <label for="10">10</label>
        <input
          type="radio"
          id="15"
          name="returnedNumber"
          :value="15"
          v-model="numberOfResults"
        />
        <label for="15">15</label>
      </div>
    </b-form>
    <MyMultipleSelect
      @TypeOfElements="saveDiets"
      :TypeOfElements="diets_str"
    ></MyMultipleSelect>

    <MyMultipleSelect
      @TypeOfElements="saveDiets"
      :TypeOfElements="intolerances_str"
    ></MyMultipleSelect>
    <label>cuisine</label>
    <b-form-select
      id="cuisine"
      v-model="cuisine"
      :options="cuisineAsset"
      placeholder="cuisine"
    ></b-form-select>
    <b-form @submit.prevent="searchRecipes">
      <b-button
        type="submit"
        variant="primary"
        style="width:100px;
        display:block;"
        class="mx-auto w-100"
        >Search</b-button
      >
    </b-form>

    <b-form @submit.prevent="sortRecipesTime">
      <b-button
        type="submit"
        variant="primary"
        style="width:100px;
        display:block;"
        class="mx-auto w-100"
        >Sort By Time</b-button
      >
    </b-form>
    <b-form @submit.prevent="sortRecipesPop">
      <b-button
        type="submit"
        variant="primary"
        style="width:100px;
        display:block;"
        class="mx-auto w-100"
        >Sort By Popularity</b-button
      >
    </b-form>
    <b-alert
      class="mt-2"
      v-if="didEnterValue && recipes.length == 0"
      variant="warning"
      dismissible
      show
    >
      No Such Recipes
    </b-alert>
    <b-container>
      <h1>Search results:</h1>
      <h3 v-if="recipes.length === 0">No searches yet</h3>
      <b-row v-for="r in recipes" :key="r.id">
        <b-col>
          <RecipePreview
            class="recipePreview"
            :recipe="r"
            recipe_type="search"
            :isSearch="true"
            :favoriteRecipes="favoriteRecipes"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import intolerancesAsset from "../assets/intolerances";
import dietsAsset from "../assets/diets";
import cuisineAsset from "../assets/cuisine";
import MyMultipleSelect from "./MyMultipleSelect.vue";
import RecipePreview from "./RecipePreview.vue";
export default {
  components: {
    RecipePreview,
    MyMultipleSelect,
  },
  data() {
    return {
      sortByTime: false,
      sortByPopularity: false,
      lastSearch: null,
      numberOfResults: 5,
      didEnterValue: false,
      recipes: [],
      search: "",
      cuisine: "",
      diet: "",
      intolerances: "",
      cuisineAsset: [{ value: null, text: "", disabled: true }],
      intolerancesAsset: [{ value: null, text: "", disabled: true }],
      dietsAsset: [{ value: null, text: "", disabled: true }],
      cuisine_str: "cuisine",
      intolerances_str: "intolerances",
      diets_str: "diets",
    };
  },
  props:{
    favoriteRecipes:{
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.cuisineAsset.push(...cuisineAsset);
    this.intolerancesAsset.push(...intolerancesAsset);
    this.dietsAsset.push(...dietsAsset);
  },
  methods: {
    saveDiets(value) {
      this.diet = "";
      value.forEach((element) => {
        this.diet += element + ",";
      });
      this.diet.slice(0, -1);
    },
    saveIntolerances(value) {
      this.intolerances = "";
      value.forEach((element) => {
        this.intolerances += element + ",";
      });
      this.intolerances.slice(0, -1);
    },
    sortRecipesTime() {
      //need to be checked
      this.recipes.sort(
        (a, b) => parseFloat(a.readyInMinutes) - parseFloat(b.readyInMinutes)
      );
    },
    sortRecipesPop() {
      //need to be checked
      this.recipes.sort(
        (a, b) => parseFloat(a.popularity) - parseFloat(b.popularity)
      );
    },
    async searchRecipes() {
      try {
        const response = await this.axios.get(
          //"http://localhost:3000/recipes/searchForRecipe/" + this.search,
          this.$root.store.server_domain +
            "/recipes/searchForRecipe/" +
            this.search,
          {
            params: {
              query: this.search,
              numberOfResults: this.numberOfResults,
              cuisine: "" ? undefined : this.cuisine,
              diet: "" ? undefined : this.diet,
              intolerances: "" ? undefined : this.intolerances,
              withCredentials: false,
            },
          }
        );
        if (localStorage.lastSearch) {
          const recipes = response.data;
          localStorage.setItem("lastSearch", JSON.stringify(response.data[0]));
          this.recipes = [];
          this.recipes.push(...recipes);
          this.didEnterValue = true;
        }
      } catch (error) {
      }
    },
  },
};
</script>
