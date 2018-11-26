Vue.use(vuelidate.default);

const codeOrCoffee = value =>
  value === "Code" || value === "Coffee" || !validators.helpers.req(value);
const oldEnoughAndAlive = validators.between(12, 120);

new Vue({
  el: "#app",
  data() {
    return {
      form: {
        name: null,
        age: null,
        email: null,
        newsletter: null,
        githubUsername: null,
        whatToDo: null
      }
    };
  },
  validations: {
    form: {
      name: {
        required: validators.required
      },
      age: {
        required: validators.required, //$v.form.age.required
        integer: validators.integer, //$v.form.age.integer
        oldEnoughAndAlive //between the age of 12 and 120
      },
      email: {
        email: validators.email,
        required: validators.requiredIf(function() {
          return !!this.form.newsletter;
        })
      },
      githubUsername: {
        exists(value) {
          if (!validators.helpers.req(value)) {
            return true;
          }
          return axios.get(`//api.github.com/users/${value}`);
        }
      },
      whatToDo: {
        codeOrCoffee
      }
    }
  },
  methods: {
    shouldAppendValidClass(field) {
      return !field.$invalid && field.$model && field.$dirty;
    },
    shouldAppendErrorClass(field) {
      return field.$error;
    },
    onRegister() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(`form submitted....`, this.form);
      } else {
        console.log(`❌ Invalid form`);
      }
    }
  }
});
