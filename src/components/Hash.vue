<template>
    <span class="hash">
        {{shortHash}}
        <div class="full_hash" v-if="showFullHash">{{hash}}</div>
    </span>
</template>

<script>
export default {
    name: 'Hash',
    props: ['hash'],
    data() {
        return ({
            showFullHash: false
        });
    },
    computed: {
        shortHash() {
            return this.hash.slice(0, 3) + this.hash.slice(-3);
        },
    },
    methods: {
        toggleFullHash() {
            this.showFullHash = !this.showFullHash;
        },
    },
};
</script>

<style scoped>
.hash{
    cursor: pointer;
    position: relative;
}

.hash .full_hash{
    position: absolute;
    top: 1em;
    background: #fff;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    z-index: 10;
}
</style>
