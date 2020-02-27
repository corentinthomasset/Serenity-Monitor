<template>
    <div id="filter_activity" :key="sentinel.address">
        <h2>Activity</h2>
        <apexchart ref="realtimeChart" type="area" :options="options" :series="series" height="100px"/>
    </div>
</template>

<script>
    import FirewallEvent from "../../store/Models/FirewallEvent";

    export default {
        name: "FilterActivity",
        props: ['sentinel'],
        data() {
            return ({
                interval: 0,
                series: [{
                    name: 'Accepted packets',
                    data: []
                }, {
                    name: 'Dropped packets',
                    data: []
                }],
                acceptedPackets: [],
                droppedPackets: [],
                update: 0,
                options: {
                    chart: {
                        id: 'activity',
                        toolbar: {
                            show: false
                        },
                        sparkline: {
                            enabled: true
                        },
                        animations: {
                            enabled: true,
                            easing: 'linear',
                            dynamicAnimation: {
                                speed: 1000
                            }
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        range: 150000
                    },
                    markers: {
                        size: 0,
                        style: 'hollow',
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2,
                    },
                    fill: {
                        opacity: 0.4
                    },
                    colors:[
                        '#1de476',
                        '#ff1a51'
                    ],
                    tooltip: {
                        x:{
                            show:false
                        }
                    }
                }
            });
        },
        computed:{
            address(){
                return this.sentinel.address;
            }
        },
        methods: {
            resetChart(){
                let now = new Date().getTime();
                this.acceptedPackets = [];
                this.droppedPackets = [];
                for(let i = 150; i > 0; i--){
                    this.acceptedPackets.push([now - i * 1000, 0]);
                    this.droppedPackets.push([now - i * 1000, 0]);
                }
            }
        },
        watch:{
          address(){
              this.resetChart();
          }
        },
        created() {
            this.$nextTick(()=>{
                this.resetChart();

                this.interval = setInterval(()=>{
                    let now = new Date().getTime();
                    let event = FirewallEvent.query().where('address', this.sentinel.address).where('timestamp', value => value > now - 1000).get()[0];
                    if(event){
                        this.acceptedPackets.push([now, event.allow]);
                        this.droppedPackets.push([now, event.deny]);

                    } else {
                        this.acceptedPackets.push([now, 0]);
                        this.droppedPackets.push([now, 0]);
                    }
                    this.$refs.realtimeChart.updateSeries([
                        {
                            data: this.acceptedPackets
                        },
                        {
                            data: this.droppedPackets
                        },
                    ]);
                }, 1000);

            });
        },
        beforeDestroy() {
           clearInterval(this.interval);
        }
    }
</script>

<style>
    .apexcharts-canvas{
        margin: auto;
        overflow: hidden;
        border-radius: 10px;
    }
    .apexcharts-tooltip.light{
        border:none;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .apexcharts-svg{
        overflow: visible;
    }

</style>
