<template>
    <div class="empty_set">
        <font-awesome-icon class="icon" :icon="['fas',icon]" size="3x"/>
        <h2>{{desc}}</h2>
    </div>
</template>

<script>
export default {
    name: "Empty",
    props: ['desc', 'icon']
}
</script>

<style scoped>
.empty_set{
    text-align: center;
    padding: 20px;
    margin: 10px 0;
    animation: slide-bottom 0.5s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.empty_set h2{
    font-weight: 400;
    width: 70%;
    color: rgba(50,50,93,0.1);
    margin: 0;
}
.empty_set .icon{
    padding: 10px;
    color: rgba(50,50,93,0.1);
}
</style>
