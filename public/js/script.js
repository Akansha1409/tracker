const socket=io();//with this connection request goes to backend

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit("send-location",{latitude,longitude});
        },
        (error)=>{
            console.log('Geolocation:',error);
        },
        {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0,//caching is 0
        }
    );
}
const map=L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"&copy; <a href='https://www.openstreetmap.org/copyright'>"

    }).addTo(map);

    const markers={};

    socket.on("receive-location",(data)=>{
        const {id,latitude,longitude}=data;   
        map.setView([latitude,longitude]);
        if(markers[id]){
            markers[id].setLatLng([latitude,longitude]);
        }else{
            markers[id]=L.marker([latitude,longitude]).addTo(map);
        }
    });
    socket.on("user-disconnected", (id)=>{
        if(markers[id]){
         map.removeLayer(markers[id]);
         delete markers[id];
        }
    })
