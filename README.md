# Log Aggregator
### Disclaimer
It has been my experience in the past that parsing metadata out of logs is the wrong way to go about the problem. Particularly when you control the application domain. Instead we should be preferring loggers that serialize messages in an easily digestible format like JSON (e.g. bunyan or pino for node.js).

Metric data should not really be conveyed in logs, but rather instead using a metric library like statsd.

### What is it?
This is a UDP4 server. Think of it as a shitty Log Stash or FluentD, with no tests. 

IMO Logs should not take priority in network traffic, and should be the first network traffic to get dropped when bandwidth becomes a concern (hence we use UDP). UDP has no guarentees and it is possible/probable that some logs get lossed. TCP log aggregation could make sense too... It just depends how critical saving your logs is, and how much log data you have.

In a production scenario there is a collection agent on the client server; Each log line is a UDP packet sent to the aggregator, which would be on one or more remote hosts.

The aggregator has a set of matchers, or RegExes with capture groups that parse the log lines, and build rich queryable object(s) for the request, related metadata. Once these rich objects have been created from the parsed logs they are then inserted into a Postgres DB.

#### Entities
* Request
  * The parent entity that represents the entire transaction made to the server
* Log
  * A record of all the log lines, and their original message
* Render
  * A record of anytime a template is rendered. Includes the template location and how long it took. 


#### Matchers
Matchers can be found in the `ROOT/matchers` directory.
As previously stated, these objects specify RegEx patterns with capture groups, and the means for persisting rich queryable objects.

Here is an example object that will add parameters to the  request object.

```
  { 
    // this line defines the capture groups
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]\s+Parameters: (.*)/, 
    //this function describes how to persist that captured data
    action: async ([requestId, parameters], msg) => { 
      // the request should always be created first
      // because it is a parent entity
      // otherwise you will get fk constraint errors
      await db.Request.upsert({ 
        requestId, 
        parameters, 
      }); 
 
      return db.Log.create({ 
        requestId, 
        msg, 
        type: 'parameters', 
      }); 
    }, 
  }
```    

### Get it up and running

##### Dependencies
* yarn
* Postgres (tested on 10.3)
* node.js (tested on v9.8.0)

##### Running Postgres
If you have docker installed you can just run the following command.

```
docker run \
  -p 5432:5432 \
  -e POSTGRES_USER=pguser \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=default \
  -d postgres
```
  
##### Configure DB Connection

The defaults can be found in `ROOT/config/default.js` and should look like:

```
module.exports = {
  db: {
    username: 'pguser',
    password: 'mysecretpassword',
    database: 'default',
    host: 'localhost',
    dialect: 'postgres',
  },
};
```  

Any of these values can be overridden with the following environment variables.

```
# inside ~/.bash_profile
export POSTGRES_USER="customUser"
export POSTGRES_PASS="customPass"
export POSTGRES_DB="customdb"
export POSTGRES_HOST="customHost"
```

**Note** If you are using docker-machine (e.g my older macbook) you will need to change the postgres host to the ip address of the vm.
##### Installing Node Dependencies
`> yarn `

##### Create Tables/Build DB Schema
`> yarn migrate`

##### Starting the Server
`> yarn start`

Once you start the server you should see something like:

```
$ yarn start | ./node_modules/.bin/pino
yarn run v1.5.1
$ node ./server
[2018-04-13T19:34:11.268Z] INFO (4206 on myMachine-MBP.fios-router.home): server listening 0.0.0.0:41234
```

This means your log aggregator is up and running!!

Test it by sending a sample log!

```
echo '[c6f3dce0-2e05-4741-9215-0ec71601487f] Completed 200 OK in 388ms (Views: 388.0ms | ActiveRecord: 0.0ms)' >/dev/udp/127.0.0.1/41234
```

If sql logging is enabled you should see the query to insert/update the request object.

##### Simulating a stream of log messages

So in a production situation you would be using something like a daemon tailing your log file, like [filebeat](https://www.elastic.co/products/beats/filebeat) or a different transport for your log.

*I've even written such a utility before in the past with my prior [Collector](https://github.com/cphoover/Collector) project*

But in this demo we will simulate a stream of users using the sample.log file

```
$ yarn simulate-logs
```

this just runs the `ROOT/udp_sender.sh` file which very simply just sends a udp packet to the server for each log line.

```
#!/bin/bash
cat sample.log | while read line
  do
    echo "$line" >/dev/udp/127.0.0.1/41234
  done
```

**Note** if you wanted to convert this to a utility that tails an open log file you could simply replace `cat sample.log | ...` with `gtail -f -n 0 sample.log | ...` and then if more lines are written to it they will be sent to the server.


# There ya have it.
Your Log aggregator is now storing every new log message in a relational db. 

Try querying it.

#### Sort Requests by time (microseconds)
```
select * from "Request" where "dbBenchmark" is not null order by "overallBenchmark" desc
```

#### Find requests with non 200 status codes
```
select * from "Request" where "statusCode" is not null and "statusCode" <> '200'
```

#### Find the most frequently visiting ip addresses
```
select COUNT(1) as "hits", "ipAddress" from "Request" group by "ipAddress" order by "hits" DESC
```

# TODO

* Add tests
