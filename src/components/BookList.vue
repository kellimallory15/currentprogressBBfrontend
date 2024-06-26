<template>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote>
                    Welcome {{ validUserName }}!
                    <footer>
                        <small>
                            <em>&mdash;Your Book Buddy & You!</em>
                        </small>
                    </footer>
                </blockquote>
            </div>
            <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
                <div class="alert alert-success"
                     v-if="showMsg === 'new'"
                     :value="true">
                    New Book has been added.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'update'"
                     :value="true">
                    Book information has been updated.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'deleted'"
                     :value="true">
                    Selected book has been deleted.
                </div>
            </div>
        </div>
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
            <button type="button" class="btn btn-primary" @click="addNewBook" v-if="isSuperuser">
                <font-awesome-icon icon="plus"/>
            </button>
            <div class="card" v-for="book in books" :key="book.pk">
                <div class="card-header" :id="'heading' + book.series_num">
                    <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + book.pk"
                        aria-expanded="true" :aria-controls="'collapse' + book.pk">
                        <h6 style="color: #0275d8; float: left">{{ book.title }}</h6>
                    </button>
                </div>
                <div :id="'collapse' + book.pk" class="collapse" :aria-labelledby="'heading' + book.pk" data-bs-parent="#collapsable-card">
                    <div class="card-body">
                        <p><b>Title:</b> {{ book.title }}</p>
                        <p><b>Author:</b> {{ book.author }}</p>
                        <p><b>Genre:</b> {{ book.genre }}</p>
                        <p><b>Summary:</b> {{ book.summary }}</p>
                        <p><b>Publisher:</b> {{ book.publisher }}</p>
                        <p><b>Published Date:</b> {{ book.published_date }}</p>
                        <p><b>Page Total:</b> {{ book.page_total }}</p>
                        <p><b>Series Number:</b> {{ book.series_num }}</p>
                        <div class="btn-group" v-if="isSuperuser">
                            <button @click="updateBook(book)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="pencil"/>
                            </button>
                            <button @click="deleteBook(book)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="trash"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Non-Mobile device view-->
        <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
            <table class="table table-hover" style="overflow-y: auto" :headers="headers">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Summary</th>
                        <th scope="col">Publisher</th>
                        <th scope="col">Published Date</th>
                        <th scope="col">Page Total</th>
                        <th scope="col">Series Number</th>
                        <th scope="col" v-if="isSuperuser">Update</th>
                        <th scope="col" v-if="isSuperuser">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in books" :key="book.pk">
                        <td>{{ book.title }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ book.genre }}</td>
                        <td>{{ book.summary }}</td>
                        <td>{{ book.publisher }}</td>
                        <td>{{ book.published_date }}</td>
                        <td>{{ book.page_total }}</td>
                        <td>{{ book.series_num }}</td>
                        <td v-if="isSuperuser" @click="updateBook(book)">
                            <button style="background-color: transparent; padding: 0;">
                                <font-awesome-icon icon="pencil"/>
                            </button>
                        </td>
                        <td v-if="isSuperuser" @click="deleteBook(book)">
                            <button style="background-color: transparent; padding: 0;">
                                <font-awesome-icon icon="trash"/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-primary" @click="addNewBook" v-if="isSuperuser">Add New Book</button>
        </div>
    </div>
</template>

<script>
import router from '../router';
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
    name: "BookList",
    data() {
        return {
            books: [],
            validUserName: "Guest",
            bookSize: 0,
            showMsg: '',
            isMobile: false,
            authenticated: false,
            headers: [
                { text: 'Title', sortable: false, align: 'left' },
                { text: 'Author', sortable: false, align: 'left' },
                { text: 'Genre', sortable: false, align: 'left' },
                { text: 'Summary', sortable: false, align: 'left' },
                { text: 'Publisher', sortable: false, align: 'left' },
                { text: 'Published Date', sortable: false, align: 'left' },
                { text: 'Page Total', sortable: false, align: 'left' },
                { text: 'Series Number', sortable: false, align: 'left' },
            ],
        };
    },
    computed: {
        isSuperuser() {
            return localStorage.getItem('is_superuser') === 'true';
        }
    },
    mounted() {
        this.authenticated = localStorage.getItem("isAuthenticated");
        this.getBooks();
        this.showMessages();
    },
    methods: {
        onResize() {
            if (window.innerWidth > 600) {
                this.isMobile = false;
            } else {
                this.isMobile = true;
            }
        },
        showMessages() {
            if (this.$route.params.msg) {
                this.showMsg = this.$route.params.msg;
            }
        },
        getBooks() {
            apiService.getBookList().then(response => {
                this.books = response.data.data;
                this.bookSize = this.books.length;
                if (localStorage.getItem("isAuthenticated") && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        addNewBook() {
            if (this.isSuperuser) {
                router.push('/book-create');
            } else {
                router.push("/auth");
            }
        },
        updateBook(book) {
            if (this.isSuperuser) {
                router.push('/book-create/' + book.pk);
            } else {
                router.push("/auth");
            }
        },
        deleteBook(book) {
            if (this.isSuperuser && confirm("Do you really want to delete?")) {
                apiService.deleteBook(book.pk).then(response => {
                    if (response.status === 204) {
                        this.getBooks();  // Refresh the list after deletion
                        router.push('/book-list/deleted/');
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            }
        }
    }
};
</script>

<style>
button {
    padding: 1rem;
    border: 0;
    cursor: pointer;
}
</style>
