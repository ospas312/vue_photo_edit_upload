<template>
    <div>
        <article v-for="(location, idx) in locations" :key="idx">
            <img class="img-base" :src="location.image">
            <h1>{{ location.name }}</h1>
            <button @click="deleteLocation(location.id)">Delete</button>
        </article>
        <form @submit="addLocation(name, image)">
            <input v-model="name" placeholder="Location Name">
            <input v-model="image" placeholder="Location Image URL">
            <button type="submit">Add New Location</button>
        </form>
    </div>
</template>

<script>
    import { db } from '../main'
    export default {
        name: 'Firebase',
        data () {
            return {
                locations: [],
                name:'',
                image:'',
            }
        },
        firestore () {
            return {
                locations: db.collection('locations').orderBy('createdAt')
            }
        },
        methods: {
            addLocation (name, image) {     
                const createdAt = new Date()
                db.collection('locations').add({ name, image, createdAt })
            },
            deleteLocation (id) {   
                db.collection('locations').doc(id).delete()
            },
        },
    }

</script>

<style scoped>
.img-base{
    width: 300px;
    height: 300px;
}
</style>