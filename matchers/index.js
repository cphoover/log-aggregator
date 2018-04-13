const db = require('../models');
const logger = require('../helpers/logger');

const matchers = [
  {
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\] Started (\w+) "(.+)" for (\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b) at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} -\d{4})/,
    action: async ([requestId, method, url, ipAddress, datetime], msg) => {
      await db.Request.upsert({
        requestId,
        method,
        url,
        ipAddress,
        datetime,
      });
      return db.Log.create({
        requestId,
        msg,
        type: 'start',
      });
    },
  },
  {
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\] Processing by ([^\s]+) as (\w+)/,
    action: async ([requestId, controller, format], msg) => {
      await db.Request.upsert({
        requestId,
        controller,
        format,
      });
      return db.Log.create({
        requestId,
        msg,
        type: 'processing',
      });
    },
  },
  {
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]\s+Rendered (.*) \((.+)ms/,
    action: async ([requestId, template, time], msg) => {
      await db.Request.upsert({
        requestId,
      });

      return Promise.all([
        db.Log.create({
          requestId,
          msg,
          type: 'rendered',
        }),
        db.Render.create({
          requestId,
          template,
          benchmark: Number(time) * 1000, // @todo what if NaN
        }),
      ]);
    },
  },
  {
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]\s+Parameters: (.*)/,
    action: async ([requestId, parameters], msg) => {
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
  },
  {
    regex: /\[([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]\s+Completed (\d+)[^\d]+(\d+)ms \(Views: ((?:\d|\.)+)ms \| ActiveRecord: ((?:\d|\.)+)ms/,
    action: async ([requestId, statusCode, totalTime, viewTime, dbTime], msg) => {
      await db.Request.upsert({
        requestId,
        statusCode,
        overallBenchmark: Number(totalTime) * 1000,
        viewBenchmark: Number(viewTime) * 1000,
        dbBenchmark: Number(dbTime) * 1000,
      });

      db.Log.create({
        requestId,
        msg,
        type: 'completed',
      });
    },
  },
];

module.exports = async line => matchers.forEach(async ({ regex, action }) => {
  try {
    logger.debug(line);
    const matches = line.match(regex);
    if (matches) {
      logger.debug('match found');
      const captures = Array.from(matches).slice(1);
      action(captures, line);
    }
  } catch (err) {
    logger.error('oh no', err);
  }
});
