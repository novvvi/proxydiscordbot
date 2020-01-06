
*** MONGODB Command setup

create a file in /etc/mongodb.conf
add 
net:
  port: 27017
  bindIp: 127.0.0.1,<youripaddress>


db.adminCommand('getCmdLineOpts'); 
to check if bindIp added


ubuntu setup

Next let’s install PM2, a process manager for Node.js applications. PM2 makes it possible to daemonize applications so that they will run in the background as a service.

- sudo npm install pm2@latest -g
pm2 start hello.js


https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04