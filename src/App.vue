<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700');
body{
  font-family: 'Source Sans Pro', sans-serif;
  color: #32325d;
  background: #f9fafe;
  margin: 0;
}

#app{
  position: relative;
}

.view{
  display: grid;
  grid-template-columns: 350px 1fr 350px;
}

.view > * {
  padding: 15px;
  overflow-y: auto;
  height: 100vh;
  box-sizing: border-box;
}

.view > *:first-child {
  border-right: 1px solid rgba(173, 181, 189, 0.2);
}

.view > *:last-child {
  border-left: 1px solid rgba(173, 181, 189, 0.2);
}

.view > *:first-child, .view > *:last-child{
  background: linear-gradient(#7100ff0f, #fff);
}

h1 {
  margin: 0;
  border-bottom: 1px solid rgba(173, 181, 189, 0.2);
  font-size: 1.2em;
  font-weight: 400;
  text-transform: uppercase;
  background: -webkit-linear-gradient(#7100ff, #c027ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

}

h2 {
  font-size: 1em;
  font-weight: 300;
  color: #adb5bd;
}

.list_header h2{
  display: inline-block;
  vertical-align: middle;
}

.action_menu{
  display: inline-flex;
  padding: 0;
  list-style: none;
  float: right;
  vertical-align: middle;
  align-items: center;
  font-size: .8em;
}

.action_menu li{
  padding: 0 5px;
  margin: 0 2px;
  color: #777;
  cursor: pointer;
}

.search_bar input{
  background: none;
  border: none;
  padding: 5px 0;
  width: 100px;

}

.search_bar input:focus{
  outline: none;
}

.search_bar label{
  cursor: pointer;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search_bar{
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
}

.list_card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
  cursor: pointer;
  animation: pop .2s ease;
  animation-fill-mode: forwards;
  opacity: 0;
}

.list_card .node_icon{
  transform: scale(0.8);
}

.card{
  box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
  background: #fff;
  width: 275px;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 5px 2px;
}

.card_body{
  width: 100%;
  padding: 4px 2px;
  border-collapse: collapse;
}

.card_body th{
  opacity: 0.5;
  font-size: 0.8em;
  color: #adb5bd;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
}

.card_body tr{
  font-size: 0.75em;
  font-weight: 600;
  padding: 5px 7px;
  position: relative;
  text-align: center;
}

.card_body td:not(:first-child):not(:last-child), .card_body th:not(:first-child):not(:last-child){
  border-left: 1px solid rgba(173, 181, 189, 0.15);
  border-right: 1px solid rgba(173, 181, 189, 0.15);
}

.back{
  position: absolute;
  top: 10px;
  left: 10px;
}

@keyframes slide {
  0%{
    opacity: 0;
    transform: translateX(15px);
  }

  100%{
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes slide-bottom {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes pop {
  0%{
    opacity: 0;
    transform: scale(.8);
  }

  100%{
    opacity: 1;
    transform: scale(1);
  }
}
</style>
