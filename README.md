# Darkelposho-SD-Tarea1
#Instrucciones de uso
Instalar Archivos del github 
Dirigirse a la carpeta Tarea1 en un terminal
Escribir en la terminal ```Docker-compose up```
Dirigirse a la dirección `localhost:3000/inventory/search` 
En el buscador escribir lo que se busca, como por ejemplo  `localhost:3000/inventory/search?q=SSD`
 
# Configuracion de Redis
Para configurar el cache en redis se utilizó el comando especial CONFIG SET, este comando permite realizarla mientras se encuentra funcionando el servidor. Para configurar el cache con una memoria de 5mb y con protocolo de remoción LRU se realizan los siguientes pasos.

1. se escribe en la consola del servidor:
redis-cli
2. Se antepone un CONFIG SET para los comandos de configuración, lo que resulta en el comando para fijar la memoria como:
 CONFIG SET maxmemory 5mb
3. Para fijar el protocolo de remoción se escribe:
 CONFIG SET maxmemory-policy allkeys-lru
3.1 En el caso de que se decida fijar el protocolo de remoción lfu la línea resulta en:
CONFIG SET maxmemory-policy allkeys-lfu

# Comparación de LRU y LFU
Las diferencias principales entre lru y lfu se pueden resumir, en que lru almacena las llaves con un dato de orden, eliminando siempre la más antigua, por lo que si existe una gran variedad de entradas, no necesariamente vaya a ser util. En cambio lfu esta orientado a almacenar las llaves dependiendo de la cantidad de veces que son accesadas, por lo que elminaria constantemente la llave menos accesada en la cache. El problema para este protocolo seria que se llene el cache, y luego se ingresen llaves con una gran variedad por lo que eliminaria siempre la última entrada.

#Estudiantes 
* Guillermo Correa
* Alejandro Alvarez 
