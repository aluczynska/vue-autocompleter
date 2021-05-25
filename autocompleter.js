Vue.component('v-autocompleter', {
  template: `
    <div class="vue-autocompleter">  
      <input
        ref="first"
        :value="value"
        type="text"
        class="search_input"
        @input="$emit('input', $event.target.value)"
        @keyup.down="downKey"
        @keyup.up="upKey"
        @keyup.enter="enterKey" />
      <div class="bottom_border"></div>
      <div class="list">
        <ul v-for="(city, index) in filteredCities">
          <li v-on:click="listClicked(city.name)" :class="{grey_content: index == in_focus}">
            <a v-on:click="choose(index)" v-html="bolderize(city)"></a>
          </li>
        </ul>
      </div>
    </div>
    `,

  props: [
    /**
     * fraza wpisana w input
     */
    'value', 
    /**
     * lista z cities
     */
    'options'],

  data: function () {
    return {
      selected_city: '',
      googleSearch_temp: '',
      cities_update: true,
      change_class: 0,
      cities: window.cities,
      in_focus: -1,
      foc: true,
      filteredCities: []
    }
  },
  
  watch: {

   /**
     * Funkcja osprawdza przesuwanie sie po liście poprzez klikanie strzałkami
     * jeżeli użytkownik przesuwa się po liście input się zmienia                         
     */
    in_focus: function(){
      this.cities_update = false;      
      if (this.in_focus >= 0) {
        this.$emit('input', this.filteredCities[this.in_focus].name);
      }
    },

    /**
     * Funkcja zmienia sposób wyświetlania listy
     */
    value: function(){
      if(this.value.length == 0){
        this.filteredCities = [];
      } 
      else{ 
        this.cities_update=true;
        if(this.in_focus == -1){
          this.googleSearch_temp = this.value; 
          this.CreateCities();     
        }
      }
    },
  },

  methods: {
    /**
     * Funckja pokazuje liste co najwyzej 10 miast,
     * które zawierają frazę wpisaną w input
     */
    CreateCities(){
          let result = this.cities.filter(city => city.name.includes(this.value));
          if(result.length > 10){
            this.filteredCities = result.slice(1, 11);
          }
          else{
            this.filteredCities = result;
          }
        this.in_focus = -1;
    },

     /**
     * Funkcja tworzy event po kliknieciu listy
     */

    listClicked(name){
        this.$emit('input', this.value);
        this.enterClick();
    },
        
    /**
     * Funkcja tworzy event po wybraniu miasta z listy
     */
    choose(i){
        this.$emit('input', this.filteredCities[i].name);
    },

    /**
     * Funkcja tworzy event po wybraniu miasta z listy za pomocą przycisku enter
     */
    enterKey: function(event) {
      if(event) {
        this.CreateCities();
        this.in_focus = -1;
      }
      this.$emit('enter', this.value);
    },

    /**
     * Funckja zmienia wartość iteratora listy
     * po klikaniu strzalki góra
     */
    upKey() {
      if(this.in_focus > -1){
        this.in_focus -= 1;
      } else if(this.in_focus == 0) {
        this.in_focus = this.filteredCities.length - 1;
      }
    },

    /**
     * Funckja zmienia wartość iteratora listy
     * po klikaniu strzalki dół
     */
    downKey() {
      if(this.in_focus < this.filteredCities.length - 1){
        this.in_focus += 1;
      }
      else if(this.in_focus == this.filteredCities.length - 1){
        this.in_focus = -1;
      }
    },

    /**
     * Funkcja pogrubia fraze która nie została wpisana w inputa
     * reszta ma styl normalny
     */
    bolderize(input_city){
      let regex = new RegExp(this.googleSearch_temp, "gi");
      let bold = "<b>" + 
        input_city.name.replace(regex, match =>
            {return "<span class='thin'>"+ match +"</span>";}) 
                + "</b>";
      return bold;
    }
  },
})
