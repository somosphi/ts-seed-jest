# Typescript Seed Backend

## Description
This is a template repository to serve as seed for new projects developed @somosphi. This repo uses Typescript as development language, Jest as test framework and other main packages.

**Obs**: This project is developed based in [this repo](https://github.com/somosphi/node-ts-seed).

### Installing and testing the app

```s
$ npm install
$ npm run test
```

### Building production version
 
```s
$ npm install
$ npm run build
```

### TSLint

```s
$ npm install
$ npm run lint
```

## Requirements
If you want to run locally you will need:

- Docker
- MySQL Docker image
- RabbitMQ Docker image
- Kubernetes Cluster (**optional**)

### Execution Steps
1. Start MySQL Docker
```s
$ docker run --name mysql -e MYSQL_ROOT_USERNAME=my-username -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:5.7
```

2. Start RabbitMQ Server Docker
```s
$ docker run --hostname rabbitmq-host --name rabbitmq -e RABBITMQ_ERLANG_COOKIE=my-cookie -p 15672:15672 -p 5672:5672 -d rabbitmq:3.8
```

1. Add a user to the RabbitMQ
```s
$ docker run --rm -it rabbitmq:3.8 rabbitmqctl add_user my-username my-password
```

4. For the user to access the [RabbitMQ Management Web UI](https://www.rabbitmq.com/management.html), we need to set the created user as *administrator*
```s
$ docker run --rm -it rabbitmq:3.8 rabbitmqctl set_user_tags my-username administrator
```

5. In the management console, we need to:
   1. Create the vHost
      1. Select the `Admin` tab
      2. In the top right, select the `Virtual Hosts` option
      3. Add the name to your virtual host -- this name will be used in the `.env` file in the property `RABBIT_VHOST_HOME`
      4. Click in `Add virtual host`
   3. Create the queues. This project is using 3 queues, `tsseed.user.create`, `tsseed.user.find` and `tsseed.user.notify`.
      1. Select the `Queues` tab
      2. Select the created virtual host
      3. Add the queue name in the form and select the `Lazy Mode` option, in the bottom of the form.
      4. Click in `Add queue`
   2. Create the exchanges and bind the queues. In this project is used 2 exchanges, `tsseed.dx` (direct) and `tsseed.fx` (fanout)
      1. Select the `Exchanges` tab
      2. At the form to create the exchange, select the created virtual host
      3. Add a name for the exchange. For `direct exchanges` add the `.dx` sufix and for the `fanout exchanges` add the `.fx` sufix
      4. Click in `Add exchange`
      5. Select the `tsseed.dx` exchange to bind the direct queues
         1. In the bind form, select `To queue` and add the name of the queue. For this direct exchange you need to bind the `tsseed.user.create` and `tsseed.user.find` queues
      6. Go back to the exchange list and select the `tsseed.fx` exchange to bind the fanout queues
         1. In the bind form, select `To queue` and add the name of the queue. For this fanout exchange you need to bind the `tsseed.user.notify` queue and add the `user.create` routing key
         2. Again, you need to bind the `tsseed.fx` exchange to the `tsseed.user.notify` queue and add the `user.get` routing key
6. Run the MySQL migrations: `npm run migrate:up`
7. Add the environment variables to the `.env` file
8. Run the server in development mode: `npm run dev`
