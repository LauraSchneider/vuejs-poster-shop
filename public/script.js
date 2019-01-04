var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    // where you want Vue to be located in your DOM. the root element.
    el: '#app',
    data: {
        total: 0,
        items: [],
        // items: [
        //     { id: 1, title: 'Item 1'},
        //     { id: 2, title: 'Item 2'},
        //     { id: 3, title: 'Item 3'}
        // ],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {
        appendItems: function() {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
            // console.log('appendItems');
        },
        onSubmit: function() {
            // if there is something written in the search input
            if (this.newSearch.length) {
                // the vue-resource has a method GET, where a url get's passed that returns a promise. When the promise resolves it sends back data.
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res) {
                        this.lastSearch = this.newSearch;
                        // console.log('res data', res.data)
                        this.results = res.data;
                        this.appendItems();
                        // console.log('res', res.data);
                        this.loading = false;
                    })
                ;
            }

            // to test if vue-resource library is working log $http and click search
            // console.log(this.$http)
            // to test if what is typed in input works, log search
            // console.log('search', this.search)
        },
        // index refers to the position of the item in the array that was just clicked
        addItem: function(index) {
            // console.log('index', index)
           this.total += PRICE;
           var item = this.items[index];
           var found = false;
           // push the item at whichever index - can not see the change, but log this.cart.length to see addition of each item. Vue doesn't need the DOM to rerender.
           // this.cart.push(this.items[index]);
           // console.log(this.cart.length)
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id  === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2))
        }
    },
    computed: {
        noMoreItems: function () {
            return this.results.length === this.items.length && this.results.length > 0
        }
    },
    mounted: function() {
        this.onSubmit();

        //SCROLLING SECTION
        //cannot use the 'this' keyword even though it is inside the Vue instance, because scroll Monitor isn't a vue library.
        //but mounted callback function has access to the 'this' keyword so one can use an alias to get access to 'this'.
        // check whether scroll Monitor is working
        // console.log(scrollMonitor);
        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            // to trigger a method to add additional items
            // console.log('Entered viewport');
            vueInstance.appendItems();
        });
    }
});
