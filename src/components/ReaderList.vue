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
                    New reader has been added.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'update'"
                     :value="true">
                    Reader information has been updated.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'deleted'"
                     :value="true">
                    Selected reader has been deleted.
                </div>
            </div>
        </div>
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
                <button type="button" class="btn btn-primary" @click="addNewReader">
                    <font-awesome-icon icon="plus"/>
                </button>
                <div class="card" v-for="reader in readers" v-bind:key="reader">
                    <div class="card-header" :id="'heading' + reader.reader_num">
                        <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + reader.pk" 
                        aria-expanded="true" :aria-controls="'collapse' + reader.pk">
                            <h6 style="color: #0275d8; float: left">{{reader.name}}</h6>
                        </button>
                    </div>

                    <div :id="'collapse' + reader.pk" class="collapse" :aria-labelledby="'heading' + reader.pk" data-bs-parent="#collapsable-card">
                        <div class="card-body">
                            <p><b>Account Number:</b>{{ reader.reader_num }}</p>
                            <p><b>Name:</b> {{reader.name}}</p>
                            <p><b>Address:</b> {{reader.address}},{{ reader.city }},
                            {{ reader.state }}, {{ reader.zipcode }}</p>
                            <p><b>Email:</b> {{reader.email}}</p>
                            <!-- Again, if we want update/create dates, they would be input back here in listing -->

                            <div v-if="(this.userID === reader.user || this.is_superuser === 'true')" class="btn-group">
                                <button  @click="updateReader(reader)" style="background-color: transparent; padding: 5;">
                                    <font-awesome-icon icon="pencil"/></button>
                                <button @click="deleteReader(reader)" style="background-color: transparent; padding: 5;">
                                    <font-awesome-icon icon="trash"/></button>
                            </div>
                            <div v-else class="btn-group">
                                <button style="background-color: transparent; padding: 0;" disabled>
                                    <font-awesome-icon icon="pencil"/></button>
                                <button style="background-color: transparent; padding: 0;" disabled>
                                    <font-awesome-icon icon="trash"/></button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <!--non-Mobile device view-->

            <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
                <table class="table table-hover" style="overflow-y: auto"
                       :headers="headers">
                    <thead>
                    <tr>
                        <th scope="col">Account #</th>
                        <th scope="col">Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Zip Code</th>
                        <th scope="col">Email</th>
                        <!-- Update and remove these if phone version -->
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for = "reader in readers" v-bind:key="reader">
                        <th scope="row">{{reader.reader_num}}</th>
                        <td>{{reader.name}}</td>
                        <td>{{reader.address}}</td>
                        <td>{{reader.city}}</td>
                        <td>{{reader.state}}</td>
                        <td>{{reader.zipcode}}</td>
                        <td>{{reader.email}}</td>
                        
                        <td v-if="(this.userID === reader.user || this.is_superuser === 'true')"
                         @click="updateReader(reader)">
                            <button style="background-color: transparent; padding: 5;">
                            <font-awesome-icon icon="pencil"/></button>
                        </td>
                        <td v-else>
                            <button style="background-color: transparent; padding: 5;" disabled>
                            <font-awesome-icon icon="pencil"/></button>
                        </td>
                        <td v-if="(this.userID === reader.agent || this.is_superuser === 'true')"
                         @click="deleteReader(reader)">
                            <button style="background-color: transparent; padding: 5;">
                            <font-awesome-icon icon="trash"/></button>
                        </td>
                        <td v-else>
                            <button style="background-color: transparent; padding: 5;" disabled>
                            <font-awesome-icon icon="trash"/></button>
                        </td>

                    </tr>
                    </tbody>
                </table>
                <!-- Only allow add of reader when authenticated user -->
                <div v-if="this.authenticated === 'true'">
                    <button type="button" class="btn btn-primary" @click="addNewReader">Add New Reader</button>
                </div>
            </div>
        </div>
</template>
<script>
    import router from '../router';
    import {APIService} from '../http/APIService';
    const apiService = new APIService();

    export default {
        name: "ReaderList",
        data: () => ({
            readers: [],
            validUserName: "Guest",
            readerSize: 0,
            showMsg: '',
            isMobile: false,
            authenticated: false,
            headers: [
                {text: 'Reader Number', sortable: false, align: 'left',},
                {text: 'Name', sortable: false, align: 'left',},
                {text: 'Address', sortable: false, align: 'left',},
                {text: 'City', sortable: false, align: 'left',},
                {text: 'State', sortable: false, align: 'left',},
                {text: 'ZipCode', sortable: false, align: 'left',},
                {text: 'Email', sortable: false, align: 'left',},
                {text: 'Update', sortable: false, align: 'left',},
                {text: 'Delete', sortable: false, align: 'left',}
            ],
        }),
        mounted() {
            this.authenticated = localStorage.getItem("isAuthenticated")
            this.getReaders();
            this.showMessages();
        },
        methods: {
            onResize() {
                if (window.innerWidth > 600)
                    this.isMobile = false;
                else
                    this.isMobile = true;
            },
            showMessages(){
                if (this.$route.params.msg) {
                    this.showMsg = this.$route.params.msg;
                }
            },
            getReaders() {
                apiService.getReaderList().then(response => {
                    this.readers = response.data.data;
                    this.ReaderSize = this.readers.length;
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                        this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            },
            addNewReader() {
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    router.push('/reader-create');
                } else {
                    router.push("/auth");
                }
            },
            updateReader(reader) {
                router.push('/reader-create/' + reader.pk);
            },
            deleteReader(reader) {
                if(confirm("Do you really want to delete?")) {
                    apiService.deleteReader(reader.pk).then(response => {
                        if (response.status === 204) {
                            router.push('/reader-list/deleted/')
                            this.getReaders()
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
